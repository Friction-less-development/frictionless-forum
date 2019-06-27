// JavaScript source code
var Future = Npm.require('fibers/future');

Meteor.methods({
    //note createuser is already defined
    createPm: function (title, contents, toUsername) {
        if (this.userId) {
            check(title, String);
            check(contents, String);
            check(toUsername, String);
            if (Meteor.users.findOne({ username: toUsername }) == null) {
                throw new Meteor.Error('username-doesnt-exist', 'There is no one by that username!');
            }
            if (Meteor.users.findOne({ username: toUsername })._id == this.userId) {
                throw new Meteor.Error('self-pm', 'You can\'t send a PM to yourself!');
            }
            var sender = this.userId;

            //Contents get crypted here with owner's key.
            var fromContents = CryptoJS.AES.encrypt(contents, Meteor.users.findOne(this.userId).services.password.bcrypt);
            //Contents get crypted here with sent's key.
            var toContents = CryptoJS.AES.encrypt(contents, Meteor.users.findOne({ username: toUsername }).services.password.bcrypt);

            //Title get crypted here with owner's key.
            var fromTitle = title;
            //Title get crypted here with sent's key.
            var toTitle = title;

            var deferred = new Future;
            IncomingMessages.insert({
                    title: toTitle,
                    contents: toContents.toString(),
                    from: sender,
                    owner: Meteor.users.findOne({ username: toUsername })._id,
                    createdAt: new Date(),
                    readYet: false
            }, function (err, res) {
                if (err) {
                    deferred.throw(err);
                } else {
                    OutgoingMessages.insert({
                        title: fromTitle,
                        contents: fromContents.toString(),
                        owner: sender,
                        to: Meteor.users.findOne({ username: toUsername })._id,
                        createdAt: new Date(),
                        readYet: false,
                        otherId: res
                    }, function (err, res) {
                        if (err) {
                            deferred.throw(err);
                        } else {
                            deferred.return(res);
                        }
                    });
                }
                });
            try {
                return deferred.wait();
            }
            catch (err) {
                // Replace this with whatever you want sent to the client.
                throw new Meteor.Error("error", err);
            }
        } else {
            throw new Meteor.Error('no-user', 'You need to be logged in.');
        }
    },
    getIncomingPm: function (pmid) {
        if (this.userId) {
            check(pmid, String);
            var message = IncomingMessages.findOne(pmid);
            if (message == null) {
                throw new Meteor.Error('message-doesnt-exist', 'There is no message!');
            }
            if (message.owner != this.userId) {
                throw new Meteor.Error('message-ownership', 'You don\'t own this message!');
            }

            //Decypt content
            var content = CryptoJS.AES.decrypt(message.contents, Meteor.users.findOne(this.userId).services.password.bcrypt);

            IncomingMessages.update({ _id: pmid }, { $set: { readYet: true }});
            OutgoingMessages.update({ otherId: pmid }, { $set: { readYet: true }});

            return content.toString(CryptoJS.enc.Utf8);

        } else {
            throw new Meteor.Error('no-user', 'You need to be logged in.');
        }
    },
    getOutgoingPm: function (pmid) {
        if (this.userId) {
            check(pmid, String);
            var message = OutgoingMessages.findOne(pmid);
            if (message == null) {
                throw new Meteor.Error('message-doesnt-exist', 'There is no message!');
            }
            if (message.owner != this.userId) {
                throw new Meteor.Error('message-ownership', 'You don\'t own this message!');
            }

            //Decypt content
            var content = CryptoJS.AES.decrypt(message.contents, Meteor.users.findOne(this.userId).services.password.bcrypt);

            return content.toString(CryptoJS.enc.Utf8);

        } else {
            throw new Meteor.Error('no-user', 'You need to be logged in.');
        }
    },
    editPm: function (pmid, title, contents) {
        check(pmid, String);
        check(title, String);
        check(contents, String);
        if (!this.userId) {
            throw new Meteor.Error('not-logged-in', 'You need to be logged in!');
        }
        var doc = OutgoingMessages.findOne(pmid);
        if (doc.owner != this.userId) {
            throw new Meteor.Error('message-ownership', 'You don\'t own this message! This incident will be reported.');//that's just scare tactics, though we COULD report it in the future.
        }
        var altDoc = IncomingMessages.findOne({ _id: doc.otherId });
        if (!altDoc) {
            throw new Meteor.Error('message-deleted', 'Either something went wrong or the other person already deleted that message.');
        }
        if (altDoc.readYet) {
            throw new Meteor.Error('message-opened', 'The other user already read that message.');
        }
        var fromContents = CryptoJS.AES.encrypt(contents, Meteor.users.findOne(this.userId).services.password.bcrypt);
        var toContents = CryptoJS.AES.encrypt(contents, Meteor.users.findOne({ _id: doc.to }).services.password.bcrypt);

        var deferred = new Future;

        IncomingMessages.update({ _id: altDoc._id }, { $set: {title: title, contents: toContents.toString(), createdAt: new Date()}}, function (err) {
            if (err) {
                deferred.throw(err);
            } else {
                OutgoingMessages.update({ _id: doc._id }, { $set: {title: title, contents: fromContents.toString(), createdAt: new Date()}}, function (err) {
                    if (err) {
                        deferred.throw(err);
                    } else {
                        deferred.return(true);
                    }
                });
            }
        });
        try {
            return deferred.wait();
        }
        catch (err) {
            throw new Meteor.Error("error", err);
        }
    },
    deleteOutPm: function (pmid) {
        check(pmid, [String]);
        if (!this.userId) {
            throw new Meteor.Error('not-logged-in', 'You need to be logged in!');
        }
        var doc = OutgoingMessages.find({ _id: { $in: pmid } }).fetch();
        if (doc.length == 0) {
            throw new Meteor.Error('pm-doesn\'t exist', 'That pm doesn\'t exist!');
        }
        var deferred = new Future;
        if (doc.readYet) {//It's in sentbox so we only delete our copy.
            OutgoingMessages.remove({
                _id: { $in: pmid } }, function (err, res) {
                if (err) {
                    deferred.throw(err);
                } else {
                    deferred.return(true);
                }
            });
        } else {//It's in outbox, so we delete the corresponding pm as well.
            var otherIds = [];
            doc.forEach(function (thisDoc) {
                otherIds.push(thisDoc.otherId);
            });
            IncomingMessages.remove({
                _id: { $in: otherIds } }, function (err, res) {
                if (err) {
                    deferred.throw(err);
                } else {
                    OutgoingMessages.remove({
                        _id: { $in: pmid }}, function (err, res) {
                        if (err) {
                            deferred.throw(err);
                        } else {
                            deferred.return(true);
                        }
                    });
                }
            });
        }
        try {
            return deferred.wait();
        }
        catch (err) {
            throw new Meteor.Error("error", err);
        }
    },
    deleteInPm: function (pmid) {
        check(pmid, [String]);
        if (!this.userId) {
            throw new Meteor.Error('not-logged-in', 'You need to be logged in!');
        }
        var doc = IncomingMessages.findOne(pmid[0]);    //This just makes sure there's at least one valid document. In the future we MAY want to make sure that all of them are valid?
        if (!doc) {
            throw new Meteor.Error('pm-doesn\'t exist', 'That pm doesn\'t exist!');
        }
        var deferred = new Future;
        IncomingMessages.remove({
            _id: { $in: pmid } }, function (err, res) {
            if (err) {
                deferred.throw(err);
            } else {
                deferred.return(true);
            }
        });
        try {
            return deferred.wait();
        }
        catch (err) {
            throw new Meteor.Error("error", err);
        }
    }
});

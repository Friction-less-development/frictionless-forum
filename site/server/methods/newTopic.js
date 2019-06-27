// JavaScript source code
var Future = Npm.require('fibers/future');

Meteor.methods({
    createNewTopic: function (title, content, subforum) {
        if (this.userId) {
            check(title, String);
            check(content, String);
            var time = new Date;
            if (SuperTopics.findOne(subforum) == null) {
                throw new Meteor.Error("That is not a valid subforum.");
            }

            var deferred = new Future;

            Topics.insert({
                title: title,
                content: content,
                owner: this.userId,
                createdAt: time,
                bumpedAt: time
            }, function (err, res) {
                if (err) {
                    throw new Meteor.Error(err);
                } else {
                    SuperTopics.update({ _id: subforum }, { $push: { contents: res } });
                    deferred.return(res);
                }
            });
            return deferred.wait();
        } else {
            throw new Meteor.Error("You need to be logged in");
        }
    },
    createNewTopicReply: function (content, topicId) {
        if (this.userId) {
            check(content, String);
            check(topicId, String);
            if (Topics.findOne(topicId) == null) {
                throw new Meteor.Error("Replied-to topic not specified");
            }

            var time = new Date;

            var deferred = new Future;

            TopicReplies.insert({
                content: content,
                owner: this.userId,
                createdAt: time
            }, function (err, res) {
                if (err) {
                    throw new Meteor.Error(err);
                } else {
                    Topics.update({ _id: topicId }, { $set: { bumpedAt: time } });
                    Topics.update({ _id: topicId }, { $push: { replies: res } }, function (err, res) {
                        if (err) {
                            throw new Meteor.Error(err);
                        } else {
                            deferred.return(res);
                        }
                    });
                }
            });
            return deferred.wait();
        } else {
            throw new Meteor.Error("You need to be logged in");
        }
    },
    editTopic: function (title, content, docId) {
        check(content, String);
        check(title, String);
        check(docId, String);
        if (!this.userId) {
            throw new Meteor.Error("You need to be logged in");
        }
        var doc = Topics.findOne(docId);
        if (!doc) {
            throw new Meteor.Error("That post doesn't exist.");
        }
        if (doc.owner != this.userId) {
            throw new Meteor.Error("You don't own that post.");
        }
        Topics.update({ _id: docId }, { $set: { content: content, title: title, lastUpdated: new Date() } });
        return true;
    },
    editTopicReply: function (content, docId) {
        check(content, String);
        check(docId, String);
        if (!this.userId) {
            throw new Meteor.Error("You need to be logged in");
        }
        var doc = TopicReplies.findOne(docId);
        if (!doc) {
            throw new Meteor.Error("That post doesn't exist.");
        }
        if (doc.owner != this.userId) {
            throw new Meteor.Error("You don't own that post.");
        }
        TopicReplies.update({ _id: docId }, { $set: { content: content, lastUpdated: new Date() } });
        return true;
    },
    deleteTopicReply: function (docId) {
        check(docId, String);
        if (!this.userId) {
            throw new Meteor.Error("You need to be logged in");
        }
        var doc = TopicReplies.findOne(docId);
        if (!doc) {
            throw new Meteor.Error("That post was already deleted.");
        }
        if (doc.owner != this.userId) {
            throw new Meteor.Error("You don't own that post.");
        }
        var parentDoc = Topics.findOne({ replies: docId });
        if (!parentDoc) {
            throw new Meteor.Error("That post doesn't exist?");
        }
        if (parentDoc.replies[parentDoc.replies.length - 1] != docId) {
            throw new Meteor.Error("You can only delete a post if it's the most recent reply to the topic.");
        }
        TopicReplies.remove({ _id: docId });
        Topics.update({ _id: parentDoc._id }, { $pull: { replies: docId } });
        return true;
    }
});
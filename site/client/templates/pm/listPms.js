Template.listPms.events({
    'click .newPm': function (event, template) {
        Router.go("createPm");
    },
    'click .sentByPm': function (event, template) {
        if (template.data.in) {
            Router.go("profile", { userid: this.from });
        } else {
            Router.go("profile", { userid: this.to });
        }
    },
    'click .pmSubject': function (event, template) {
        if (template.data.in) {
            Router.go("readInPm", { pmid: this._id });
        } else {
            Router.go("readOutPm", { pmid: this._id });
        }
    },
    'click .massDelete': function (event, template) {
        var ids = [];
        var elems = $(':checkbox.pmCheck');
        if (elems.length == 0) {
            M.toast({ html: "Select at least one pm first." });
            return;
        }
        for (var i = 0; i < elems.length; i++) {
            ids.push(elems[i].id.split("delete")[1]);
        }
        if (confirm("Are you sure you want to delete " + elems.length + " messages forever?")) {
            var functionName = "";
            if (template.data.in) {
                functionName = "deleteInPm";
            } else {
                functionName = "deleteOutPm";
            }
            Meteor.call(functionName, ids, function (err, response) {
                if (err) {
                    M.toast({ html: "There's been an error: " + err });
                } else {
                    if (elems.length == 1) {
                        M.toast({ html: "Message has been deleted!" });
                    } else {
                        M.toast({ html: "Messages have been deleted!" });
                    }
                }
            });
        }
    }
});

Template.listPms.helpers({
    isRead: function (boole) {
        if (!boole) {
            return "'position: relative; background-color: #cadceb;'";
        } else {
            return "position: relative";
        }
    },
    getName: function (id) {
        if (Template.instance().data.in) {
            if (IncomingMessages.findOne(id)) {
                return Meteor.users.findOne(IncomingMessages.findOne(id).from).username;
            }
        } else {
            if (OutgoingMessages.findOne(id)) {
                return Meteor.users.findOne(OutgoingMessages.findOne(id).to).username;
            }
        }
    }
});

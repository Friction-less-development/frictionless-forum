Template.readInPm.events({
    'click .postUsername': function (event, template) {
        Router.go('profile', { userid: this._id });
    },
    'click .pmDeleteButton': function (event, template) {
        if (confirm("Are you sure you want to delete this messages forever?")) {
            Router.go("receivedPms");
            Meteor.call("deleteInPm", [this._id], function (err, response) {
                if (err) {
                    M.toast({ html: "There's been an error: " + err });
                } else {
                    M.toast({ html: "Message has been deleted!" });
                }
            });
        }
    }
});

Template.readInPm.helpers({
    getContent: function (id) {
        var template = Template.instance();
        Meteor.call('getIncomingPm', id, function (err, res) {
            if (err) {
                M.toast({ html: err });
            } else {
                TemplateVar.set(template, 'message', { content: res });                
            }
        });
        return TemplateVar.get(template, "message");
    },
    getUserData: function (id) {
        return Meteor.users.findOne(id);
    },
    getName: function (id) {
        return Meteor.users.findOne(id).username;
    }
});
Template.readOutPm.events({
    'click .postUsername': function (event, template) {
        Router.go('profile', { userid: this._id });
    },
    'click .pmEditButton': function (event, template) {
        TemplateVar.set(template, "inPmEditMode" + this._id, true);
    },
    'click .pmDeleteButton': function (event, template) {
        if (confirm("Are you sure you want to delete this message forever?")) {
            Router.go("receivedPms");
            Meteor.call("deleteOutPm", [this._id], function (err, response) {
                if (err) {
                    M.toast({ html: "There's been an error: " + err });
                } else {
                    M.toast({ html: "Message has been deleted!" });
                }
            });
        }
    },
    'submit .editPm': function (event, template) {
        event.preventDefault();
        var id = this._id;
        var content = $('[name=content]').val();
        var title = $('[name=title]').val();
        if (content.length < 1 || title.length < 1) {
            Materialize.toast("Please make sure all fields are filled out.");
            return;
        }
        Meteor.call("editPm", id, title, content, function (err, response) {
            if (err) {
                M.toast({ html: "There's been an error: " + err });
            } else {
                TemplateVar.set(template, "inPmEditMode" + id, false);
            }
        });
    }
});

Template.readOutPm.helpers({
    getContent: function (id) {
        var template = Template.instance();
        Meteor.call('getOutgoingPm', id, function (err, res) {
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
    },
    isEditing: function (id) {
        return TemplateVar.get(Template.instance(), "inPmEditMode" + id);
    }
});
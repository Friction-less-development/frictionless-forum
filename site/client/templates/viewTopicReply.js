Template.viewTopicReply.events({
    'click .postUsername': function (event, template) {
        Router.go('profile', { userid: this._id });
    },
    'click .authorName': function (event, template) {
        Router.go('profile', { userid: this.owner });
    },
    'click .editReply': function (event, template) {
        TemplateVar.set(template, "inEditMode" + this._id, true);
    },
    'click .deleteReply': function (event, template) {
        var topicId = Router.current().params.topicid;
        if (confirm("Are you sure you want to delete this message for good?")) {
            Meteor.call("deleteTopicReply", this._id, function (err, response) {
                if (err) {
                    M.toast({ html: "There's been an error: " + err });
                } else {
                    Router.go('viewTopic', { topicid: topicId }, { query: 's=last' });
                }
            });
        }
    },
    'submit .editTopicReply': function (event, template) {
        event.preventDefault();
        var id = this._id;
        var content = $('[name=content]').val();
        if (content.length < 1) {
            M.toast({ html: "Please submit text into the body of the topic." });
            return;
        }
        Meteor.call("editTopicReply", content, this._id, function (err, response) {
            if (err) {
                M.toast({ html: "There's been an error: " + err });
            } else {
                TemplateVar.set(template, "inEditMode" + id, false);
            }
        });
    }
});

Template.viewTopicReply.helpers({
    getName: function (id) {
        return Meteor.users.findOne(id).username;
    },
    getUserData: function (id) {
        return Meteor.users.findOne(id);
    },
    getYear: function (dat) {
        return dat.getFullYear();
    },
    getMonth: function (dat) {
        return dat.getMonth()+1;
    },
    getDate: function (dat) {
        return dat.getDate();
    },
    inEditMode: function (id) {
        return TemplateVar.get(Template.instance(), "inEditMode" + id);
    },
    isOwner: function (id) {
        if (TopicReplies.findOne(id)) {
            return TopicReplies.findOne(id).owner == Meteor.userId();
        }
    },
    isLastPost: function (id) {
        var doc = Topics.findOne({ replies: id });
        return doc.replies[doc.replies.length-1] == id;
    }
});
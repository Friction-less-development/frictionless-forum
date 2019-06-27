Template.newTopicReply.events({
    'submit .newTopicReply': function (event) {
        event.preventDefault();
        var content = $('[name=content]').val();
        if (content.length < 1) {
            M.toast({ html: "Please submit text into the body of the topic." });
            return;
        }
        var id = this._id;
        Meteor.call("createNewTopicReply", content, id, function (err, response) {
            if (err) {
                M.toast({ html: "There's been an error: " + err });
            } else if (response.error) {
                M.toast({ html: "There's been an error: " + response.error });
            } else {
                M.toast({ html: "Post successful." });
                $('[name=content]').val("");
                PostSubs.reset();
                Router.go('viewTopic', { topicid: id }, { query: 's=last' });
            }
        });

    }
});

Template.newTopicReply.helpers({
    user: function () {
        if (Meteor.userId()) {
            return true;
        } else {
            return false;
        }
    }
});
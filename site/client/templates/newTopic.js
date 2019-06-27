Template.newTopic.events({
    'submit .newTopic': function (event, template) {
        event.preventDefault();
        var title = $('[name=title]').val();
        var content = $('[name=content]').val();
        if (title.length < 1) {
            M.toast({ html: "Please submit a title." });
            return;
        }
        if (content.length < 1) {
            M.toast({ html: "Please submit text into the body of the topic." });
            return;
        }
        Meteor.call("createNewTopic", title, content, template.data.supertopicid, function (err, response) {
            if (err) {
                M.toast({ html: "There's been an error: " + err });
            } else if (response.error) {
                M.toast({ html: "There's been an error: " + response.error });
            } else {
                PostSubs.clear();
                Router.go("viewTopic", { topicid: response});
            }
        });

    }
});
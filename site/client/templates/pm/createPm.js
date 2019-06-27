Template.createPm.events({
    'submit .createPm': function (event) {
        event.preventDefault();
        var to = $('[name=to]').val();
        var title = $('[name=title]').val();
        var content = $('[name=content]').val();
        if (content.length < 1) {
            M.toast({ html: "Please submit text into the body of the topic." });
            return;
        }
        if (to.length < 1) {
            M.toast({ html: "Please label who you'd like to send the pm to." });
            return;
        }
        if (title.length < 1) {
            M.toast({ html: "Please submit a subject line." });
            return;
        }
        Meteor.call("createPm", title, content, to, function (err, response) {
            if (err) {
                M.toast({ html: "There's been an error: " + err });
            } else {
                M.toast({ html: "Post successful." });
                Router.go("receivedPms");
            }
        });
    }
});
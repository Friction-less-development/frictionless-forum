Template.register.events({
    'submit .register': function (event) {
        event.preventDefault();
        var email = $('[name=email]').val();
        var username = $('[name=username]').val();
        var password = $('[name=password]').val();
        if (email.length < 4) {
            M.toast({ html: "Please submit a valid email." });
            return;
        }
        if (username.length < 1) {
            M.toast({ html: "Please submit a username." });
            return;
        }
        if (password.length < 8) {
            M.toast({ html: "Please make a password that is longer then 8 characters." });
            return;
        }

        Meteor.call("createNewUser", email, username, password, function (err, response) {
            if (err) {
                M.toast({ html: "There's been an error: " + err });
            } else if (response.error) {
                M.toast({ html: "There's been an error: " + response.error });
            } else {
                M.toast({ html: "Great, check your email for verification (Not currently implemented, just log in normally.)." });
                Router.go("home");
            }
        });

    }
});
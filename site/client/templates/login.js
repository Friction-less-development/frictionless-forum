Template.login.events({
    'submit .login': function (event) {
        event.preventDefault();
        var username = $('[name=username]').val();
        var password = $('[name=password]').val();
        if (username.length < 1) {
            M.toast({ html: "Please submit a username." });
            return;
        }
        if (password.length < 1) {
            M.toast({ html: "Please submit a password." });
            return;
        }

        Meteor.loginWithPassword(username, password, function (err, res) {
            if (err) {
                M.toast({ html: err });
            } else {
                Router.go("home");
            }
        });

    }
});
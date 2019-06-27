// JavaScript source code
Meteor.methods({
    //note createuser is already defined
    createNewUser: function (email, username, password) {
        check(email, String);
        check(username, String);
        check(password, String);
        if (Accounts.findUserByEmail(email)) {
            throw new Meteor.Error('email-already-exists', 'Sorry, that email already exists in our system!');
        }
        if (Meteor.users.findOne({username: username})) {
            throw new Meteor.Error('username-already-exists', 'Sorry, that username is already taken!');
        }
        
        var user = Accounts.createUser({
            email: email,
            password: password,
            username: username,
            verified: false
        });

        if (user) {
            return true;
        } else {
            throw new Meteor.Error('signup-error', 'Sorry, please try again later!');
        }
    }
});
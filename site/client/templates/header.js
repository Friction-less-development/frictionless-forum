Template.header.helpers({
  
});

Template.header.events({
  'click .logout': function(event, template){
      Meteor.logout(function (err, response) {
          if (err) {
              M.toast({ html: "There's been an error: " + err });
          } else {
              Router.go('home');
          }
      })
    },
    'click .register': function (event, template) {
        Router.go('register');
    },
    'click .login': function (event, template) {
        Router.go('login');
    },
    'click .portal': function (event, template) {
        Router.go('home');
    },
    'click .profile': function (event, template) {
        Router.go('profile', {userid: Meteor.userId()});
    },
    'click .messages': function (event, template) {
        Router.go('receivedPms');
    },
    'click .index': function (event, template) {
        Router.go('index');
    }
});

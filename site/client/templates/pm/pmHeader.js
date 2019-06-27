Template.pmHeader.events({
    'click .newPm': function (event, template) {
        Router.go("createPm");
    },
    'click .inboxPm': function (event, template) {
        Router.go("receivedPms");
    },
    'click .sentboxPm': function (event, template) {
        Router.go("sentPms");
    },
    'click .outboxPm': function (event, template) {
        Router.go("outPms");
    }
});

Template.pmHeader.helpers({

});

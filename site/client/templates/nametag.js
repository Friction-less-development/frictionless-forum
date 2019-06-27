Template.nametag.helpers({
    getName: function (id) {
        return Meteor.users.findOne(id).username;
    }
});
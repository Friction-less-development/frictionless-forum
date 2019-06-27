// JavaScript source code
Meteor.methods({
    getPostCount: function (id) {
        check(id, String);
        if (Meteor.users.findOne(id) == null) {
            throw new Meteor.Error('username-doesnt-exists', 'Sorry, that user doesn\'t exist');
        }
        
        return Topics.find({ owner: id }).fetch().length + TopicReplies.find({ owner: id }).fetch().length;
    }
});
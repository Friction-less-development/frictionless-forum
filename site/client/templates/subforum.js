Template.subforum.events({
    'click .forumTitle': function (event, template) {
        Router.go("viewTopic", { topicid: this._id });
    },
    'click .newTitle': function (event, template) {
        Router.go("newTopic", { supertopicid: this.forum._id});
    },
    'click .newTitleOut': function (event, template) {
        Router.go("login");
    }
});

Template.subforum.helpers({
    getName: function (id) {
        return Meteor.users.findOne(id).username;
    },
    getReplyData: function (doc) {
        return doc.replies ? doc.replies.length : 0;
    },
    getLastReply: function (doc) {
        if (doc.replies) {
            PostSubs.subscribe("topicReplies", doc._id);
            return TopicReplies.findOne(doc.replies[0]);
        }
    }
});
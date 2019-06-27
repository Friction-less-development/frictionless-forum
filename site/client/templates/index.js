Template.index.events({
    'click .topicTitle': function (event, template) {
        var thingId = event.currentTarget.id;
        Router.go("viewTopic", { topicid: thingId });
    },
    'click .forumTitle': function (event, template) {
        Router.go('subforum', { supertopicid: this._id });
    },
    'click .installForums': function (event, template) {
        Meteor.call('tempSetupSuper');
    }
});

Template.index.helpers({
    count: function (tee) {
        return tee ? tee.length : 0;
    },
    countReplies: function (tee) {
        var total = 0;
        if (tee) {
            tee.forEach(function (cur) {
                if (Topics.findOne(cur).replies) {
                    total += Topics.findOne(cur).replies.length;
                }
            });
        }
        return (tee ? tee.length : 0) + (total ? total : 0);
    },
    getRecentReply: function (tee) {
        if (tee) {
            return Topics.findOne({ _id: { $in: tee } }, { sort: { bumpedAt: -1 } });
        }
    }
});

Meteor.publish('topics', function () {
    this.autorun(function (computation) {
        var st;
        if (this.userId) {
            st = SuperTopics.find({});
        } else {
            st = SuperTopics.find({ hidden: false });
        }
        var tee = [];
        st.fetch().forEach(function (element) {
            if (element.contents) {
                tee = tee.concat(element.contents);
            }
        });
        return Topics.find({ _id: { $in: tee } });
    });
});

Meteor.publish('topicReplies', function (id) {
    this.autorun(function (computation) {
        var replyArray = Topics.findOne(id) ? Topics.findOne(id).replies : [];
        if (this.userId || SuperTopics.findOne({ contents: id }).hidden == false) {
            return TopicReplies.find({ _id: { $in: replyArray } });
        }
    });
});

Meteor.publish('supertopics', function () {
    if (this.userId) {
        return SuperTopics.find({});
    } else {
        return SuperTopics.find({hidden: false});
    }
});


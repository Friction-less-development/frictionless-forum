import SimpleSchema from 'simpl-schema';
Topics = new Mongo.Collection('topics');

var TopicSchema = new SimpleSchema({
    title: {
        type: String,
        optional: false
    },
    createdAt: {
        type: Date,
        optional: false
    },
    content: {
        type: String,
        optional: false
    },
    owner: {
        type: String,
        optional: false
    },
    replies: {
        type: Array,
        optional: true
    },
    'replies.$': {
        type: String,
        optional: true
    },
    lastUpdated: {
        type: Date,
        optional: true
    },
    bumpedAt: {
        type: Date,
        optional: false
    }
});

Topics.attachSchema(TopicSchema);

TopicReplies = new Mongo.Collection('topicReplies');

var TopicReplySchema = new SimpleSchema({
    createdAt: {
        type: Date,
        optional: false
    },
    content: {
        type: String,
        optional: false
    },
    owner: {
        type: String,
        optional: false
    },
    lastUpdated: {//for edits.
        type: Date,
        optional: true
    }
});

TopicReplies.attachSchema(TopicReplySchema);


/*
* Allow
*/


Topics.allow({
  insert: function(){
    return false;
  },
  update: function(){
    return false;
  },
  remove: function(){
    return false;
  }
});

TopicReplies.allow({
    insert: function () {
        return false;
    },
    update: function () {
        return false;
    },
    remove: function () {
        return false;
    }
});

/*
* Deny
*/


Topics.deny({
  insert: function(){
    return true;
  },
  update: function(){
    return false;
  },
  remove: function(){
    return true;
  }
});


TopicReplies.deny({
    insert: function () {
        return true;
    },
    update: function () {
        return false;
    },
    remove: function () {
        return true;
    }
});


Topics.after.insert(function (userId, doc) {
    var newCount = Meteor.users.findOne(doc.owner).postCount;
    if (newCount == null) {
        newCount = 1;
    } else {
        newCount++;
    }
    Meteor.users.update({ _id: doc.owner }, { $set: { postCount: newCount }});
});

Topics.after.remove(function (userId, doc) {
    //This currently removes all the replies and removes post counts too. We might not want this to happen in the final product
    var newCount = Meteor.users.findOne(doc.owner).postCount;
    newCount--;
    Meteor.users.update({ _id: doc.owner }, { $set: { postCount: newCount } });

    doc.replies.forEach(function (curDoc) {
        var curOwner = TopicReplies.findOne(curDoc).owner;
        var newCount = Meteor.users.findOne(doc.owner).postCount;
        newCount--;
        Meteor.users.update({ _id: curOwner }, { $set: { postCount: newCount } });
        TopicReplies.remove(curDoc);
    });
});

TopicReplies.after.insert(function (userId, doc) {
    var newCount = Meteor.users.findOne(doc.owner).postCount;
    if (newCount == null) {
        newCount = 1;
    } else {
        newCount++;
    }
    Meteor.users.update({ _id: doc.owner }, { $set: { postCount: newCount } });
});

TopicReplies.after.remove(function (userId, doc) {
    var newCount = Meteor.users.findOne(doc.owner).postCount;
    newCount--;
    Meteor.users.update({ _id: doc.owner }, { $set: { postCount: newCount } });
});
import SimpleSchema from 'simpl-schema';

SuperTopics = new Mongo.Collection('supertopics');

var SuperTopicSchema = new SimpleSchema({
    title: {
        type: String,
        optional: false
    },
    description: {
        type: String,
        optional: false
    },
    contents: {
        type: Array,
        optional: true
    },
    'contents.$': {
        type: String,
        optional: true
    },
    hidden: {
        type: Boolean,
        optional: false
    },
    sortOrder: {
        type: SimpleSchema.Integer,
        optional: false
    }
});

SuperTopics.attachSchema(SuperTopicSchema);

/*
* Allow
*/

SuperTopics.allow({
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

/*
* Deny
*/

SuperTopics.deny({
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

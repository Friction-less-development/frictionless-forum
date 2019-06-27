import SimpleSchema from 'simpl-schema';
OutgoingMessages = new Mongo.Collection('pmOut');
IncomingMessages = new Mongo.Collection('pmIn');

var OutgoingMessagesSchema = new SimpleSchema({
    title: {
        type: String,
        optional: false
    },
    contents: {
        type: String,
        optional: false
    },
    owner: {
        type: String,
        optional: false
    },
    to: {
        type: String,
        optional: false
    },
    createdAt: {
        type: Date,
        optional: false
    },
    readYet: {
        type: Boolean,
        optional: false
    },
    otherId: {
        type: String,
        optional: false
    }
});

var IncomingMessagesSchema = new SimpleSchema({
    title: {
        type: String,
        optional: false
    },
    contents: {
        type: String,
        optional: false
    },
    from: {
        type: String,
        optional: false
    },
    owner: {
        type: String,
        optional: false
    },
    createdAt: {
        type: Date,
        optional: false
    },
    readYet: {
        type: Boolean,
        optional: false
    }
});

OutgoingMessages.attachSchema(OutgoingMessagesSchema);
IncomingMessages.attachSchema(IncomingMessagesSchema);

/*
* Allow
*/

OutgoingMessages.allow({
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

IncomingMessages.allow({
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

OutgoingMessages.deny({
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

IncomingMessages.deny({
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

import SimpleSchema from 'simpl-schema';

var UserSchema = new SimpleSchema({
    emails: {
        type: Array,
        optional: false
    },
    'emails.$': {
        type: Object,
        blackbox: true,
        optional: true
    },
    createdAt: {
        type: Date
    },
    username: {
        type: String,
        blackbox: true
    },

    profile: {
        type: Object,
        optional: true,
        blackbox: true
    },
    friends: {
        type: Array,
        optional: true
    },
    'friends.$': {
        type: String,
        optional: true
    },
    foes: {
        type: Array,
        optional: true
    },
    'foes.$': {
        type: String,
        optional: true
    },
    services: {
        type: Object,
        blackbox: true
    },
    postCount: {
        type: SimpleSchema.Integer,
        optional: true
    }
});

Meteor.users.attachSchema(UserSchema);

/*
* Allow
*/


Meteor.users.allow({
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


Meteor.users.deny({
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
/*
Meteor.users.after.insert(function(userId, doc){
  
});


*/
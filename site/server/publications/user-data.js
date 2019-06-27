Meteor.publish('user', function() {
    if (this.userId) {
        return Meteor.users.find({ _id: this.userId }, {
            fields: { _id: 1, createdAt: 1, emails: 1, username: 1, profile: 1, friends: 1, foes: 1, postCount: 1 }
        });
    } else {
        this.ready();
    }
});

Meteor.publish('user-other', function () {
    if (this.userId) {
        return Meteor.users.find({}, {
            fields: { _id: 1, createdAt: 1, username: 1, profile: 1, postCount: 1 }
        });
    } else {
        return Meteor.users.find({}, {
            fields: { _id: 1, createdAt: 1, username: 1, postCount: 1 }
        });
    }
});
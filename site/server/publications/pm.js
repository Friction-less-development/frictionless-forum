Meteor.publish('incomingMessages', function () {
    if (this.userId) {
        return IncomingMessages.find({ owner: this.userId }, { fields: { 'title': 1, 'owner': 1, 'from': 1, 'createdAt': 1, 'readYet': 1 } });
    }
});

Meteor.publish('outgoingMessages', function () {
    if (this.userId) {
        return OutgoingMessages.find({ owner: this.userId }, { fields: { 'title': 1, 'owner': 1, 'to': 1, 'createdAt': 1, 'readYet': 1 } });
    }
});
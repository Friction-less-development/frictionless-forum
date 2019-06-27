Router.route('createPm', {
    path: '/personalmessage/create',
    template: 'createPm',
    layoutTemplate: 'header',
    waitOn: function () {
        return [PostSubs.subscribe('user'), PostSubs.subscribe('user-other')];
    }
});

Router.route('receivedPms', {
    path: '/personalmessage/inbox',
    template: 'listPms',
    layoutTemplate: 'header',
    waitOn: function () {
        return [PostSubs.subscribe("user"), PostSubs.subscribe('user-other'), PostSubs.subscribe("incomingMessages")];
    },
    data: function () {
        return {
            pms: IncomingMessages.find({}, { sort: { createdAt: -1 } }).fetch(),
            in: true
        };
    },
    onBeforeAction: function () {
        if (Meteor.userId == null) {
            Router.go('home');
        } else {
            this.next();
        }
    }
});

Router.route('outPms', {
    path: '/personalmessage/outbox',
    template: 'listPms',
    layoutTemplate: 'header',
    waitOn: function () {
        return [PostSubs.subscribe("user"), PostSubs.subscribe('user-other'), PostSubs.subscribe("outgoingMessages")];
    },
    data: function () {
        return {
            pms: OutgoingMessages.find({ readYet: false }, { sort: { createdAt: -1 } }).fetch(),
            in: false
        };
    },
    onBeforeAction: function () {
        if (Meteor.userId == null) {
            Router.go('home');
        } else {
            this.next();
        }
    }
});

Router.route('sentPms', {
    path: '/personalmessage/sentbox',
    template: 'listPms',
    layoutTemplate: 'header',
    waitOn: function () {
        return [PostSubs.subscribe("user"), PostSubs.subscribe('user-other'), PostSubs.subscribe("outgoingMessages")];
    },
    data: function () {
        return {
            pms: OutgoingMessages.find({ readYet: true }, { sort: { createdAt: -1 } }).fetch(),
            in: false
        };
    },
    onBeforeAction: function () {
        if (Meteor.userId == null) {
            Router.go('home');
        } else {
            this.next();
        }
    }
});

Router.route('readInPm', {
    path: '/personalmessage/readin/:pmid',
    template: 'readInPm',
    layoutTemplate: 'header',
    waitOn: function () {
        return [PostSubs.subscribe("user"), PostSubs.subscribe('user-other'), PostSubs.subscribe("incomingMessages")];
    },
    data: function () {
        return IncomingMessages.findOne(this.params.pmid);
    },
    onBeforeAction: function () {
        if (!IncomingMessages.findOne(this.params.pmid)) {
            Router.go('home');
        } else {
            this.next();
        }
    }
});

Router.route('readOutPm', {
    path: '/personalmessage/readout/:pmid',
    template: 'readOutPm',
    layoutTemplate: 'header',
    waitOn: function () {
        return [PostSubs.subscribe("user"), PostSubs.subscribe('user-other'), PostSubs.subscribe("outgoingMessages")];
    },
    data: function () {
        return OutgoingMessages.findOne(this.params.pmid);
    },
    onBeforeAction: function () {
        if (!OutgoingMessages.findOne(this.params.pmid)) {
            Router.go('home');
        } else {
            this.next();
        }
    }
});
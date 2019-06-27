Router.route('home', {
    path: '/',
    template: 'home',
    layoutTemplate: 'header',
    waitOn: function () {
        return [PostSubs.subscribe('user'), PostSubs.subscribe('user-other')];
    }
});

Router.route('newTopic', {
    before: function () {
        if (!Meteor.user()) {
            Router.go('login');
        } else {
            this.next();
        }
    },
    path: '/newTopic/:supertopicid',
    template: 'newTopic',
    layoutTemplate: 'header',
    waitOn: function () {
        return [PostSubs.subscribe('user')];
    },
    data: function () {
        return { supertopicid: this.params.supertopicid };
    }
});

Router.route('register', {
    path: '/register',
    template: 'register',
    layoutTemplate: 'header'
});

Router.route('login', {
    path: '/login',
    template: 'login',
    layoutTemplate: 'header'
});

Router.route('index', {
    path: '/index',
    template: 'index',
    layoutTemplate: 'header',
    waitOn: function () {
        return [PostSubs.subscribe("topics"), PostSubs.subscribe("supertopics"), PostSubs.subscribe("user"), PostSubs.subscribe('user-other')];
    },
    data: function () {
        return { forum: SuperTopics.find({}, { sort: { sortOrder: 1 } }).fetch() };
    }
});

Router.route('subforum', {
    path: '/index/:supertopicid',
    template: 'subforum',
    layoutTemplate: 'header',
    waitOn: function () {
        return [PostSubs.subscribe("topics"), PostSubs.subscribe("supertopics"), PostSubs.subscribe("user"), PostSubs.subscribe('user-other')];
    },
    data: function () {
        if (this.ready()) {
            var topicList = SuperTopics.findOne(this.params.supertopicid);
            var cont = [];
            if (topicList.contents != null) {
                cont = topicList.contents;
            }
            return {
                forum: SuperTopics.findOne(this.params.supertopicid),
                topics: Topics.find({ _id: { $in: cont } }, { sort: { bumpedAt: -1 } })
            };
        }
    }
});

Router.route('profile', {
    path: '/profile/:userid',
    template: 'profile',
    layoutTemplate: 'header',
    waitOn: function () {
        return [PostSubs.subscribe("user"), PostSubs.subscribe('user-other')];
    },
    data: function () {
        return Meteor.users.findOne(this.params.userid);
    },
    onBeforeAction: function () {
        if (Meteor.users.findOne(this.params.userid) == null|| Meteor.userId == null) {
            Router.go('home');
        } else {
            this.next();
        }
    }
});

Router.route('viewTopic', {
    path: '/topic/:topicid',
    template: 'viewTopic',
    layoutTemplate: 'header',
    waitOn: function () {
        return [PostSubs.subscribe("user"), PostSubs.subscribe('user-other'),  PostSubs.subscribe("topics"), PostSubs.subscribe("topicReplies", this.params.topicid)];
    },
    data: function () {
        return Topics.findOne({ _id: this.params.topicid });
    },
    onBeforeAction: function () {
        if (this.ready()) {
            if (this.params.query.s == "last") {
                let curTopic = this.params.topicid;
                let replyLength = Topics.findOne(this.params.topicid).replies.length;
                let curPage = (replyLength) - (replyLength % 20);
                if (curPage == replyLength) { curPage -= 20; }
                //this.params.query.s = curPage;
                Router.go('viewTopic', { topicid: curTopic }, { query: 's=' + curPage });
            } else if (this.params.query.s && (this.params.query.s % 20 != 0 || this.params.query.s > (Topics.findOne(this.params.topicid).replies ? Topics.findOne(this.params.topicid).replies.length : 0))) {//To prevent users from accidentally or intentionally messing up paging.
                Router.go('viewTopic', { topicid: this.params.topicid }, { query: 's=0' });
            }
            if (Topics.find({ _id: this.params.topicid }).fetch().length < 1) {
                Router.go('home');
            } else {
                this.next();
            }
        }
    }
});
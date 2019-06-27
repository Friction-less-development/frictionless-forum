Template.viewTopic.onCreated(function () {
    TemplateVar.set(this, "pageSize", 20);
});

Template.viewTopic.events({
    'click .postUsername': function (event, template) {
        Router.go('profile', { userid: this._id });
    },
    'click .authorName': function (event, template) {
        Router.go('profile', { userid: this.owner });
    },
    'click .editTopicButton': function (event, template) {
        TemplateVar.set(template, "inEditMode" + this._id, true);
    },
    'submit .editTopic': function (event, template) {
        event.preventDefault();
        var id = this._id;
        var content = $('[name=content]').val();
        var title = $('[name=title]').val();
        if (content.length < 1 || title.length < 1) {
            M.toast({ html: "Please make sure all fields are filled out." });
            return;
        }
        Meteor.call("editTopic", title, content, this._id, function (err, response) {
            if (err) {
                M.toast({ html: "There's been an error: " + err });
            } else {
                TemplateVar.set(template, "inEditMode" + id, false);
            }
        });
    },
    'click .nextPage': function (event, template) {
        let curPage = Router.current().params.query.s ? Router.current().params.query.s : 0;
        curPage = parseInt(curPage);
        let curTopic = Router.current().params.topicid;
        curPage += TemplateVar.get(template, "pageSize");
        Router.go('viewTopic', { topicid: curTopic }, { query: 's=' + curPage });
    },
    'click .previousPage': function (event, template) {
        let curPage = Router.current().params.query.s ? Router.current().params.query.s : 0;
        curPage = parseInt(curPage);
        let curTopic = Router.current().params.topicid;
        curPage -= TemplateVar.get(template, "pageSize");
        Router.go('viewTopic', { topicid: curTopic }, { query: 's=' + curPage });
    },
    'click .skipToPage': function (event, template) {
        let id = event.target.id.split("skipto")[1] - 1;
        let curTopic = Router.current().params.topicid;
        let nexPage = TemplateVar.get(template, "pageSize") * id;
        Router.go('viewTopic', { topicid: curTopic }, { query: 's=' + nexPage });

    }
});

Template.viewTopic.helpers({
    getName: function (id) {
        return Meteor.users.findOne(id).username;
    },
    getUserData: function (id) {
        return Meteor.users.findOne(id);
    },
    getYear: function (dat) {
        return dat.getFullYear();
    },
    getMonth: function (dat) {
        return dat.getMonth()+1;
    },
    getDate: function (dat) {
        return dat.getDate();
    },
    getTopicReplies: function (id) {
        var replyArray = Topics.findOne(id).replies;
        if (replyArray) {
            let curPage = Router.current().params.query.s ? Router.current().params.query.s : 0;
            let curSize = TemplateVar.get(Template.instance(), "pageSize");
            return TopicReplies.find({ _id: { $in: replyArray } }, { skip: parseInt(curPage), limit: curSize, sort: { createdAt: 1 } }).fetch();
        }
    },
    inEditMode: function (id) {
        return TemplateVar.get(Template.instance(), "inEditMode" + id);
    },
    isOwner: function (id) {
        if (Topics.findOne(id)) {
            return Topics.findOne(id).owner == Meteor.userId();
        }
    },
    showNextButton: function () {
        let curPage = Router.current().params.query.s ? Router.current().params.query.s : 0;
        curPage = parseInt(curPage);
        curPage += TemplateVar.get(Template.instance(), "pageSize");
        let doc = Topics.findOne(Router.current().params.topicid);
        if (!doc.replies) {
            return false;
        }
        if (curPage >= doc.replies.length) {
            return false;
        } else {
            return true;
        }
    },
    showPreviousButton: function () {
        let curPage = Router.current().params.query.s ? Router.current().params.query.s : 0;
        if (curPage == 0) {
            return false;
        } else {
            return true;
        }
    },
    numPages: function () {
        var pageArray = [];
        let doc = Topics.findOne(Router.current().params.topicid);
        if (!doc.replies) {
            return pageArray;
        }
        let j = 1;
        for (let i = 0; i < doc.replies.length; i += TemplateVar.get(Template.instance(), "pageSize")) {
            pageArray.push(j++);
        }
        if (pageArray.length > 7) {
            //get curpage
            let thisPage = Router.current().params.query.s ? Router.current().params.query.s : 0;
            thisPage = parseInt(thisPage);
            let curPage = thisPage / TemplateVar.get(Template.instance(), "pageSize");
            curPage++;

            //get lastpage
            var lastPage = Topics.findOne(Router.current().params.topicid).replies.length / TemplateVar.get(Template.instance(), "pageSize");
            lastPage = parseInt(lastPage);
            lastPage++;

            let newArray = [];
            if (curPage != 1) {
                newArray.push(1);
            }
            if (curPage - 1 > 1) {
                newArray.push("...");
                newArray.push(curPage - 1);
            }
            newArray.push(curPage);
            if (curPage + 1 < lastPage) {
                newArray.push(curPage + 1);
                newArray.push("...");
            }
            if (curPage != lastPage) {
                newArray.push(lastPage);
            }

            pageArray = newArray;
        }
        return pageArray;
    },
    isThisCurPage: function (num) {
        let thisPage = Router.current().params.query.s ? Router.current().params.query.s : 0;
        thisPage = parseInt(thisPage);
        let curPage = thisPage / TemplateVar.get(Template.instance(), "pageSize");
        TemplateVar.set(Template.instance(), "curPage", parseInt(curPage) + 1);
        return num == TemplateVar.get(Template.instance(), "curPage");
    },
    isEllipses: function (val) {
        return val == "...";
    }
});
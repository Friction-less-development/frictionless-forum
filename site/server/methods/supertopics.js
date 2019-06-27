// JavaScript source code
Meteor.methods({
    tempSetupSuper: function () {//This is only temporary. Eventually admins will make these.
        SuperTopics.insert({
            title: "Site Info",
            description: "Information about the site.",
            hidden: false,
            sortOrder: 1
        });
        SuperTopics.insert({
            title: "Announcements",
            description: "Announcements about the site.",
            hidden: false,
            sortOrder: 2
        });
        SuperTopics.insert({
            title: "Member Introductions",
            description: "Introduce yourself here!",
            hidden: false,
            sortOrder: 3
        });
        SuperTopics.insert({
            title: "The Main Area",
            description: "We talk about what it means to be green.",
            hidden: false,
            sortOrder: 4
        });
        SuperTopics.insert({
            title: "The Wicked lorem",
            description: "This is a board to discuss ipsum and dolor olor ipsum mipsum.",
            hidden: true,
            sortOrder: 5
        });
        SuperTopics.insert({
            title: "Other Stuff",
            description: "Other things.",
            hidden: false,
            sortOrder: 6
        });
        SuperTopics.insert({
            title: "Television",
            description: "Description of this forum abotu television ",
            hidden: false,
            sortOrder: 7
        });
        SuperTopics.insert({
            title: "The Other side",
            description: "This is the board about the other side. What's over there? ",
            hidden: false,
            sortOrder: 8
        });
        SuperTopics.insert({
            title: "Off-topic",
            description: "A place for other topics.",
            hidden: false,
            sortOrder: 9
        });
        SuperTopics.insert({
            title: "Mafia",
            description: "A forum for the game of Mafia",
            hidden: true,
            sortOrder: 10
        });
        SuperTopics.insert({
            title: "Forum Discussion",
            description: "Discuss the forum itself here.",
            hidden: false,
            sortOrder: 11
        });
    }
});
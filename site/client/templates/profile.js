Template.profile.events({
});

Template.profile.helpers({
    getYear: function (dat) {
        return dat.getFullYear();
    },
    getMonth: function (dat) {
        return dat.getMonth()+1;
    },
    getDate: function (dat) {
        return dat.getDate();
    }
});
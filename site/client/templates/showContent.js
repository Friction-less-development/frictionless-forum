//import md from 'markdown-it';
var MarkdownIt = require('markdown-it');
var emoji = require('markdown-it-emoji/light');

Template.showContent.events({

});

Template.showContent.helpers({
    display: function (content) {
        md = new MarkdownIt();
        md.use(emoji);
        return md.render(content);
    }
});

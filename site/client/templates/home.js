var things = [
  "This is a random statement",
  "dpont have a crolw mangus",
  "or no the to be not an plato",
  "shuffle shuffle shuffle",
  "moooo"
];
Template.home.helpers({
  getSelectedThing: function(){
    if(typeof TemplateVar.get('selectedThing', Template.instance()) == "string"){
      return TemplateVar.get('selectedThing', Template.instance());
    }
  }
});

Template.home.events({
  'click .toTempPage': function(event, template){
      Router.go("index");
  }
});

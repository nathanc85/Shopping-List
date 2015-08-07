ShoppingList = new Mongo.Collection('shoppingList');

if (Meteor.isClient) {
  Template.body.helpers({
    shoppingList: function() {
      return ShoppingList.find();
    }
  });

  Template.body.events({
    'submit .newShoppingList' : function(event) {
      //var item = event.target.newItem.value;
      var item = $('input[name="newItem"]').val();
      ShoppingList.insert({
        item: item,
        createdDate: new Date()
      });

      event.target.item.value = "";
      //$('.newShoppingList')[0].reset();

      return false;
    },
    'change .hideShow' : function(event) {
      Session.set('hideShow', event.target.checked);
    }
  });

  Template.body.helpers({
    'showSessions' : function() {
      return Session.get('hideShow');
    }
  });

  Template.line.events({
    'click .remove': function() {
      ShoppingList.remove(this._id);
    },
    'change .completed': function() {
      ShoppingList.update(this._id, {$set: {
        checked: !this.checked
      }});
    }
  });

}
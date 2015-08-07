ShoppingList = new Mongo.Collection('shoppingList');

if (Meteor.isClient) {
  Template.body.helpers({
    shoppingList: function() {
      if (Session.get('hideShow')) {
        return ShoppingList.find({checked : {$ne: true}});
      }
      return ShoppingList.find({});
    },
    'checked' : function(){
      return Session.get('hideShow');
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

      return false;
    },
    'change .hideShow' : function(event) {
      Session.set('hideShow', event.target.checked);
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
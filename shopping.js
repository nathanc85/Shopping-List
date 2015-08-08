ShoppingList = new Mongo.Collection('shoppingList');

if (Meteor.isClient) {
  Template.body.helpers({
    shoppingList: function() {
      if (Session.get('hideShow')) {
        return ShoppingList.find({checked : {$ne: true}});
      }
      return ShoppingList.find({});
    },
    checked : function(){
      return Session.get('hideShow');
    }
  });

  Template.body.events({
    'submit .newShoppingList' : function(event) {
      //var item = event.target.newItem.value;
      var item = $('input[name="newItem"]').val();

      Meteor.call('addItem', item);

      event.target.item.value = "";

      return false;
    },
    'change .hideShow' : function(event) {
      Session.set('hideShow', event.target.checked);
    }
  });

  Template.line.events({
    'click .remove': function() {
      Meteor.call('removeItem', this._id);
    },
    'change .completed': function() {
      Meteor.call('updateItem', this._id, !this.checked);
    }
  });

}

Meteor.methods({
  addItem : function (item) {
    ShoppingList.insert({
      item: item,
      createdDate: new Date()
    });
  },
  updateItem : function(id, checked) {
    ShoppingList.update({_id: id},{$set: {
      checked: checked
    }});
  },
  removeItem : function (id) {
    ShoppingList.remove(id);
  }
});
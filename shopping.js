ShoppingList = new Mongo.Collection('shoppingList');

if (Meteor.isClient) {
  Meteor.subscribe('shoppingList');

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
      //$(".col-md-3.text-center").html('Hello');
    }
  });

  Template.line.events({
    'click .remove': function() {
      Meteor.call('removeItem', this._id);
    },
    'change .completed': function() {
      Meteor.call('updateItem', this._id, !this.checked);
    },
    'click :button[name=privacy]' : function() {
      Meteor.call('updatePrivacy', this._id, !this.privacy);
    }
  });

  Template.line.helpers({
    'isOwner': function() {
      return (this.owner === Meteor.userId());
    }
  });

}


if (Meteor.isServer) {
  Meteor.publish('shoppingList', function () {
    return ShoppingList.find(
      {$or: [
        {privacy: false},
        {owner: this.userId}
      ]}
    );
  });
}


Meteor.methods({
  addItem : function (item) {
    ShoppingList.insert({
      owner : Meteor.userId(),
      privacy : false,
      checked: false,
      item: item,
      createdDate: new Date()
    });
  },
  updateItem : function(id, checked) {
    ShoppingList.update({_id: id}, {$set: {
      checked: checked
    }});
  },
  removeItem : function(id) {
    ShoppingList.remove(id);
  },
  updatePrivacy : function(id, privacy) {
    ShoppingList.update({_id: id}, {$set: {
      privacy: privacy
    }});
  }
});

//Template.registerHelper('isOwner',
//  function(v1, v2) {
//    return (v1 === v2);
//  }
//);
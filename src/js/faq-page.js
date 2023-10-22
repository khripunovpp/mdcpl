import {AnimatedExpand} from "./_service-widget";

$(function () {
  var faqLibGroupItems = new AnimatedExpand(
    {
      rootEl: '.faq-lib .toggle-group',
      itemEl: '.toggle-item',
     triggerEl: '.toggle-item__header',
      tailEl: '.toggle-item__tail',
      animatedItemsQuery: '.toggle-item__actionButtonWrap, .toggle-item__description',
      toggleBehavior: true,
      closeOthers: false,
    }
  );

  var faqLibToggleGroup = new AnimatedExpand(
    {
      rootEl: '.faq-lib',
      itemEl: '.toggle-group',
      triggerEl: '.toggle-group__header',
      tailEl: '.toggle-group__tail',
      animatedItemsQuery: '.toggle-group__actionButtonWrap, .toggle-group__columns-item,.toggle-group__description,.toggle-group__title',
      toggleBehavior: true,
      closeOthers: false,
      autoCloseNested: true,
      nested: faqLibGroupItems,
    }
  );

  var hash = window.location.hash;
  var toggleGroupId = hash.indexOf('#toggle-group-');
  if (toggleGroupId > -1) {
    var result = hash.match(/#toggle-group-(\d+)-(\d+)/);
    var groupId = result[1];
    var itemId = result[2];

    if (groupId) {
      faqLibToggleGroup.openById(groupId);
    }

    if (itemId) {
      faqLibGroupItems.openById(itemId);
    }
  } else {
    faqLibToggleGroup.openById(0);
  }

});
import {AnimatedExpand} from "./_service-widget";

$(function () {
  var servicesLibGroupItems = new AnimatedExpand(
    {
      rootEl: '.services-lib .toggle-group',
      itemEl: '.toggle-item',
      triggerEl: '.toggle-item__header',
      tailEl: '.toggle-item__tail',
      animatedItemsQuery: '.toggle-item__actionButtonWrap, .toggle-item__description',
      toggleBehavior: true,
      closeOthers: false,
    }
  );
  var servicesLibToggleGroup = new AnimatedExpand(
    {
      rootEl: '.services-lib',
      itemEl: '.toggle-group',
      triggerEl: '.toggle-group__header',
      tailEl: '.toggle-group__tail',
      animatedItemsQuery: '.toggle-group__actionButtonWrap, .toggle-group__columns-item,.toggle-group__description,.toggle-group__title',
      toggleBehavior: true,
      closeOthers: false,
      autoCloseNested: true,
      nested: servicesLibGroupItems,
    }
  );

  var hash = window.getHashGroup();

  if (hash) {
    if (hash.groupId) {
      servicesLibToggleGroup.openById(hash.groupId);
       window.goToSectionById(hash.groupId,'start');
    }

    if (hash.itemId) {
      servicesLibGroupItems.openById(hash.itemId);
    }
  } else {
    servicesLibToggleGroup.openById('home');
  }
})

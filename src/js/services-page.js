import {AnimatedExpand} from "./_service-widget";

$(function () {
  var servicesLibGroupItems = new AnimatedExpand(
    {
      rootEl: '.toggle-group',
      itemEl: '.toggle-item',
      triggerEl: '.toggle-item__toggleBtn,.toggle-item__title',
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
      triggerEl: '.toggle-group__toggleBtn,.toggle-group__title',
      tailEl: '.toggle-group__tail',
      animatedItemsQuery: '.toggle-group__actionButtonWrap, .toggle-group__columns-item,.toggle-group__description,.toggle-group__title',
      toggleBehavior: true,
      closeOthers: false,
      autoCloseNested: true,
      nested: servicesLibGroupItems,
    }
  );
  servicesLibToggleGroup.openById(0);
})

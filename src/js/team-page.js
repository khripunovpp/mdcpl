import {AnimatedExpand} from "./_service-widget";

$(function () {
  var groupItems = new AnimatedExpand(
    {
      rootEl: '.team-lib',
      itemEl: '.toggle-item',
      triggerEl: '.toggle-item__toggleBtn,.toggle-item__title',
      tailEl: '.toggle-item__tail',
      toggleBehavior: true,
      closeOthers: false,
    }
  );

  console.log({groupItems});
})

import {AnimatedExpand} from "./_service-widget";

$(function () {

  var serviceItems = new AnimatedExpand(
    '.services-group',
    '.service-item',
    '.service-item__header',
    '.service-item__tail',
    '.service-item__actionButtonWrap, .service-item__description',
    {
      toggleBehavior: true,
      closeOthers: false,
    }
  );

  var serviceGroups = new AnimatedExpand(
    '.services-lib',
    '.services-group',
    '.services-group__toggleBtn,.services-group__title',
    '.services-group__tail',
    '.services-group__actionButtonWrap, .services-group__service-item,.services-group__description,.services-group__title,.services-group__services-item',
    {
      toggleBehavior: true,
      closeOthers: false,
      autoCloseNested: true,
      nested: serviceItems,
      onExpand: function (id) {
        console.log('onExpand', id)
      },
    }
  );
  serviceGroups.openById(0)
})

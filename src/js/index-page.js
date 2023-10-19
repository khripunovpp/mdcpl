import {AnimatedExpand} from "./_service-widget";
import {ExpandableComponent} from "./_expandable";

$(function () {
  var desktopScrollerListContainerColor$ = $('.services-widget__desktopScrollerListContainer');
  var desktopScrollerListContainer$ = $('.services-widget__desktopScrollerListContainer-list');
  var serviceCards = new AnimatedExpand(
    {
      rootEl: '.services-widget',
      itemEl: '.toggle-group',
      triggerEl: '.toggle-group__title',
      tailEl: '.toggle-group__tail',
      animatedItemsQuery: '.toggle-group__actionButtonWrap, .toggle-group__subFooter-list li',
      closeOthers: true,
      onExpand: function (el) {
        var $serviceCard = $(el);
        var $serviceCardList = $serviceCard.find('.toggle-group__subFooter-list li');
        var color = $serviceCard.data('color');
        var clonedList = $serviceCardList.clone();
        desktopScrollerListContainerColor$.css('background-color', color);
        desktopScrollerListContainer$.html(clonedList);
        setTimeout(function () {
          clonedList.addClass('animate');
        }, 100);
      },
    }
  );
  serviceCards.openById(0);
  new ExpandableComponent();
})

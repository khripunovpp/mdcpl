import {AnimatedExpand} from "./_service-widget";
import {ExpandableComponent} from "./_expandable";

window.libLoaded = function () {

  var stickySidebar = new StickySidebar('.sticky-block', {
    // bottomSpacing: 20,
    containerSelector: '.services-widget__desktopScrollerListContainer',
    innerWrapperSelector: '.services-widget__desktopScrollerListContainer-list',
  });
  window.loadLazy(function () {
    setTimeout(function () {
      stickySidebar.updateSticky();
    }, 100);
  });
  var desktopScrollerListContainerColor$ = $('.services-widget__desktopScrollerListContainer');
  var desktopScrollerListContainer$ = $('.services-widget__desktopScrollerListContainer-content');
  var serviceCards = new AnimatedExpand(
    {
      rootEl: '.services-widget',
      itemEl: '.toggle-group',
      triggerEl: '.toggle-group__title',

      tailEl: '.toggle-group__tail',
      animatedItemsQuery: '.toggle-group__actionButtonWrap, .to-clone li, .to-clone p',
      closeOthers: true,
      toggleBehavior: false,
      onExpand: function (el) {
        var $serviceCard = $(el);
        var $serviceCardList = $serviceCard.find('.to-clone li, .to-clone p');
        var color = $serviceCard.data('color');
        var clonedList = $serviceCardList.clone();
        desktopScrollerListContainerColor$.css('background-color', color);
        desktopScrollerListContainer$.html(clonedList);
        setTimeout(function () {
          clonedList.addClass('animate');
          setTimeout(function () {
            stickySidebar.updateSticky();
          }, 100);
        }, 100);
      },
    }
  );
  serviceCards.openById(0);
  var teamSplide = new Splide('#team-slider', {
    type: 'loop',
    perPage: 5,
    arrowPath: '',
    perMove: 1,
    lazyLoad: 'nearby',
    breakpoints: {
      1300: {
        perPage: 4,
      },
      990: {
        destroy: true,
      },
    }
  });
  teamSplide.mount();
  var reviewsSplide = new Splide('#reviews-slider', {
    type: 'loop',
    perPage: 2,
    arrowPath: '',
    perMove: 1,
    lazyLoad: 'nearby',
    gap: 30,
    breakpoints: {
      1100: {
        perPage: 1,
      },
    }
  });
  reviewsSplide.mount();
  reviewsSplide.on('move', function (newIndex, prevIndex) {
    // find all expaned items and close them
    $('.expandable.expanded').find('.expandable__button').trigger('click');
    // updateHeight(newIndex);
  });

  new ExpandableComponent('.reviews-widget');

  function updateHeight(newIndex) {
    var isMob = window.matchMedia("only screen and (max-width: 1100px)").matches;
    if (!isMob) return;
    let slide = reviewsSplide.Components.Slides.getAt(typeof (newIndex) == 'number' ? newIndex : reviewsSplide.index).slide;
    var h = slide.querySelector('.review-card').offsetHeight;

    slide.parentElement.parentElement.style.height = (h ? h : 80) + 'px';
  }

  var slidingHover = $('.team-slider__slidingHover');
  var scale = 0.9;
  slidingHover.css({
    transform: 'scale(' + scale + ')',
  });
  var lastTranslate = 0;
  $('.team-slider__item').on('mouseenter', function (e) {
    if (window.isMobile()) return;
    var el = $(e.target).closest('.team-slider__item');
    if (!el.hasClass('is-visible')) return;
    var elOffset = el.offset();
    var parentOffset = el.closest('.splide__track').offset();
    var positionInsideParent = elOffset.left - parentOffset.left;
    lastTranslate = positionInsideParent;
    slidingHover.css({
      'transform': 'translateX(' + lastTranslate + 'px) scale(1)',
      opacity: 1,
    });
  });
  $('.splide__track').on('mouseleave', function (e) {
    if (window.isMobile()) return;
    slidingHover.css({
      opacity: 0,
      transform: 'translateX(' + lastTranslate + 'px)' + ' scale(' + scale + ')',
    });
  });
  $(window).on('resize', function () {
    slidingHover.css({
      opacity: 0,
    });
  });
  //

  // var sticky = new Sticky('.sticky-block');
}

import {ServicesWidget} from "./_service-widget";

window.libLoaded = function () {
  console.log('libLoaded');

  var teamSplide = new Splide('#team-slider', {
    type: 'loop',
    perPage: 5,
    arrowPath: '',
    perMove: 1,
    lazyLoad: 'nearby',
    breakpoints: {
      991: {
        destroy: true,
      }
    }
  });
  teamSplide.mount();

  var slidingHover = $('.team-slider__slidingHover');
  var scale = 0.9;
  slidingHover.css({
    transform: 'scale(' + scale + ')',
  });
  $(function () {
    var lastTranslate = 0;
    $('.team-slider__item').on('mouseenter', function (e) {
      if (window.isMobile()) return;
      var el = $(e.target).closest('.team-slider__item');
      console.log(el, el.hasClass('is-visible'));
      if (!el.hasClass('is-visible')) return;
      var elOffset = el.offset();
      var parentOffset = el.closest('.splide__track').offset();
      var positionInsideParent = elOffset.left - parentOffset.left;
      console.log({positionInsideParent, parentOffset, elOffset});
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
  });
}

$(function () {
  new ServicesWidget().init();
})

(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
}(function () { 'use strict';

  function ServicesWidget() {
    this.serviceCard$ = $('.service-card');
    this.desktopScrollerListContainerColor$ = $('.services-widget__desktopScrollerListContainer');
    this.desktopScrollerListContainer$ = $('.services-widget__desktopScrollerListContainer-list');
    this.title$ = this.serviceCard$.find('.service-card__title');
  }

  ServicesWidget.prototype.init = function () {
    console.log('ServicesWidget init');
    this.title$.on('click', this.openToggle.bind(this));
    this.serviceCard$.each((i, el) => {
      var items = Array.from($(el).find('.service-card__actionButtonWrap')).concat(Array.from($(el).find('.service-card__list li')));
      items.forEach((item, itemIndex) => {
        $(item).css('transition-delay', `${itemIndex * 50}ms`);
      });
    });
    this.openByIndex(0);
  };

  ServicesWidget.prototype.openToggle = function (e) {
    const $target = $(e.target);
    const index = $target.closest('.service-card').index();
    this.openByIndex(index);
  };

  ServicesWidget.prototype.openByIndex = function (index) {
    const $serviceCard = $(this.serviceCard$[index]);
    // $serviceCard[0].scrollIntoView({
    //   behavior: 'smooth',
    //   block: 'center',
    // });
    const $serviceCardList = $serviceCard.find('.service-card__list li');
    const color = $serviceCard.data('color');
    const clonedList = $serviceCardList.clone();
    this.desktopScrollerListContainerColor$.css('background-color', color);
    this.desktopScrollerListContainer$.html(clonedList);
    setTimeout(() => {
      clonedList.addClass('animate');
    }, 100);
    // закрываем все открытые карточки, кроме текущей
    if (!$serviceCard.hasClass('opened')) {
      this.serviceCard$.removeClass('opened');
      this.serviceCard$.find('.service-card__tail').removeClass('opened');
      this.serviceCard$.find('.service-card__tail').slideUp();
    }
    const $serviceCardTail = $serviceCard.find('.service-card__tail');
    $serviceCard.addClass('opened');
    $serviceCardTail.slideDown(300);
    $serviceCardTail.addClass('opened');
  };

  function ExpandableComponent() {
    document.querySelectorAll('.expandable').forEach(function (target, index) {
      var $_target = $(target);
      var $_content = $_target.find('.expandable__content');
      var $_toggleButton = $_target.find('.expandable__button');
      var _contentHeight = 0;
      console.log({_contentHeight, ch: $_content.children()});
      var _expanded = false;
      var _signs = ['Отзыв полностью', 'Свернуть'];
      var _maxVisibleHeight = 190;
      var _maxVisibleHeightMobile = 95;
      var _maxHeight = 0;


      calcHeights();
      setButtonState();

      setSign();

      $_content.css({
        height: _maxHeight > _contentHeight ? _contentHeight : _maxHeight + 'px'
      });

      $_toggleButton.on('click', function (e) {
        e.preventDefault();
        calcHeights();
        _expanded = !_expanded;
        setSign();
        $_content.animate({
          height: _expanded ? _contentHeight : _maxHeight,
        }, 500);

        $_target.toggleClass('expanded', _expanded);
      });

      $(window).on('resize', function () {
        calcHeights();
        setButtonState();
        if (_maxHeight > _contentHeight && !_expanded) {
          $_content.css({
            height: _contentHeight + 'px'
          });
        }
      });

      function setButtonState() {
        if (_maxHeight > _contentHeight) {
          $_target.removeClass('should-expand');
          $_toggleButton.hide();
        } else {
          $_target.addClass('should-expand');
          $_toggleButton.show();
        }
      }

      function calcHeights() {
        _contentHeight = $_content.children().outerHeight();
        _maxHeight = window.isMobile() ? _maxVisibleHeightMobile : _maxVisibleHeight;
      }

      function setSign() {
        $_toggleButton.text(_expanded ? _signs[1] : _signs[0]);
        $_toggleButton.attr('aria-label', _expanded ? _signs[1] : _signs[0]);
      }
    });

  }


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
    var reviewsSplide = new Splide('#reviews-slider', {
      type: 'loop',
      perPage: 2,
      arrowPath: '',
      perMove: 1,
      lazyLoad: 'nearby',
      gap: 30,
      breakpoints: {
        991: {
          perPage: 1,
        }
      }
    });
    reviewsSplide.mount();

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
  };

  $(function () {
    new ServicesWidget().init();
    new ExpandableComponent();
  });

}));

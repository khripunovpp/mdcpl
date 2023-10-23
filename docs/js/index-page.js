(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
}(function () { 'use strict';

  function AnimatedExpand(
    options
  ) {
    var transitionStep = 50;
    var that = this;
    this.options = options || {};
    this.rootEl = options.rootEl;
    this.itemEl = options.itemEl;
    this.trigger = options.triggerEl;
    this.tailEl = options.tailEl;
    this.animatedItems = options.animatedItemsQuery;

    if ($(this.rootEl).length) {
      var animate = this.options.animate !== false;
      $(this.rootEl).find(this.trigger).on('click', function (e) {
        that.open.call(that, e.target);
      });

      if (animate) {
        $(this.rootEl).find(this.itemEl).each(function (i, el) {
          var items = $(el).find(that.animatedItems);
          items.each(function (itemIndex, item) {
            $(item).css('transition-delay', itemIndex * transitionStep + 'ms');
          });
        });
      }
    }
  }

  AnimatedExpand.prototype.open = function (target) {
    var $item = $(target).closest(this.itemEl);
    var id = $item.data('id');
    this.openById(id);
  };

  AnimatedExpand.prototype.openById = function (id) {
    var that = this;
    var $el = $(this.rootEl).find(this.itemEl).filter('[data-id="' + id + '"]');
    var root$ = $el.closest(this.rootEl);
    var closeOthers = this.options.closeOthers !== false;
    var toggleClose = this.options.toggleBehavior !== false;

    // если toggleClose тогда если открыт то закрываем
    // если closeOthers тогда закрываем все остальные
    if (toggleClose && $el.hasClass('opened')) {
      this.close($el);
      return;
    }

    if (closeOthers) {
      this.close(root$.find(this.itemEl).not($el));
    }
    var $serviceCardTail = $el.find(this.tailEl);

    $el.find(this.trigger).addClass('opened');
    $el.addClass('opened');
    $serviceCardTail.slideDown(300, function () {

      if (typeof that.options.onExpand === 'function') {
        that.options.onExpand($el[0]);
      }
    });
    setTimeout(function () {
      $serviceCardTail.addClass('opened');
    }, 200);

  };

  AnimatedExpand.prototype.openNestedById = function (id) {
    this.options.nested.openById(id);
  };

  AnimatedExpand.prototype.close = function (target) {
    var $item = $(target).closest(this.itemEl);
    $item.removeClass('opened');
    $item.find(this.tailEl).slideUp(300);
    $item.find(this.tailEl).removeClass('opened');
    $item.find(this.trigger).removeClass('opened');

    var autoCloseNested = this.options.autoCloseNested !== false;
    if (autoCloseNested && this.options.nested) {
      this.options.nested.closeAll($item);
    }
  };

  AnimatedExpand.prototype.closeAll = function (rootEl) {
    var $rootEl = $(rootEl || this.rootEl);
    var $items = $rootEl.find(this.itemEl);
    this.close($items);
  };

  function ExpandableComponent(
    desktopHeight, mobileHeight, signs
  ) {
    $('.expandable').each(function (index, target) {
      var $_target = $(target);
      var $_content = $_target.find('.expandable__content');
      var $_toggleButton = $_target.find('.expandable__button');
      var buttonHeight = 60;
      var _contentHeight = 0;
      var _expanded = false;
      var _signs = signs || ['Отзыв полностью', 'Свернуть'];
      var _maxVisibleHeight = desktopHeight || 190;
      var _maxVisibleHeightMobile = mobileHeight || 110;
      var _maxHeight = 0;

      calcHeights();
      setButtonState();
      setSign();

      $_content.css({
        height: _maxHeight > _contentHeight ? _contentHeight : _maxHeight - buttonHeight + 'px'
      });

      $_toggleButton.on('click', function (e) {
        e.preventDefault();
        calcHeights();
        _expanded = !_expanded;
        setSign();
        $_content.animate({
          height: _expanded ? _contentHeight : _maxHeight - buttonHeight,
        }, _expanded ? 500 : 200);

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
        buttonHeight = window.isMobile() ? 40 : 60;
      }

      function setSign() {
        $_toggleButton.text(_expanded ? _signs[1] : _signs[0]);
        $_toggleButton.attr('aria-label', _expanded ? _signs[1] : _signs[0]);
      }
    });

  }

  window.libLoaded = function () {
    window.loadLazy();
    var desktopScrollerListContainerColor$ = $('.services-widget__desktopScrollerListContainer');
    var desktopScrollerListContainer$ = $('.services-widget__desktopScrollerListContainer-list');
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
          var $serviceCardList = $serviceCard.find('.to-clone li,.to-clone p');
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

    new ExpandableComponent('.feedbacks-lib__item');

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
    //  var stickySidebar = new StickySidebar('.sticky-block', {
    //   // bottomSpacing: 20,
    //   containerSelector: '.services-widget__desktopScrollerListContainer',
    //   innerWrapperSelector: '.services-widget__desktopScrollerListContainer-list',
    // });

    // var sticky = new Sticky('.sticky-block');
  };

}));

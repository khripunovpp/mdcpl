(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
}(function () { 'use strict';

  function AnimatedExpand(
    rootEl,
    itemEl,
    triggerEl,
    tailEl,
    animatedItemsQuery,
    options
  ) {
    console.log('AnimatedExpand init');
    var transitionStep = 50;
    var that = this;
    this.options = options || {};
    this.rootEl = rootEl;
    this.itemEl = itemEl;
    this.trigger$ = $(triggerEl);
    this.tailEl$ = $(tailEl);
    this.animatedItems$ = $(animatedItemsQuery);

    if ($(this.rootEl).length) {
      this.trigger$.on('click', function (e) {
        that.open.call(that, e.target);
      });
      $(this.itemEl).each(function (i, el) {
        var items = $(el).find(animatedItemsQuery);
        items.each(function (itemIndex, item) {
          $(item).css('transition-delay', itemIndex * transitionStep + 'ms');
        });
      });
    }
  }

  AnimatedExpand.prototype.open = function (target) {
    var $item = $(target).closest(this.itemEl);
    var id = $item.data('id');
    this.openById(id);
  };

  AnimatedExpand.prototype.openById = function (id) {
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
    var $serviceCardTail = $el.find(this.tailEl$);

    $el.find(this.trigger$).addClass('opened');
    $el.addClass('opened');
    $serviceCardTail.slideDown(300);
    setTimeout(function () {
      $serviceCardTail.addClass('opened');
    }, 200);

    if (typeof this.options.onExpand === 'function') {
      this.options.onExpand($el[0]);
    }
  };

  AnimatedExpand.prototype.close = function (target) {
    var $item = $(target).closest(this.itemEl);
    $item.removeClass('opened');
    $item.find(this.tailEl$).slideUp(300);
    $item.find(this.tailEl$).removeClass('opened');
    $item.find(this.trigger$).removeClass('opened');

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

  function ExpandableComponent() {

    $('.expandable').each(function (index, target) {
      var $_target = $(target);
      var $_content = $_target.find('.expandable__content');
      var $_toggleButton = $_target.find('.expandable__button');
      var buttonHeight = 60;
      var _contentHeight = 0;
      console.log({_contentHeight, ch: $_content.children()});
      var _expanded = false;
      var _signs = ['Отзыв полностью', 'Свернуть'];
      var _maxVisibleHeight = 190;
      var _maxVisibleHeightMobile = 110;
      var _maxHeight = 0;
      console.log({buttonHeight});

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


  $(function () {
    var desktopScrollerListContainerColor$ = $('.services-widget__desktopScrollerListContainer');
    var desktopScrollerListContainer$ = $('.services-widget__desktopScrollerListContainer-list');
    var serviceCards = new AnimatedExpand(
      '.services-widget',
      '.service-card',
      '.service-card__title',
      '.service-card__tail',
      '.service-card__actionButtonWrap, .service-card__list li',
      {
        closeOthers: true,
        onExpand: function (el) {
          console.log('onExpand', el);
          var $serviceCard = $(el);
          var $serviceCardList = $serviceCard.find('.service-card__list li');
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
  });

}));

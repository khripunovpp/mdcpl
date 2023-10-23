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
    servicesLibToggleGroup.openById(0);
  });

}));

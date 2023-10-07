(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
}(function () { 'use strict';

  function HeaderComponent() {
    this.$_header = $('.js-sticky-header');
    this._headerHeight = 0;
    this._lastScrollPosition = 0;
    this.nav$ = $('.js-navigation');
    this.burger$ = $('.burger');
    this.navEleTopLevel$ = this.nav$.find('.has-children');
    this.headerNav$ = this.$_header.find('.header__nav');
    this.headerNavBottom$ = this.headerNav$.find('.nav__bottom');
    this.logo$ = this.$_header.find('.header-logo');
    this.timerId = null;
    this.debTimer;


    this.logoLeftPart = this.logo$.find('svg #logo-left');
    this.logoIcon = this.logo$.find('svg #logo-icon');
    this.logoRightPart = this.logo$.find('svg #logo-right');

    this.logoItems = Array.from(this.logoLeftPart.find('path')).concat(this.logoRightPart);
    this.delayStep = 0.05;
    this.runLogoAnimation(false, this.delayStep);
    this.totalTime = this.logoItems.length * this.delayStep;
    this.logoIconInitPosition = this.logoIcon.position();
    this.logoSVGInitPosition = this.logo$.position();
    this.logoSVGInitWidth = this.logo$.width();
  }

  HeaderComponent.prototype.init = function () {
    console.log('HeaderComponent init');
    var that = this;
    that.$_header.addClass('show');
    that.$_header.css({
      position: 'fixed',
      top: 0,
      left: 0,
      width: "100%",
      zIndex: 5
    });
    that.setHeaderHeight.call(that);
    that.setNavHeight.call(that);
    that.setAnimationProps.call(that);

    var currentScrollPosition = $(window).scrollTop();

    $(window).on('scroll', function () {
      that.toggleMenu.call(that, false);
      if (that.debTimer) {
        clearTimeout(that.debTimer);
      }
      that.debTimer = setTimeout(function () {
        currentScrollPosition = window.scrollY != null ? window.scrollY : $(window).scrollTop();

        if (currentScrollPosition < that._headerHeight) {
          that.$_header.removeClass(['glow']);
          that.show.call(that, false);
          return false;
        }

        if (that._lastScrollPosition > currentScrollPosition) {
          that.show.call(that);

        } else if (that._lastScrollPosition < currentScrollPosition) {
          that.hide.call(that);
        }

        that._lastScrollPosition = currentScrollPosition;
      }, 50);
    });

    $(window).on('resize', function () {
      that.setHeaderHeight.call(that);
      that.setNavHeight.call(that);
      that.setAnimationProps.call(that);
    });

    that.burger$.on('click', function (e) {
      that.toggleMenu.call(that);
    });

    that.nav$.find('.caret').on('click', function (e) {
      e.preventDefault();
      $(e.target).closest('li').toggleClass('opened');
    });

    that.navEleTopLevel$.on('mouseenter', function (e) {
      if (window.isMobile()) return;
      if (that.timerId) clearTimeout(that.timerId);
      that.navEleTopLevel$.removeClass('opened');
      $(e.target).closest('li').addClass('opened');
    });

    that.navEleTopLevel$.on('mouseleave', function (e) {
      if (window.isMobile()) return;
      if (that.timerId) clearTimeout(that.timerId);
      that.timerId = setTimeout(function () {
        $(e.target).closest('li').removeClass('opened');
      }, 500);
    });

    that.nav$.on('mouseleave', function (e) {
      if (window.isMobile()) return;
      if (that.timerId) clearTimeout(that.timerId);
      that.timerId = setTimeout(function () {
        that.navEleTopLevel$.removeClass('opened');
      }, 500);
    });
  };

  HeaderComponent.prototype.setHeaderHeight = function () {
    this._headerHeight = this.$_header.outerHeight();
    $('body').css({
      paddingTop: this._headerHeight + "px"
    });
  };

  HeaderComponent.prototype.setNavHeight = function () {
    this.headerNav$.css({
      top: window.isMobile() ? this._headerHeight + "px" : 'auto',
      height: window.isMobile() ? window.innerHeight - this._headerHeight + "px" : 'auto'
    });
  };

  HeaderComponent.prototype.setAnimationProps = function () {
    var that = this;
    var items = Array.from(this.headerNav$.find('li'))
      .concat(Array.from(this.headerNavBottom$.children()));


    items.forEach(function (item, index) {
      $(item).css({
        transitionDelay: window.isMobile() ? index * 50 + 100 + "ms" : '0ms',
      });
    });

    var logoIconBox = this.logoIcon[0].getBBox();

    var logoLeftShift = window.isMobile() ? logoIconBox.x : 0;

    this.logoIcon.css({
      transform: "translate3d(-" + logoLeftShift + "px, 0, 0)",
    });

    setTimeout(function () {
      var totalTime = window.isMobile() ? that.totalTime : 0;
      // нужно изменять css  последовательно, иначе transition примениться вместе с transform
      that.logoIcon.css({
        transition: "transform " + totalTime + "s ease-in-out",
      });
      that.logo$.css({
        opacity: 1
      });
      if (window.isMobile()) {
        that.logo$.css({
          maxWidth: logoIconBox.width + "px",
        });
      }
    }, 0);
  };

  HeaderComponent.prototype.show = function (withShadow = true) {
    this.$_header.addClass(['show', withShadow ? 'glow' : '']);
    this.$_header.css({
      transform: "translate3d(0, 0, 0)",
    });
  };

  HeaderComponent.prototype.hide = function () {
    this.$_header.removeClass(['show', 'glow']);
    this.$_header.css({
      transform: "translate3d(0, -" + this._headerHeight + "px, 0)",
    });
  };

  HeaderComponent.prototype.toggleMenu = function (show) {
    var openClass = 'nav-open';
    var that = this;
    this.burger$.toggleClass(openClass, show);
    $('body').toggleClass(openClass, show);
    var showCurrent = this.burger$.hasClass(openClass);
    this.runLogoAnimation(showCurrent, that.delayStep);
  };

  HeaderComponent.prototype.runLogoAnimation = function (show, step) {
    this.logoItems.forEach(function (item, index) {
      $(item).css({
        transitionDelay: show ? index * step + "s" : "0s",
      });
    });
  };

  HeaderComponent.prototype.closeAll = function () {
    var that = this;
    if (that.timerId) clearTimeout(that.timerId);
    that.navEleTopLevel$.removeClass('opened');
  };

  var isFocus = function () {
      var fieldEl = '.form__control',
        groupEl = '.form__field',
        labelEl = '.form__label',
        onfocusClass = 'onfocus',
        value;

      $('body').addClass('js-placeholder');

      $(fieldEl).each(function () {
        value = $(this).val();
        $(this).removeAttr('placeholder');
        if (value.length > 0) $(this).closest(groupEl).addClass(onfocusClass).find(labelEl).fadeOut(200);
      });

      $(labelEl).on('click', function () {
        $(this).closest(groupEl).find(fieldEl).focus();
      });

      $(fieldEl).on('focus', function () {
        $(this).closest(groupEl).addClass(onfocusClass);
      });

      $(fieldEl).on('blur', function () {
        value = $(this).val();
        if (value.length == 0) $(this).closest(groupEl);
        $(this).closest(groupEl).removeClass(onfocusClass);
        if (value.length > 0) $(this).closest(groupEl).addClass(onfocusClass);
      });
    };

  $(function () {
    window.isMobile = function () {
      return window.matchMedia("only screen and (max-width: 991px)").matches;
    };
    var lazy = $('.lazy').Lazy({
      effect: 'fadeIn',
      effectTime: 500,
      threshold: 0,
    });
    new HeaderComponent().init();

    isFocus();
    var debugInUrl = window.location.href.indexOf('debug') > -1;
    $('body').toggleClass('debug', debugInUrl);
  });

}));

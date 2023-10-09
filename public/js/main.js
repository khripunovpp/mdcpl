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


    this.logoLeftPart = this.logo$.find('svg #hlogo-left');
    this.logoIcon = this.logo$.find('svg #hlogo-icon');
    this.logoRightPart = this.logo$.find('svg #hlogo-right');

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

    var logoIconBox = that.logoIcon[0].getBBox();

    var logoLeftShift = window.isMobile() ? logoIconBox.x : 0;

    that.logoIcon.css({
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

  function FormComponent(
    query,
    wrapperQuery,
  ) {
    this.$_target = $(query);
    this.$_wrapper = this.$_target.closest(wrapperQuery);
    this.$_form = this.$_wrapper.find('.form');
    this.$_sumbit = this.$_form.find('.form__submit');
    this.$_filesSection = this.$_form.find('.form__section--files');
    this.$_filesUploadInput = this.$_filesSection.find('.form__control');
    this.$_filesUploadButton = this.$_filesSection.find('.form__uploadBtn');
    this.$_filesList = this.$_filesSection.find('.form__filesList');
    this.$_resetButton = this.$_target.find('.js-reset');
    this.$_formFields = this.$_form.find('.form__field');
  }

  FormComponent.prototype.init = function () {
    var _this = this;

    this.$_sumbit.on('click', function () {
      _this.setLoader();
    });

    this.$_form.on('change', function () {
      _this.$_formFields.removeClass('has-error');
    });
    this.$_resetButton.on('click', function () {
      _this.reset();
    });

    this.$_filesUploadButton.on('click', function () {
      _this.$_filesUploadInput.trigger('click');
    });

    _this.$_filesUploadInput.on('change', function () {
      var files = _this.$_filesUploadInput[0].files;
      var fileItems = [];

      for (var i = 0; i < files.length; i++) {
        var fileName = files[i].name;
        var listItem$ = $('<li>').text(fileName);
        fileItems.push(listItem$);
      }

      _this.$_filesList.html(fileItems);
    });

    // check DataTransfer
    if (!DataTransfer) {
      return;
    }

    _this.$_filesList.on('click', 'li', function () {
      console.log('click');

      var listItemToRemove$ = $(this);
      var fileNameToRemove = listItemToRemove$.text();

      var files = _this.$_filesUploadInput[0].files;
      listItemToRemove$.remove();

      // Создаем новый объект DataTransfer и добавляем в него оставшиеся файлы
      var newTransfer = new DataTransfer();
      for (var j = 0; j < files.length; j++) {
        if (files[j].name !== fileNameToRemove) {
          newTransfer.items.add(files[j]);
        }
      }
      _this.$_filesUploadInput[0].files = newTransfer.files;
    });
  };


  FormComponent.prototype.setLoader = function (state = true) {
    this.$_wrapper.toggleClass('loading', state);
  };

  FormComponent.prototype.goToSuccess = function () {
    this.$_wrapper.removeClass('loading');
    this.$_wrapper.addClass('finished');
  };

  FormComponent.prototype.reset = function () {
    this.$_wrapper.removeClass(['loading', 'finished']);
  };

  function Dialog() {
    this.$_overlay = $('.overlay');
    this.$_body = $('body');
  }

  Dialog.prototype.init = function () {
    var that = this;
    $('.js-open-dialog, .js-open-sub-dialog').on('click', function (e) {
      e.preventDefault();
      var _subDialogId = $(e.target).closest('.js-open-sub-dialog').attr('data-sub-dialog-id');
      var _dialogId = $(e.target).closest(_subDialogId ? '[data-dialog-id]' : '.js-open-dialog').attr('data-dialog-id');
      var _windowOpenCallback = $(e.target).closest('[data-dialog-callback-open]').attr('data-dialog-callback-open');

      var _openFn = function (id) {
        return that.show.call(that, id, function () {
          setTimeout(function () {
            typeof window[_windowOpenCallback] === 'function' && window[_windowOpenCallback].call(window);
          }, 400);
        });
      };

      if (_subDialogId) {
        that.overlayDisplay.call(that, function () {
          that.close.call(that, _dialogId, false, function () {
            _openFn(_subDialogId);
          });
        });
      } else {
        that.overlayDisplay.call(that, function () {
          _openFn(_dialogId);
        });
      }
    });

    $('.js-close-dialog').on('click', function (e) {
      var _dialogId = $(e.target).closest('.popup').attr('data-dialog-id');
      that.close.call(that, _dialogId);
    });

  };

  Dialog.prototype.overlayDisplay = function (cb) {
    this.$_overlay.fadeIn(200, function () {
      typeof cb === 'function' && cb();
    });
  };

  Dialog.prototype.show = function (id, cb) {
    var _target = $('.popup[data-dialog-id="' + id + '"]');
    this.$_body.addClass('popup-opened');
    _target.fadeIn(0, function () {
      _target.addClass('opened');
      typeof cb === 'function' && cb();
    });
  };

  Dialog.prototype.close = function (id, withOverlay = true, cb) {
    var that = this;
    var _target = $('.popup[data-dialog-id="' + id + '"]');
    _target.fadeOut(200, function () {
      _target.removeClass('opened');
      if (withOverlay) {
        that.$_overlay.fadeOut(200);
        that.$_body.removeClass('popup-opened');
      }
      typeof cb === 'function' && cb();
    });
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
    $('.year').text(new Date().getFullYear());
    new HeaderComponent().init();
    new Dialog().init();

    isFocus();
    var debugInUrl = window.location.href.indexOf('debug') > -1;
    $('body').toggleClass('debug', debugInUrl);

    var callbackForm = new FormComponent('#callback-form', '.callback-widget__contentPart');
    callbackForm.init();

    var iframeAppointments = $('#rubitime-project__iframe-static');

    // $('.js-appointment-btn').on('click', function (e) {
    //   var btn$ = $(e.target).closest('.js-appointment-btn');
    //   var type = btn$.data('appointment-type');
    //   console.log({scope: btn$.data('scope-id')})
    //   var scope = String(btn$.data('scope-id')).split(',');
    //   var defaultScope = String(btn$.data('defscope-id')).split(',')[0];
    //   var doctor = String(btn$.data('doctor-id')).split(',');
    //   var service = String(btn$.data('service-id')).split(',');
    //   var url = window.appointmentsUrl;
    //   var iframeSrc = url;
    //
    //   if (type === 'doctor') {
    //     if (scope.length === 1) {
    //       iframeSrc += '/' + scope[0];
    //       iframeSrc += '/' + doctor[0];
    //     } else if (defaultScope) {
    //       iframeSrc += '/' + defaultScope;
    //       iframeSrc += '/' + doctor[0];
    //     }
    //   }
    //
    //   if (type === 'service') {
    //     if (scope.length > 1 || doctor.length > 1) {
    //     } else {
    //       iframeSrc += '/' + scope[0];
    //       iframeSrc += '/' + doctor[0];
    //       iframeSrc += '/' + service[0];
    //     }
    //   }
    //
    //   iframeAppointments.attr('src', iframeSrc);
    //
    //   console.log({
    //     iframeSrc
    //   })
    // });
  });

}));

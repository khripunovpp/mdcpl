export function HeaderComponent() {
  this.$_header = $('.js-sticky-header');
  this._headerHeight = 0;
  this._lastScrollPosition = 0;
  this.nav$ = $('.js-navigation');
  this.burger$ = $('.burger');
  this.navEleTopLevel$ = this.nav$.find('.has-children');
  this.headerNav$ = this.$_header.find('.header__nav');
  this.headerNavBottom$ = this.headerNav$.find('.nav__bottom');
  this.logo$ = this.$_header.find('.logo--header');
  this.logosVG$ = this.logo$.find('svg');
  this.timerId = null;
  this.debTimer;


  //id contains logo-left
  this.logoLeftPart = this.logosVG$.find('[id*="logo-left"]');
  this.logoIcon = this.logosVG$.find('[id*="logo-icon"]');
  this.logoRightPart = this.logosVG$.find('[id*="logo-right"]');

  this.logoItems = Array.from(this.logoLeftPart.find('path')).concat(this.logoRightPart);
  this.delayStep = 0.05;
  this.runLogoAnimation(false, this.delayStep);
  this.totalTime = this.logoItems.length * this.delayStep;
  this.logoIconInitPosition = this.logoIcon.position();
  this.logoSVGInitPosition = this.logo$.position();
  this.logoSVGInitWidth = this.logo$.width();
}

HeaderComponent.prototype.init = function () {
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
  var skipedContainerInViewport = false;

  function handleIntersection(entries) {
    entries.forEach(function (entry) {
      if (entry.intersectionRatio > 0.2) {
        skipedContainerInViewport = true;
      } else {
        skipedContainerInViewport = false;
      }
    });
  }

  if (window.IntersectionObserver) {
    var options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.2,
    };

    var skipElementObserver = new IntersectionObserver(handleIntersection, options);
    var elementToSkip = $('.services-widget')[0];

    if (elementToSkip) {
      skipElementObserver.observe(elementToSkip);
    }
  }

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

      if (that._lastScrollPosition > currentScrollPosition && !skipedContainerInViewport) {
        that.show.call(that);

      } else if (that._lastScrollPosition < currentScrollPosition) {
        that.hide.call(that);
      }

      that._lastScrollPosition = currentScrollPosition;
    }, 50)
  });

  var timerId = null;

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
  })
}

HeaderComponent.prototype.setHeaderHeight = function () {
  this._headerHeight = this.$_header.outerHeight();
  $('body').css({
    paddingTop: this._headerHeight + "px"
  });
}

HeaderComponent.prototype.setNavHeight = function () {
  this.headerNav$.css({
    top: window.isMobile() ? this._headerHeight + "px" : 'auto',
    height: window.isMobile() ? window.innerHeight - this._headerHeight + "px" : 'auto'
  });
}

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
      transition: window.isMobile() ? "transform " + totalTime + "s ease-in-out" : 'none',
    });
    that.logo$.css({
      opacity: 1,
      maxWidth: window.isMobile() ? logoIconBox.width + "px" : 'none',
    });
  }, 0);
}

HeaderComponent.prototype.show = function (withShadow) {
  var withShadow = withShadow != null ? withShadow : true;
  this.$_header.addClass(['show', withShadow ? 'glow' : '']);
  this.$_header.css({
    transform: "translate3d(0, 0, 0)",
  });
}

HeaderComponent.prototype.hide = function () {
  this.$_header.removeClass(['show', 'glow']);
  this.$_header.css({
    transform: "translate3d(0, -" + this._headerHeight + "px, 0)",
  });
}

HeaderComponent.prototype.toggleMenu = function (show) {
  var openClass = 'nav-open';
  var that = this;
  this.burger$.toggleClass(openClass, show);
  $('body').toggleClass(openClass, show);
  var showCurrent = this.burger$.hasClass(openClass);
  this.runLogoAnimation(showCurrent, that.delayStep);
}

HeaderComponent.prototype.runLogoAnimation = function (show, step) {
  this.logoItems.forEach(function (item, index) {
    $(item).css({
      transitionDelay: show ? index * step + "s" : "0s",
    });
  });
}

HeaderComponent.prototype.closeAll = function () {
  var that = this;
  if (that.timerId) clearTimeout(that.timerId);
  that.navEleTopLevel$.removeClass('opened');
}

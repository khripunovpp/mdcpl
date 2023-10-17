import {AnimatedExpand} from "./_service-widget";

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
    console.log({buttonHeight})

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
        console.log('onExpand', el)
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
  serviceCards.openById(0)
  new ExpandableComponent();
})

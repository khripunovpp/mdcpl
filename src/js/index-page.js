import {ServicesWidget} from "./_service-widget";

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


$(function () {
  new ServicesWidget().init();
  new ExpandableComponent();
})

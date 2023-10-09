
export function Dialog() {
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
    }

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
  })

  $('.js-close-dialog').on('click', function (e) {
    var _dialogId = $(e.target).closest('.popup').attr('data-dialog-id');
    that.close.call(that, _dialogId);
  });

}

Dialog.prototype.overlayDisplay = function (cb) {
  this.$_overlay.fadeIn(200, function () {
    typeof cb === 'function' && cb();
  });
}

Dialog.prototype.show = function (id, cb) {
  var _target = $('.popup[data-dialog-id="' + id + '"]');
  this.$_body.addClass('popup-opened');
  _target.fadeIn(0, function () {
    _target.addClass('opened');
    typeof cb === 'function' && cb();
  });
}

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
}

export function FormComponent(
  query,
  wrapperQuery
) {
  this.$_target = $(query);
  this.$_wrapper = this.$_target.closest(wrapperQuery);
  this.$_form = this.$_wrapper.find('form.form');
  this.$_sumbit = this.$_form.find('.form__submit');
  this.$_filesSection = this.$_form.find('.form__section--files');
  this.$_filesUploadInput = this.$_filesSection.find('.form__control');
  this.$_filesUploadButton = this.$_filesSection.find('.form__uploadBtn');
  this.$_filesList = this.$_filesSection.find('.form__filesList');
  this.$_resetButton = this.$_target.find('.js-reset');
  this.$_formFields = this.$_form.find('.form__field');
  this.$_formControls = this.$_form.find('.form__control');
  this.$_notification = $('body').find('.notify');
  this.init();
}

FormComponent.prototype.init = function () {
  var _this = this;

  this.$_sumbit.on('click', function () {
    _this.setLoader();
    setTimeout(function () {
      _this.goToSuccess();
    }, 3000);
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
      var listItem$ = $('<li>').text(fileName).append($('<i class="paste-sprite-cross-icon icon">'))
      fileItems.push(listItem$);
    }

    _this.$_filesList.html(fileItems);
    window.insertSprites();
  });

  // check DataTransfer
  if (!DataTransfer) {
    return;
  }

  _this.$_filesList.on('click', 'li', function () {
    console.log('click')

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

  $(window).on('scroll', function () {
    if (window['notyTimer']) {
      clearTimeout(window['notyTimer']);
    }
    _this.$_notification.fadeOut(500);
  });
}


FormComponent.prototype.setLoader = function (state) {
  var state = state || true;
  this.$_wrapper.toggleClass('loading', state);
}

FormComponent.prototype.goToSuccess = function () {
  this.$_wrapper.removeClass('loading');
  this.$_form[0].reset();
  this.$_filesList.html('');
  this.$_formFields.removeClass(['has-error', 'onfocus']);
  this.noty('Спасибо! Ваша заявка отправлена.');
}

FormComponent.prototype.noty = function (
  text,
  type
) {
  var type = type || 'success';
  var that = this;
  this.$_notification.text(text);
  this.$_notification.addClass(type);
  this.$_notification.fadeIn(500);

  if (window['notyTimer']) {
    clearTimeout(window['notyTimer']);
  }
  window['notyTimer'] = setTimeout(function () {
    that.$_notification.fadeOut(500);
  }, 3000);
};
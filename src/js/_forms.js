export function FormComponent(
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
}


FormComponent.prototype.setLoader = function (state = true) {
  this.$_wrapper.toggleClass('loading', state);
}

FormComponent.prototype.goToSuccess = function () {
  this.$_wrapper.removeClass('loading');
  this.$_wrapper.addClass('finished');
}

FormComponent.prototype.reset = function () {
  this.$_wrapper.removeClass(['loading', 'finished']);
}
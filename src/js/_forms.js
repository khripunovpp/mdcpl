export function FormsComponent() {
  this.controlClass = '.form__control';

}

FormsComponent.prototype.init = function () {
  var _this = this;
  $('.form__uploadBtn').on('click', function () {
    var section$ = $(this).closest('.form__section--files');
    var control$ = section$.find(_this.controlClass);
    control$.trigger('click');
  });

  $('.form__section--files').find(_this.controlClass).on('change', function () {
    var section$ = $(this).closest('.form__section--files');
    var fileList$ = section$.find('.form__filesList');
    var files = $(this)[0].files;
    var fileItems = [];

    for (var i = 0; i < files.length; i++) {
      var fileName = files[i].name;
      var listItem$ = $('<li>').text(fileName);
      fileItems.push(listItem$);
    }

    fileList$.html(fileItems);
  });

  // check DataTransfer
  if (!DataTransfer) {
    return;
  }

  $('.form__filesList').on('click', 'li', function () {
    console.log('click')

    var section$ = $(this).closest('.form__section--files');
    var listItemToRemove$ = $(this);
    var fileNameToRemove = listItemToRemove$.text();

    var files = section$.find(_this.controlClass)[0].files;
    listItemToRemove$.remove();

    // Создаем новый объект DataTransfer и добавляем в него оставшиеся файлы
    var newTransfer = new DataTransfer();
    for (var j = 0; j < files.length; j++) {
      if (files[j].name !== fileNameToRemove) {
        newTransfer.items.add(files[j]);
      }
    }

    // Заменяем файлы в инпуте новым объектом DataTransfer
    section$.find(_this.controlClass)[0].files = newTransfer.files;

    console.log({
      files: section$.find(_this.controlClass)[0].files,
      newFiles: newTransfer.files,
    })
  });
}
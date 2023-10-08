import {HeaderComponent} from "./_header";
import {FormsComponent} from "./_forms";

var isFocus = function () {
  var fieldEl = '.form__control',
    groupEl = '.form__field',
    labelEl = '.form__label',
    onfocusClass = 'onfocus',
    value;

  $('body').addClass('js-placeholder')

  $(fieldEl).each(function () {
    value = $(this).val();
    $(this).removeAttr('placeholder')
    if (value.length > 0) $(this).closest(groupEl).addClass(onfocusClass).find(labelEl).fadeOut(200);
  })

  $(labelEl).on('click', function () {
    $(this).closest(groupEl).find(fieldEl).focus()
  });

  $(fieldEl).on('focus', function () {
    $(this).closest(groupEl).addClass(onfocusClass)
  });

  $(fieldEl).on('blur', function () {
    value = $(this).val();
    if (value.length == 0) $(this).closest(groupEl)
    $(this).closest(groupEl).removeClass(onfocusClass);
    if (value.length > 0) $(this).closest(groupEl).addClass(onfocusClass);
  });
};

$(function () {
  window.isMobile = function () {
    return window.matchMedia("only screen and (max-width: 991px)").matches;
  }
  $('.year').text(new Date().getFullYear());
  new HeaderComponent().init();

  isFocus();
  var debugInUrl = window.location.href.indexOf('debug') > -1;
  $('body').toggleClass('debug', debugInUrl);

  new FormsComponent().init();
});
import {HeaderComponent} from "./_header";
import {FormComponent} from "./_forms";
import {Dialog} from "./_dialogs";

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
  $('.year').text(new Date().getFullYear());
  new HeaderComponent().init();
  new Dialog().init();

  isFocus();
  var debugInUrl = window.location.href.indexOf('debug') > -1;
  $('body').toggleClass('debug', debugInUrl);

  window.formsComponents = {};
  window.formsComponents['callback-form'] = new FormComponent('#callback-form', '.callback-widget');
  window.formsComponents['home-call-form'] = new FormComponent('#home-call-form', '.popup__container');

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
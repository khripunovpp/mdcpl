import {HeaderComponent} from "./_header";

$(function () {
  window.isMobile = function () {
    return window.matchMedia("only screen and (max-width: 991px)").matches;
  }
  new HeaderComponent().init();

  var debugInUrl = window.location.href.indexOf('debug') > -1;
  $('body').toggleClass('debug', debugInUrl);
});
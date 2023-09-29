import {HeaderComponent} from "./_header";

$(function () {
  window.isMobile = function () {
    return window.matchMedia("only screen and (max-width: 991px)").matches;
  }
  new HeaderComponent().init();
});
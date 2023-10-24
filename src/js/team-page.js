import {AnimatedExpand} from "./_service-widget";

window.libLoaded = function () {
  window.loadLazy();

  var galleries$ = $('.diplomas-gallery');

  galleries$.each(function (i, gallery) {
    var galelry = lightGallery(gallery, {
      speed: 500,
      download: false,
      // ... other settings
    });
  });


  var groupItems = new AnimatedExpand(
    {
      rootEl: '.team-lib',
      itemEl: '.toggle-item',
      triggerEl: '.toggle-item__header',
      tailEl: '.toggle-item__tail',
      toggleBehavior: true,
      closeOthers: false,
      onExpand: function (el) {
        window.lazyInstance.update();
      },
    }
  );
}

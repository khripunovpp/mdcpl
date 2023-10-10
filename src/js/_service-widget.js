export function ServicesWidget() {
  this.serviceCard$ = $('.service-card');
  this.desktopScrollerListContainerColor$ = $('.services-widget__desktopScrollerListContainer');
  this.desktopScrollerListContainer$ = $('.services-widget__desktopScrollerListContainer-list');
  this.title$ = this.serviceCard$.find('.service-card__title');
}

ServicesWidget.prototype.init = function () {
  console.log('ServicesWidget init');
  this.title$.on('click', this.openToggle.bind(this));
  this.serviceCard$.each(function (i, el) {
    var items = Array.from($(el).find('.service-card__actionButtonWrap')).concat(Array.from($(el).find('.service-card__list li')));
    items.forEach(function (item, itemIndex) {
      $(item).css('transition-delay', `${itemIndex * 50}ms`);
    })
  })
  this.openByIndex(0);
}

ServicesWidget.prototype.openToggle = function (e) {
  var $target = $(e.target);
  var index = $target.closest('.service-card').index();
  this.openByIndex(index);
}

ServicesWidget.prototype.openByIndex = function (index) {
  var $serviceCard = $(this.serviceCard$[index]);
  // $serviceCard[0].scrollIntoView({
  //   behavior: 'smooth',
  //   block: 'center',
  // });
  var $serviceCardList = $serviceCard.find('.service-card__list li');
  var color = $serviceCard.data('color');
  var clonedList = $serviceCardList.clone();
  this.desktopScrollerListContainerColor$.css('background-color', color);
  this.desktopScrollerListContainer$.html(clonedList);
  setTimeout(function () {
    clonedList.addClass('animate');
  }, 100);
  // закрываем все открытые карточки, кроме текущей
  if (!$serviceCard.hasClass('opened')) {
    this.serviceCard$.removeClass('opened');
    this.serviceCard$.find('.service-card__tail').removeClass('opened');
    this.serviceCard$.find('.service-card__tail').slideUp(200);
  }
  var $serviceCardTail = $serviceCard.find('.service-card__tail');
  $serviceCard.addClass('opened');
  $serviceCardTail.slideDown(300);
  setTimeout(function () {
    $serviceCardTail.addClass('opened');
  }, 200);
}
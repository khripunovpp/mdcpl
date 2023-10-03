export function ServicesWidget() {
  this.serviceCard$ = $('.service-card');
  this.desktopScrollerListContainerColor$ = $('.services-widget__desktopScrollerListContainer');
  this.desktopScrollerListContainer$ = $('.services-widget__desktopScrollerListContainer-list');
  this.title$ = this.serviceCard$.find('.service-card__title');
}

ServicesWidget.prototype.init = function () {
  console.log('ServicesWidget init');
  this.title$.on('click', this.openToggle.bind(this));
  this.serviceCard$.each((i, el) => {
    var items = Array.from($(el).find('.service-card__actionButtonWrap')).concat(Array.from($(el).find('.service-card__list li')));
    items.forEach((item, itemIndex) => {
      $(item).css('transition-delay', `${itemIndex * 50}ms`);
    })
  })
  this.openByIndex(0);
}

ServicesWidget.prototype.openToggle = function (e) {
  const $target = $(e.target);
  const index = $target.closest('.service-card').index();
  this.openByIndex(index);
}

ServicesWidget.prototype.openByIndex = function (index) {
  const $serviceCard = $(this.serviceCard$[index]);
  // $serviceCard[0].scrollIntoView({
  //   behavior: 'smooth',
  //   block: 'center',
  // });
  const $serviceCardList = $serviceCard.find('.service-card__list li');
  const color = $serviceCard.data('color');
  const clonedList = $serviceCardList.clone();
  this.desktopScrollerListContainerColor$.css('background-color', color);
  this.desktopScrollerListContainer$.html(clonedList);
  setTimeout(() => {
    clonedList.addClass('animate');
  }, 100);
  // закрываем все открытые карточки, кроме текущей
  if (!$serviceCard.hasClass('opened')) {
    this.serviceCard$.removeClass('opened');
    this.serviceCard$.find('.service-card__tail').removeClass('opened');
    this.serviceCard$.find('.service-card__tail').slideUp();
  }
  const $serviceCardTail = $serviceCard.find('.service-card__tail');
  $serviceCard.addClass('opened');
  $serviceCardTail.slideDown(300);
  $serviceCardTail.addClass('opened');
}
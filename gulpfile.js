const {src, dest, watch, parallel} = require('gulp')
const pug = require('gulp-pug')
const prettier = require('gulp-prettier');
const sass = require('gulp-sass');
sass.compiler = require("sass");
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create()
const cleancss = require('gulp-clean-css');
const rollup = require('gulp-rollup');
const gulpSquoosh = require("gulp-squoosh");
const splitMediaQueries = require('gulp-split-media-queries');
const svgSprite = require('gulp-svg-sprite');

function browsersync() {
  browserSync.init({ // Инициализация Browsersync
    server: {baseDir: 'docs/'}, // Указываем папку сервера
    notify: false, // Отключаем уведомления
    online: true // Режим работы: true или false
  })
}

function styles() {
  return src('src/scss/main.scss') // Выбираем источник: "app/sass/main.sass" или "app/less/main.less"
    .pipe(sass())
    .pipe(concat('styles.min.css')) // Конкатенируем в файл app.min.js
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 10 versions'],
      grid: true
    })) // Создадим префиксы с помощью Autoprefixer
    .pipe(cleancss({level: {1: {specialComments: 0}}/* , format: 'beautify' */})) // Минифицируем стили
    .pipe(splitMediaQueries({
      breakpoint: 991,
    }))
    .pipe(dest('docs/css/')) // Выгрузим результат в папку "app/css/"
    .pipe(browserSync.stream()) // Сделаем инъекцию в браузер
}

function stylesRaw() {
  return src([
    'src/css/splide.min.css',
    'src/css/splide-default.min.css',
    'src/css/lightgallery.min.css',
  ])
    .pipe(dest('docs/css/')) // Выгружаем готовый файл в папку назначения
    .pipe(browserSync.stream()) // Триггерим Browsersync для обновления страницы
}

function scripts() {
  const entries = [
    './src/js/main.js',
    './src/js/index-page.js',
    './src/js/faq-page.js',
    './src/js/reviews-page.js',
    './src/js/team-page.js',
  ];
  return src(entries)
    .pipe(rollup({
      allowRealFiles: true,
      input: entries,
      format: 'umd',
    }))
    .pipe(dest('docs/js/')) // Выгружаем готовый файл в папку назначения
    .pipe(browserSync.stream()) // Триггерим Browsersync для обновления страницы
}

function libsscripts() {
  const entries = [
    'src/js/splide.min.js',
    'src/js/jquery.lazy.js',
    'src/js/sticky-sidebar.min.js',
    'src/js/lightgallery.min.js',
  ];
  return src(entries)
    .pipe(concat('libs.min.js')) // Конкатенируем в один файл
    .pipe(dest('docs/js/')) // Выгружаем готовый файл в папку назначения
    .pipe(browserSync.stream()) // Триггерим Browsersync для обновления страницы
}

function scriptsRaw() {
  return src([
    'src/js/jquery-3.6.1.min.js',
  ])
    .pipe(dest('docs/js/')) // Выгружаем готовый файл в папку назначения
    .pipe(browserSync.stream()) // Триггерим Browsersync для обновления страницы
}

function fonts() {
  return src('src/fonts/**/*')
    .pipe(dest('docs/fonts/'))
    .pipe(browserSync.stream())
}

function views() {
  return src('src/pug/**/*.pug')
    .pipe(pug({
      pretty: true,
    }))
    .pipe(dest('docs/'))
    .pipe(browserSync.stream()) // Триггерим Browsersync для обновления страницы
}

function images() {
  return src('src/img/**/*')
    .pipe(dest('docs/img'))
    .pipe(gulpSquoosh())
}

function sprites() {
  return src('src/img/*.svg')
    .pipe(svgSprite({
      mode: {
        symbol: {
          dest: '.',
          sprite: 'sprite.svg'
        },
      },
      shape: {
        transform: [
          {
            svgo: {
              plugins: [
                {
                  removeAttrs: {attrs: 'class,id'},
                  name: 'removeAttrs',
                },
              ],
            },
          },
        ],
      },
    }))
    .pipe(dest('src/img'));
}

function startwatch(done) {
  // Выбираем все файлы JS в проекте, а затем исключим с суффиксом .min.js
  watch(['src/**/*.js'], parallel(scripts, libsscripts));
  watch('src/**/*.scss', styles);
  watch('src/**/*.html', views).on('change', browserSync.reload)
  watch('src/**/*.pug', views).on('change', browserSync.reload)
  done();
}

exports.default = parallel(images, styles, stylesRaw, scriptsRaw, fonts, scripts, libsscripts, views, browsersync, startwatch);
exports.build = parallel(images, styles, scriptsRaw, stylesRaw, fonts, scripts, libsscripts, views);
exports.sprites = parallel(sprites);

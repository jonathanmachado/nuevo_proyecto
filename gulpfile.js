var compress = false;
var browser  = true;
var debug    = true;

var gulp        = require('gulp'),
    browserSync = require('browser-sync').create(),
    spritesmith = require('gulp.spritesmith'),
    plugins     = require('gulp-load-plugins')({
      scope: ['devDependencies']
    });

var path = {
  javascript: {
    src: ['build/js/**/*.js'],
    dest: 'src/js',
  },
  images: {
    src: ['build/images/**/*.*'],
    dest: 'src/images'
  },
  sprite: {
    src: ['build/images/sprite/*.png'],
    dest: 'src/images/sprite',
    destSass: 'src/sass/sprite'
  },
  sass: {
    src: ['build/sass/**/*.scss'],
    dest: 'src/css',
    destSass: 'src/sass'
  },
  font: {
    src: ['build/fonts/**/*'],
    dest: 'src/fonts'
  },
  html: {
    src: ['build/*.html'],
    dest: 'src/'
  },
  vendors: {
    src: ['build/vendors/**/*.*'],
    dest: 'src/vendors'
  }
}

path.watch = {
  sass:       ['build/sass/**/styles.scss'],
  images:     ['build/images/**/*.*'],
  sprite:     ['build/images/sprites/*.png'],
  javascript: ['build/js/**/*.js'],
  vendors:    ['build/vendors/**/*.*'],
  html:       ['build/*.html'],
  css:        ['src/css/styles.css'],
  maps:       ['src/css/**/*.map']

}

path.change = ['src/*.html'];

gulp.task('fonts', function() {
  return gulp.src(path.font.src)
  .pipe(gulp.dest(path.font.dest))
})

gulp.task('html', function() {
  return gulp.src(path.html.src)
  .pipe(gulp.dest(path.html.dest))
})

gulp.task('vendors', function(){
  gulp.src(path.vendors.src)
    .pipe(gulp.dest(path.vendors.dest))
    .pipe(plugins.if(browser, browserSync.stream()))
});

gulp.task('javascript', ['vendors'], function(){
  gulp.src(path.javascript.src)
    .pipe(plugins.plumber())
    .pipe(plugins.if(compress, plugins.concat('scripts.js')))
    .pipe(plugins.if(compress, plugins.uglify()))
    .pipe(gulp.dest(path.javascript.dest))
	  .pipe(plugins.if(browser, browserSync.stream()))
});

gulp.task('sass-copy', function () {
  return gulp.src(path.sass.src)
    .pipe(gulp.dest(path.sass.destSass))
});

gulp.task('sass-maps-clean', function() {
  return gulp.src(path.watch.maps)
    .pipe(plugins.clean())
});

gulp.task('sass', ['sass-copy'], function(){
  gulp.src(path.sass.src)
    .pipe(plugins.if(debug, plugins.sourcemaps.init()))
    .pipe(plugins.plumber())
    .pipe(plugins.if(compress, plugins.sass({ outputStyle : 'compressed' }), plugins.sass({ outputStyle : 'expanded' }))) // Converts Sass to CSS with gulp-sass
    .pipe(plugins.if(debug, plugins.sourcemaps.write(".")))
    .pipe(gulp.dest(path.sass.dest))
    //.pipe(browserSync.stream())
});

gulp.task('images', function () {
  return gulp.src(path.images.src)
    .pipe(plugins.cache(plugins.imagemin({
      interlaced: true
    })))
    .pipe(gulp.dest(path.images.dest));
});

gulp.task('sprite', function () {
  // Generate our spritesheet
  var nameSprite = 'sprite';
  var spriteData = gulp.src(path.sprite.src).pipe(spritesmith({
    imgName: nameSprite + '.png',
    cssName: nameSprite + '.scss',
    cssFormat: 'scss',
    imgPath: '../images/' + nameSprite + '/' + nameSprite + '.png'
  }));
  // Pipe image stream through image optimizer and onto disk
  spriteData.img.pipe(plugins.imagemin())
    .pipe(gulp.dest(path.sprite.dest));

  // Pipe CSS stream through CSS optimizer and onto disk
  spriteData.css.pipe(gulp.dest(path.sprite.destSass));

});


gulp.task('watch-sass', ['sass'], function(){
  gulp.watch(path.sass.src, ['sass']);
})


gulp.task('watch', ['html', 'vendors', 'sass', 'images', 'javascript'], function(){
  if(browser){
    browserSync.init({
  	  server: {
  		 baseDir: 'src/'
  	  }
    })
  }
  gulp.watch(path.watch.html, ['html']);
  gulp.watch(path.watch.sass, ['sass']);
  gulp.watch(path.watch.vendors, ['vendors']);
  gulp.watch(path.sass.src, ['watch-sass']);
  gulp.watch(path.watch.images, ['images']);
  gulp.watch(path.watch.javascript, ['javascript']);
  if(browser) {
    gulp.watch(path.change).on("change", browserSync.reload);
    gulp.watch(path.watch.css).on("change", browserSync.reload);
  }
})

gulp.task('default', ['watch']);

var gulp            = require('gulp');
//less-css
var browserSync     = require('browser-sync');
var less            = require('gulp-less');
var cssmin          = require('gulp-minify-css');
var autoprefixer    = require('gulp-autoprefixer');
var rename          = require('gulp-rename');

var uglify          = require('gulp-uglify');
var concat 			= require('gulp-concat');

var copy            = require('gulp-contrib-copy');

//images
var imagemin        = require('gulp-imagemin');
var cache           = require('gulp-cache');

//cleaning
var clear           = require('del');
var cache           = require('gulp-cache');

//Sequence
var runSequence = require('run-sequence');





// path
var PUBLIC_DIR = './../public/';
var path = {
    scripts :  'src/js/**/*.js' ,
    less    :  'src/less/index.less' ,
    css     :  'src/css',
    fonts   :  'src/fonts/**/*.*',
    vendors :  'vendors/**/*.*',
    img     :  'src/img/**/*.*'
};

//dev

//Поднятие сервера

gulp.task('browserSync', function () {
   browserSync({
       server: {
           baseDir: './'
       }
   });
});


gulp.task('less', function(){
    return gulp.src(path.less)

        .pipe(less()) // используем gulp-less
        .pipe(autoprefixer())
        .pipe(cssmin())
        .pipe(rename('index.min.css'))
        .pipe(gulp.dest(PUBLIC_DIR  + path.css))
        .pipe(gulp.dest(path.css))
        .pipe(browserSync.reload({
            stream: true //обновление страницы после изменения файлов
        }));
});

gulp.task('scripts', function(){
    return gulp.src(['!src/js/index.min.js', path.scripts])
        .pipe(concat('index.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(PUBLIC_DIR +'src/js/'))
        .pipe(gulp.dest('src/js/'))
        .pipe(browserSync.reload({
            stream: true //обновление страницы после изменения файлов
        }));
});

gulp.task('html', function() {
    return gulp.src('./index.html')
        .pipe(copy())
        .pipe(gulp.dest(PUBLIC_DIR));
});

gulp.task('fonts', function() {
    return gulp.src(path.fonts)
        .pipe(copy())
        .pipe(gulp.dest(PUBLIC_DIR+'src/fonts'));
});

gulp.task('bower', function() {
    return gulp.src('bower_components/**/*.*')
        .pipe(copy())
        .pipe(gulp.dest(PUBLIC_DIR+'bower_components'));
});

gulp.task('img', function() {
    return gulp.src(path.img)
        .pipe(imagemin())
        .pipe(gulp.dest(PUBLIC_DIR+'src/img'));
});

gulp.task('clean:public', function(){
    clear(['./../public/**/*'],{force: true});
});

gulp.task('clean:cache', function(done){
    return cache.clearAll(done);
});



// Watchers
gulp.task(
    'default',

    function(callback){

        runSequence(
            'clean:cache',
            [
                'browserSync',
                'less',
                'scripts'
            ],
            callback
        );

        gulp.watch(path.less, ['less']);
        gulp.watch(path.scripts, ['scripts']);
        gulp.watch('*.html', browserSync.reload);
    }
);

gulp.task(
    'build',

    function(callback){

        runSequence(
            'clean:public',
            'clean:cache',
            [

                'less',
                'scripts',
                'fonts',
                'img',
                'html',
                'bower'
            ],
            callback
        );
    }
);


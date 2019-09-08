var gulp = require('gulp');
var sass = require('gulp-sass');
var sassGlob = require('gulp-sass-glob');
var csso = require('gulp-csso');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var imagemin = require('gulp-imagemin');
var browserSync = require('browser-sync');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var plumber = require('gulp-plumber');
var cache = require('gulp-cache');
var del = require('del');

gulp.task('clean', function(){
    return del.sync('dist');
});

gulp.task('sass', function(){
    return gulp.src('app/sass/**/*.scss')
           .pipe(plumber())
           .pipe(sassGlob())
           .pipe(sass())
           .pipe(autoprefixer(['> 1%'], {cascade: true}))
           .pipe(gulp.dest('app/css'))
           .pipe(browserSync.reload({stream: true}))
});

gulp.task('scripts', function(){
    return gulp.src([
        //'app/libs/jquery/dist/jquery.min.js',
        //'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js'
    ])
    .pipe(concat('libs.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('app/js'));
});

gulp.task('css-libs', ['sass'], function(){
    return gulp.src('app/sass/libs.scss')
    .pipe(sass())
    .pipe(csso())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('app/css'));
});

gulp.task('images', function(){
    return gulp.src('app/img/**/*.{png,jpg,jpeg,svg}')
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            optimizationLevel: 5,
            svgoPlugins: [
                {
                    removeViewBox: true
                }
            ]
        })))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('watch', ['browser-sync', 'css-libs', 'scripts'], function(){
    gulp.watch('app/sass/**/*.scss', ['sass']);
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch(['app/js/common.js', 'app/libs/**/*.js'], browserSync.reload);
});

gulp.task('browser-sync', function(){
    browserSync({
        server: {
            baseDir: 'app'
        },
        notify: false
    });
});



gulp.task('build', ['clean', 'images', 'sass', 'scripts'], function(){
    var buildCss = gulp.src([
        'app/css/style.css',
        'app/css/libs.min.css'
    ])
    .pipe(gulp.dest('dist/css'));

    var buildFonts = gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'));

    var buildJs = gulp.src('app/js/**/*')
        .pipe(gulp.dest('dist/js'));

    var buildHTML = gulp.src('app/*.html')
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['watch']);

gulp.task('clear', function(){
    return cache.clearAll();
});




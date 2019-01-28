const { src, dest, parallel, series, watch} = require('gulp');
const stylus = require('gulp-stylus');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const stylelint = require('gulp-stylelint');
var critical = require('critical').stream;

const stylelintConfig = {
  // reporters: [
  //   {formatter: 'string', console: true}
  // ]
  fix: true
};

function css() {
  const plugins = [
    autoprefixer({
      browsers: ['last 1 version']
    }),
    cssnano()
  ]
  return src('public/stylesheets/stylus/*.styl')
    .pipe(stylus({compress: false})) // pre-processor
    .pipe(stylelint(stylelintConfig)) // linter
    .pipe(postcss(plugins)) // post-processor
    .pipe(dest('public/stylesheets'))
};

const cssWatch = () => {
  const watcher = watch(['public/stylesheets/stylus/**/*.styl'], (cb) => {
    css();
    cb();
  });

  watcher.on('change', function(path, stats) {
    console.log(`File ${path} was changed`);
  });

  watcher.on('add', function(path, stats) {
    console.log(`File ${path} was added`);
  });

  watcher.on('unlink', function(path, stats) {
    console.log(`File ${path} was removed`);
  });
};

function critical(){
  // Generate & Inline Critical-path CSS

  return src('public/*.html')
    .pipe(critical({
      base: '/',
      inline: true,
      css: ['public/stylesheets/styles.css', 'public/stylesheets/other.css']
    }
    ))
    .on('error', function(err) {
      log.error(err.message);
    })
    .pipe(gulp.dest('public/stylesheets/critical'));

}

exports.default = series(css, critical);
exports.watch = cssWatch;

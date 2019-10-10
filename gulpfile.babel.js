import fs from 'fs';
import chalk from 'chalk';
import gulp from 'gulp';
import babel from 'gulp-babel';
import rename from 'gulp-rename';
import clean from 'gulp-rimraf';
import minify from 'gulp-minifier';
import jeditor from "gulp-json-editor";
import runSequence from 'run-sequence';
import config from './src/config';

const dist = './dist';
const dist_server = `${dist}/server`;
const dist_client = `${dist}/client`;
const pm2_simple = `pm2.simple.config.js`;
const pm2_cluster = `pm2.cluster.config.js`;

gulp.task('build-clean', async () => {
  // Remove files dist, but ignore assets
  return gulp.src([
    `${dist_server}/*`, `!${dist_server}/assets`, `${dist_client}`
  ], { read: false }).pipe(clean({ force: true }));
  setTimeout(() => console.log(chalk.greenBright('\n---------\nClean success!\n---------\n')), 500);
});

gulp.task('build-babel', async () => {
  // Babel transform
  return gulp.src(['src/**/*.js', '!src/config/*.js']).pipe(babel()).pipe(gulp.dest(dist_server));
  setTimeout(() => console.log(chalk.greenBright('\n---------\nBabel success!\n---------\n')), 500);
});

gulp.task('build-replace-copy-config', async () => {
  // Copy file config dev or production 
  const conf = process.argv[3] ? 'index' : 'production';
  // Copy config production
  gulp.src([`src/config/${conf}.js`]).pipe(babel()).pipe(rename('index.js')).pipe(gulp.dest(`${dist_server}/config`));
  // Success
  setTimeout(() => console.log(chalk.greenBright('\n---------\nCopy config production success!\n---------\n')), 250);
});

gulp.task('build-replace-copy-views', async () => {
  // Copy views
  gulp.src(['src/views/**/*.*', '!src/views/**/*.js']).pipe(minify({ minify: true, collapseWhitespace: true, conservativeCollapse: true, minifyCSS: true })).pipe(gulp.dest(`${dist_server}/views`));
  // Success
  setTimeout(() => console.log(chalk.greenBright('\n---------\nBuild Copy views!\n---------\n')), 250);
});

gulp.task('build-replace-copy-assets', async () => {
  // Copy assets
  gulp.src(['src/assets/**/*']).pipe(gulp.dest(`${dist_server}/assets`));
  // Success
  setTimeout(() => console.log(chalk.greenBright('\n---------\nCopy assets success!\n---------\n')), 250);
});

gulp.task('build-replace-copy-yaml', async () => {
  // Copy *.yaml
  gulp.src(['src/**/*.yaml']).pipe(gulp.dest(dist_server));
  // Success
  setTimeout(() => console.log(chalk.greenBright('\n---------\nCopy *.yaml success!\n---------\n')), 250);
});

gulp.task('build-replace-package-json', async () => {
  // package.json
  gulp.src("package.json").pipe(jeditor((json) => {
    delete json.devDependencies;
    json.scripts = {
      "start": `node server/app.js`,
      "simple": `npm stop && pm2 start ${pm2_simple} --env production`,
      "cluster": `npm stop && pm2 start ${pm2_cluster} --env production`,
      "stop": `pm2 delete ${pm2_simple} ${pm2_cluster}`
    };
    return json;
  })).pipe(gulp.dest(dist));
  // Success
  setTimeout(() => console.log(chalk.greenBright('\n---------\npackage.json success!\n---------\n')), 250);
});

gulp.task('build-replace-copy-pm2-files', async () => {
  // Copy pm2 files
  gulp.src([pm2_simple, pm2_cluster]).pipe(gulp.dest(dist));
  // Success
  setTimeout(() => console.log(chalk.greenBright('\n---------\nCopy pm2 files success!\n---------\n')), 250);
});

gulp.task('build-replace-copy-client-folder', async () => {
  // If exits client folder, then copy current client
  if (fs.existsSync(`${dist}/client`)) {
    gulp.src(['client/**/*']).pipe(gulp.dest(dist_client));
  } else {
    // If not exists client folder, then copy default client
    gulp.src(['src/views/default/favicon.ico', 'src/views/default/logo.svg']).pipe(gulp.dest(dist_client));
    gulp.src(['src/views/default/client.html']).pipe(minify({ minify: true, collapseWhitespace: true, conservativeCollapse: true })).pipe(rename('index.html')).pipe(gulp.dest(dist_client));
  }
  // Success
  setTimeout(() => console.log(chalk.greenBright('\n---------\nClient folder success!\n---------\n')), 250);
});

gulp.task('build-replace-copy-assets-if-not-exists', async () => {
  // Copy assets if not exists
  if (!fs.existsSync(`${dist_server}/assets`)) {
    gulp.src('src/assets').pipe(gulp.dest(`${dist_server}`));
  }
  // Success
  setTimeout(() => console.log(chalk.greenBright('\n---------\nCopy assets if not exists success!\n---------\n')), 500);
});

gulp.task('build', gulp.series(
  'build-clean',
  'build-babel',
  'build-replace-copy-config',
  'build-replace-copy-views',
  'build-replace-copy-assets',
  'build-replace-copy-yaml',
  'build-replace-package-json',
  'build-replace-copy-pm2-files',
  'build-replace-copy-client-folder',
  'build-replace-copy-assets-if-not-exists')
);

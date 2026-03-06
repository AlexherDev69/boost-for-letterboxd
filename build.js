const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const isWatch = process.argv.includes('--watch');
const isProd = process.argv.includes('--prod');

const DIST_DIR = path.join(__dirname, 'dist');
const STATIC_DIR = path.join(__dirname, 'static');

function copyStaticFiles() {
  if (!fs.existsSync(DIST_DIR)) {
    fs.mkdirSync(DIST_DIR, { recursive: true });
  }

  const files = fs.readdirSync(STATIC_DIR);
  for (const file of files) {
    fs.copyFileSync(path.join(STATIC_DIR, file), path.join(DIST_DIR, file));
  }
}

const sharedOptions = {
  bundle: true,
  target: 'chrome100',
  minify: isProd,
  sourcemap: !isProd,
  logLevel: 'info',
};

async function build() {
  copyStaticFiles();

  const entryPoints = [
    { entry: 'src/content/index.ts', out: 'dist/content.js', format: 'iife' },
    { entry: 'src/background/index.ts', out: 'dist/background.js', format: 'iife' },
    { entry: 'src/popup/index.ts', out: 'dist/popup.js', format: 'iife' },
  ];

  if (isWatch) {
    for (const { entry, out, format } of entryPoints) {
      const ctx = await esbuild.context({
        ...sharedOptions,
        entryPoints: [entry],
        outfile: out,
        format,
      });
      await ctx.watch();
    }
    // eslint-disable-next-line no-console
    console.log('Watching for changes...');
  } else {
    for (const { entry, out, format } of entryPoints) {
      await esbuild.build({
        ...sharedOptions,
        entryPoints: [entry],
        outfile: out,
        format,
      });
    }
  }
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});

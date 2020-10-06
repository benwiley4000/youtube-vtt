#!/usr/bin/env node

const puppeteer = require('puppeteer-extra');
const path = require('path');
const fs = require('fs').promises;
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');
const chromeFinder = require('chrome-finder');

const argv = require('minimist')(process.argv.slice(2));

let {
  _: [url],
  translation,
  concurrent = false,
  wait = '5000',
  debug = false
} = argv;

if (!url) {
  throw new Error('Must include youtube url as argument');
}

if (isNaN(wait)) {
  throw new Error('wait option must be a number (milliseconds)');
}

wait = Number(wait);

const options = {
  translationLanguageCode: translation
};

const executablePath = chromeFinder();

const downloadPath = path.join(process.cwd(), 'downloads');

puppeteer.use(AdblockerPlugin());

(async() => {
  const script = await fs.readFile(
    path.join(__dirname, '..', 'save-vtt-files.js')
  );
  console.log(`launching chrome${debug ? '' : ' in headless mode'}...`);
  const browser = await puppeteer.launch({
    executablePath,
    headless: !debug
  });
  const page = await browser.newPage();
  console.log(`setting download path to ${downloadPath}`);
  await page._client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath
  });
  console.log(`visiting ${url}`);
  await page.goto(url, { waitUntil: 'networkidle2' });
  console.log('evaluating script to trigger downloads...');
  await page.evaluate(`
    (() => {
      ${script};
      AVOID_CONCURRENT_CAPTIONS = ${!concurrent};
      saveVttFiles(${JSON.stringify(options)});
    })()
  `);
  if (!debug) {
    console.log(`waiting ${(wait / 1000).toFixed(1)} seconds...`);
    await timeout(wait);
    console.log('closing browser...');
    await browser.close();
  }
})();

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

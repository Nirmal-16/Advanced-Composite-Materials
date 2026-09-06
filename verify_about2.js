const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });
  await page.goto('http://localhost:8125/about.html', { waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.getElementById('missionText').textContent.length > 0);
  const height = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < height; y += 400) {
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await page.waitForTimeout(100);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1000);
  const eduSection = await page.$('#educationList');
  await eduSection.screenshot({ path: 'education2.png' });
  await browser.close();
})();

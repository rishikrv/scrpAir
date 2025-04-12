import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());

export async function scrapeBlockedDates(listingId) {
  const url = `https://www.airbnb.com/rooms/${listingId}`;

  const browser = await puppeteer.launch({
    headless: true,
    executablePath:
      process.env.PUPPETEER_EXECUTABLE_PATH || "/usr/bin/chromium-browser",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--single-process",
      "--disable-gpu",
    ],
  });

  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122 Safari/537.36"
  );
  await page.setExtraHTTPHeaders({
    "Accept-Language": "en-US,en;q=0.9",
  });

  await page.goto(url, { waitUntil: "networkidle2", timeout: 0 });

  await page.evaluate(() => window.scrollBy(0, 1000));
  await page.waitForSelector('[data-testid^="calendar-day-"]', {
    timeout: 30000,
  });

  await new Promise((resolve) => setTimeout(resolve, 5000));

  const blockedDates = await page.$$eval(
    '[data-testid^="calendar-day-"]',
    (elements) =>
      elements.map((el) => {
        const dateString = el.getAttribute("data-testid");
        const dateMatch = dateString
          ? dateString.match(/\d{2}\/\d{2}\/\d{4}/)
          : null;
        const date = dateMatch ? dateMatch[0] : null;
        return {
          date,
          isBlocked: el.getAttribute("data-is-day-blocked"),
        };
      })
  );

  await browser.close();
  return blockedDates;
}

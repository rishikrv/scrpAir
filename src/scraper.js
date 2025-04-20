import { chromium } from "playwright";

export async function scrapeBlockedDates(listingId) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.setExtraHTTPHeaders({
    "Accept-Language": "en-US,en;q=0.9",
  });

  await page.goto(`https://www.airbnb.com/rooms/${listingId}`, {
    waitUntil: "networkidle",
    timeout: 60000,
  });

  await page.waitForTimeout(5000); // give time to load the calendar

  const blockedDates = await page.$$eval(
    '[data-testid^="calendar-day-"]',
    (elements) =>
      elements.map((el) => {
        const dateString = el.getAttribute("data-testid");
        const dateMatch = dateString
          ? dateString.match(/\d{2}\/\d{2}\/\d{4}/)
          : null;
        return {
          date: dateMatch ? dateMatch[0] : null,
          isBlocked: el.getAttribute("data-is-day-blocked"),
        };
      })
  );

  await browser.close();
  return blockedDates;
}

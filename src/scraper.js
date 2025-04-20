import puppeteer from "puppeteer";

export async function scrapeBlockedDates(listingId) {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.goto(`https://www.airbnb.com/rooms/${listingId}`, {
      waitUntil: "networkidle2",
      timeout: 60000,
    });

    await page.waitForTimeout(5000);

    const dates = await page.$$eval(
      '[data-testid^="calendar-day-"]',
      (elements) =>
        elements.map((el) => {
          const dateString = el.getAttribute("data-testid");
          const dateMatch = dateString?.match(/\d{2}\/\d{2}\/\d{4}/);
          return {
            date: dateMatch ? dateMatch[0] : null,
            isBlocked: el.getAttribute("data-is-day-blocked"),
          };
        })
    );

    await browser.close();
    return dates;
  } catch (err) {
    console.error("❌ Scrape failed:", err);
    throw err;
  }
}

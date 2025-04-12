import express from "express";
import cors from "cors";
import { scrapeBlockedDates } from "./scraper.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Root confirmation route
app.get("/", (req, res) => {
  res.send(`✅ Scraper server is running on PORT ${PORT}`);
});

// API Route: /scrape?id=LISTING_ID
app.get("/scrape", async (req, res) => {
  const listingId = req.query.id;

  if (!listingId) {
    return res.status(400).json({ error: "Missing 'id' query parameter" });
  }

  try {
    const blockedDates = await scrapeBlockedDates(listingId);
    res.json({ blockedDates });
  } catch (error) {
    console.error("Scrape error:", error);
    res.status(500).json({ error: "Failed to scrape the Airbnb page" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

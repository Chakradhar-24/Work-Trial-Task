import axios from "axios";

export async function GET() {
  try {
    const response = await axios.get("https://api.coingecko.com/api/v3/coins/markets", {
      params: {
        vs_currency: "usd",
        order: "market_cap_desc",
        per_page: 5,
        page: 1,
        sparkline: false,
      },
    });

    return Response.json(response.data);
  } catch (error) {
    return Response.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}


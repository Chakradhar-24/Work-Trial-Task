"use client"; // Needed for client-side hooks

import { useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const [search, setSearch] = useState("");

  // Function to fetch top 5 crypto prices
  const fetchTopCoins = async () => {
    const marketData = await axios.get(
      "https://api.coingecko.com/api/v3/coins/markets",
      {
        params: {
          vs_currency: "usd",
          order: "market_cap_desc",
          per_page: 5,
          page: 1,
          sparkline: false,
        },
      }
    );

    const top5Coins = marketData.data.map((coin) => ({
      id: coin.id,
      name: coin.name,
    }));

    const priceResponse = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price",
      {
        params: {
          ids: top5Coins.map((coin) => coin.id).join(","),
          vs_currencies: "usd",
        },
      }
    );

    return top5Coins.map((coin) => ({
      ...coin,
      price: priceResponse.data[coin.id]?.usd ?? "N/A",
    }));
  };

  // Fetch data using React Query
  const { data: topCoins, isLoading, isError, refetch } = useQuery({
    queryKey: ["crypto-prices"],
    queryFn: fetchTopCoins,
    staleTime: 10000, // Data remains fresh for 10s
  });

  // Filter coins based on search input
  const filteredCoins =
    topCoins?.filter((coin) =>
      coin.name.toLowerCase().includes(search.toLowerCase())
    ) || [];

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Crypto Price Tracker</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search cryptocurrency..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: "10px", marginBottom: "10px", width: "300px" }}
      />

      {/* Refresh Button */}
      <button
        onClick={() => refetch()}
        style={{ marginLeft: "10px", padding: "10px 20px", cursor: "pointer" }}
      >
        Refresh Prices
      </button>

      {/* Loading Indicator */}
      {isLoading && <p>Loading...</p>}

      {/* Error Handling */}
      {isError && <p>Error fetching data. Try again later.</p>}

      {/* Display Cryptocurrency Prices */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {filteredCoins.map((coin) => (
          <li key={coin.id} style={{ fontSize: "18px", margin: "10px 0" }}>
            {coin.name}: ${coin.price}
          </li>
        ))}
      </ul>
    </div>
  );
}


"use client"; // Required for client-side useEffect

import { useEffect, useState } from "react";

export default function Home() {
  const [prices, setPrices] = useState([]);

  useEffect(() => {
    const fetchTopCoins = async () => {
      try {
        const response = await fetch("/api/crypto"); // Calls the API route
        const data = await response.json();
        setPrices(data);
      } catch (error) {
        console.error("Error fetching data:", error);//error fetching......    ...
      }
    };

    fetchTopCoins();
    const interval = setInterval(fetchTopCoins, 10000); // Update every 30s.

    return () => clearInterval(interval);//...
  }, []);

  return (
    <div>
      <h1>Crypto Price Tracker</h1>
      <ul>
        {prices.map((coin) => (
          <li key={coin.id}>
            {coin.name}: ${coin.current_price}
          </li>
        ))}
      </ul>
    </div>
  );
}


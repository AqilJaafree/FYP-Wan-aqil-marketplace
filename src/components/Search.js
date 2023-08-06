import React, { useState } from "react";
import NavBar from "./Navbar";
import SearchTile from "./SearchTile";

function Search() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [nftData, setNftData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [coinGeckoData, setCoinGeckoData] = useState(null);

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  async function searchNft() {
    if (!searchTerm) {
      setError("Please enter a search term");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const openSeaHeaders = new Headers();
      openSeaHeaders.append("X-API-KEY", "36bcfeb8b7b848dd9eec125683d47078");

      const openSeaRequestOptions = {
        method: "GET",
        headers: openSeaHeaders,
        redirect: "follow",
      };

      const openSeaResponse = await fetch(
        `https://api.opensea.io/api/v1/assets?order_direction=desc&offset=0&limit=20&collection=${searchTerm}`,
        openSeaRequestOptions
      );

      const openSeaData = await openSeaResponse.json();

      console.log("OpenSea Data:", openSeaData);

      setNftData(openSeaData);

      // CoinGecko API
      const coinGeckoResponse = await fetch(
        `https://api.coingecko.com/api/v3/nfts/${searchTerm}`
      );

      const coinGeckoData = await coinGeckoResponse.json();
      console.log("CoinGecko Data:", coinGeckoData);
      setCoinGeckoData(coinGeckoData);
    } catch (error) {
      console.error(error);
      setError("An error occurred while fetching NFT data");
    }

    setLoading(false);
  }

  return (
    <div>
      <NavBar className="navbar" />
      <div className="flex flex-col place-items-center mt-20">
        <div className="md:text-xl font-bold text-white">NFT Search</div>
        <div className="mt-5 max-w-screen-xl text-center">
          <input
            type="text"
            placeholder="Enter search term"
            value={searchTerm}
            onChange={handleInputChange}
            className="mr-2 py-2 px-4 focus:ring-indigo-500 focus:border-indigo-500 block shadow-sm sm:text-sm border-gray-300 rounded-md"
          />
          <button
            onClick={searchNft}
            disabled={loading}
            className="py-2 px-4 font-semibold rounded-lg shadow-md text-white bg-green-500 hover:bg-green-700"
          >
            Search NFT
          </button>
          {loading && <p>Loading...</p>}
          {error && <p>Error: {error}</p>}
        </div>
        {coinGeckoData && (
          <div className="mt-5 max-w-screen-xl text-center">
            <p className="text-white">NFT Collection Data:</p>
            <p className="text-white">
              {" "}
              Floor Price Change (1 Year, USD):{" "}
              {coinGeckoData.floor_price_1y_percentage_change.usd} %
            </p>

            <p className="text-white">
              {" "}
              Floor Price Change (30 Days, USD):{" "}
              {coinGeckoData.floor_price_30d_percentage_change.usd} %
            </p>
            <p className="text-white">
              Floor Price Change (7 Days, USD):{" "}
              {coinGeckoData.floor_price_7d_percentage_change.usd} %
            </p>
            <p className="text-white">
              Floor Price Change (24 Hours, USD):{" "}
              {coinGeckoData.floor_price_24h_percentage_change.usd} %
            </p>
            <p className="text-white">
              Floor Price (ETH): {coinGeckoData.floor_price.native_currency}
            </p>
            <p className="text-white">
              Floor Price (USD): {coinGeckoData.floor_price.usd}
            </p>
            <p className="text-white">
              Number of Unique Addresses:{" "}
              {coinGeckoData.number_of_unique_addresses}
            </p>
            <p className="text-white">
              Contract Address: {coinGeckoData.contract_address}
            </p>
          </div>
        )}

        <div className="flex mt-5 justify-between flex-wrap max-w-screen-xl text-center">
          {!loading &&
            !error &&
            nftData &&
            nftData.assets &&
            nftData.assets.map((nft, index) => (
              <SearchTile
                data={nft}
                coinGeckoData={coinGeckoData}
                key={index}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

export default Search;

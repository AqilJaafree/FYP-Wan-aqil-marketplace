import React, { useState, useEffect } from "react";
import NavBar from "./Navbar";

function Recent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [nftData, setNftData] = useState({
    openSeaData: null,
    magicEdenData: null,
  });

  useEffect(() => {
    const fetchNftListings = async () => {
      setLoading(true);
      setError("");

      try {
        // OpenSea API
        const openSeaHeaders = new Headers();
        openSeaHeaders.append("X-API-KEY", "36bcfeb8b7b848dd9eec125683d47078");

        const openSeaRequestOptions = {
          method: "GET",
          headers: openSeaHeaders,
          redirect: "follow",
        };

        const openSeaResponse = await fetch(
          `https://api.opensea.io/v2/orders/ethereum/seaport/listings?order_by=created_date&order_direction=desc`,
          openSeaRequestOptions
        );

        const openSeaData = await openSeaResponse.json();

        // Magic Eden API
        const magicEdenUrl =
          "https://api-mainnet.magiceden.dev/v2/collections/symbol/listings";
        const magicEdenOptions = {
          method: "GET",
          headers: { accept: "application/json" },
        };

        const magicEdenResponse = await fetch(magicEdenUrl, magicEdenOptions);
        const magicEdenData = await magicEdenResponse.json();

        // Store the fetched NFT data from both APIs in the state
        setNftData({ openSeaData, magicEdenData });
      } catch (error) {
        setError("An error occurred while fetching NFT data");
      }

      setLoading(false);
    };

    fetchNftListings(); // Fetch NFT listings on page refresh
  }, []); // Empty dependency array to run the effect only once

  return (
    <div>
      <NavBar className="navbar" />
      <div className="flex flex-col place-items-center mt-20 text-white">
        <h2>Recent NFT Listings</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <div className="mt-5 max-w-screen-xl text-center">
            {/* Display OpenSea NFTs */}
            {nftData.openSeaData && nftData.openSeaData.orders.length > 0 ? (
              <div>
                <h3 className="md:text-xl font-bold">OpenSea Listings</h3>
                <div className="grid grid-cols-4 gap-4">
                  {nftData.openSeaData.orders.map((order) => (
                    <div key={order.order_hash} className="nft-item mb-5">
                      <h4>
                        NFT Name: {order.maker_asset_bundle.assets[0].name}
                      </h4>
                      <img
                        src={order.maker_asset_bundle.assets[0].image_url}
                        alt={order.maker_asset_bundle.assets[0].name}
                      />
                      
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p>No OpenSea NFTs found</p>
            )}

            {/* Display Magic Eden NFTs */}
            {nftData.magicEdenData && nftData.magicEdenData.length > 0 ? (
              <div>
                <h3 className="md:text-xl font-bold">Magic Eden Listings</h3>
                <div className="grid grid-cols-4 gap-4">
                  {nftData.magicEdenData.map((listing) => (
                    <div key={listing.id} className="nft-item mb-5">
                      <h4>NFT Name: {listing.name}</h4>
                      <img src={listing.image} alt={listing.name} />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p>No Magic Eden NFTs found</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Recent;

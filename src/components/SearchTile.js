import React from "react";

const SearchTile = ({ data, coinGeckoData }) => {
  return (
    <div className="border p-4 rounded-lg m-4 w-64">
      <img
        className="h-48 w-full object-cover"
        src={data.image_url}
        alt={data.name}
      />
      <h2 className="mt-2 text-lg font-semibold">{data.name}</h2>
      <p className="mt-1 text-white-500">Token ID: {data.token_id}</p>
      {coinGeckoData &&
        coinGeckoData.floor_price &&
        coinGeckoData.floor_price.usd && (
          <p className="mt-1 text-white-500">
            Floor Price (USD): {coinGeckoData.floor_price.usd}
          </p>
        )}
      <p className="text-white">
        Floor Price (ETH): {coinGeckoData.floor_price.native_currency}
      </p>
    </div>
  );
};

export default SearchTile;

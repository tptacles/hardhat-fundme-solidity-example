const networkConfig = {
  5: {
    name: "goerlie",
    ethUsdPriceFeed: "0xd4a33860578de61dbabdc8bfdb98fd742fa7028e",
  },
  1337: {
    name: "localhost",
  },
  31337: {
    name: "hardhat_node",
  },
};
const developmentChains = ["hardhat", "localhost", "hardhat_node"];
const DECIMALS = 8;
const INITIAL_ANSWER = 200000000000;
module.exports = {
  networkConfig,
  developmentChains,
  DECIMALS,
  INITIAL_ANSWER,
};

//const { network } = require("hardhat");
const hre = require("hardhat");
const {
  networkConfig,
  developmentChains,
} = require("../helper-hardhat-config");
// async function deployFunc(hre) {
//   const getNamedAccounts = hre.getNamedAccounts();
//   const deployments = hre.deployments();
// }
// module.exports.default = deployFunc;
// ===same as above===
// module.exports = async (hre) => {
//   const { getNamedAccounts, deployments } = hre;
// };
// ===same as below===
module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await hre.getNamedAccounts();
  const chainId = hre.network.config.chainId;
  //const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
  let ethUsdPriceFeedAddress;
  if (developmentChains.includes(hre.network.name)) {
    const ethUsdAggregator = await deployments.get("MockV3Aggregator");
    ethUsdPriceFeedAddress = ethUsdAggregator.address;
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
  }
  //mock contract: if the contract doesn't exist, deploy a minimal version for local testing
  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: [ethUsdPriceFeedAddress] /*put price feed address*/,
    log: true,
  });
};
module.exports.tags = ["all", "fundme"];

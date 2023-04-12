const { ethers } = require("hardhat");
async function main() {
  const fundMeFactory = await ethers.getContractFactory("FundMe");
  console.log("Deploying contract...");
  const fundMe = await fundMeFactory.deploy(
    "0x5FbDB2315678afecb367f032d93F642f64180aa3"
  );
  await fundMe.deployed();
  console.log("FundMe deployed to: ", fundMe.address);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

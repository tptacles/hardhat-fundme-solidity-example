const { inputToConfig } = require("@ethereum-waffle/compiler");
const { assert, expect } = require("chai");
const { ethers, getNamedAccount, network } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");
developmentChains.includes(network.name)
  ? describe.skip
  : describe("FundMe", async function () {
      let fundMe;
      let deployer;
      const sendValue = ethers.utils.parseEther("1");
      beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer;
        fundMe = await ethers.getContract("FundMe", deployer);
      });
      it("allows people to fund and withdraw", async function () {
        await fundMe.fund({ value: sendValue });
        await fundMe.withdraw();
        const endingBalance = await ethers.provider.getBalance(fundMe.address);
        assert.equal(endingBalance.toString(), "0");
      });
    });

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./PriceConverter.sol";

error FundMe__NotOwner();

contract FundMe {
  using PriceConverter for uint256;

  mapping(address => uint256) private addressToAmountFunded;
  address[] private funders;

  // Could we make this constant?  /* hint: no! We should make it immutable! */
  address private immutable i_owner;
  uint256 public constant MINIMUM_USD = 50 * 10 ** 18;
  AggregatorV3Interface private priceFeed;

  modifier onlyOwner() {
    // require(msg.sender == owner);
    if (msg.sender != i_owner) revert FundMe__NotOwner();
    _;
  }

  constructor(address priceFeedAddress) {
    i_owner = msg.sender;
    priceFeed = AggregatorV3Interface(priceFeedAddress);
  }

  // Explainer from: https://solidity-by-example.org/fallback/
  // Ether is sent to contract
  //      is msg.data empty?
  //          /   \
  //         yes  no
  //         /     \
  //    receive()?  fallback()
  //     /   \
  //   yes   no
  //  /        \
  //receive()  fallback()
  receive() external payable {
    fund();
  }

  fallback() external payable {
    fund();
  }

  function fund() public payable {
    require(msg.value.getConversionRate(priceFeed) >= MINIMUM_USD, "You need to spend more ETH!");
    // require(PriceConverter.getConversionRate(msg.value) >= MINIMUM_USD, "You need to spend more ETH!");
    addressToAmountFunded[msg.sender] += msg.value;
    funders.push(msg.sender);
  }

  function withdraw() public onlyOwner {
    for (uint256 funderIndex = 0; funderIndex < funders.length; funderIndex++) {
      address funder = funders[funderIndex];
      addressToAmountFunded[funder] = 0;
    }
    funders = new address[](0);
    // // transfer
    // payable(msg.sender).transfer(address(this).balance);
    // // send
    // bool sendSuccess = payable(msg.sender).send(address(this).balance);
    // require(sendSuccess, "Send failed");
    // call
    (bool callSuccess, ) = payable(msg.sender).call{value: address(this).balance}("");
    require(callSuccess, "Call failed");
  }

  function cheaperWithdraw() public onlyOwner {
    address[] memory _funders = funders;
    //mappings can't be in memory
    for (uint256 funderIndex = 0; funderIndex < _funders.length; funderIndex++) {
      address funder = _funders[funderIndex];
      addressToAmountFunded[funder] = 0;
    }
    funders = new address[](0);
    (bool callSuccess, ) = payable(msg.sender).call{value: address(this).balance}("");
    require(callSuccess, "Call failed");
  }

  function getVersion() public view returns (uint256) {
    // ETH/USD price feed address of Goerli Network.
    return AggregatorV3Interface(0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e).version();
  }

  function getOwner() public view returns (address) {
    return i_owner;
  }

  function getFunder(uint256 index) public view returns (address) {
    return funders[index];
  }

  function getAddressToAmountFunded(address _funder) public view returns (uint256) {
    return addressToAmountFunded[_funder];
  }

  function getPriceFeed() public view returns (AggregatorV3Interface) {
    return priceFeed;
  }
}

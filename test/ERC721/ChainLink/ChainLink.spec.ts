import { expect } from "chai";
import { ethers, web3 } from "hardhat";
import { ContractFactory, ContractReceipt, ContractTransaction } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { Link, MindCoin } from "../../../typechain-types";
import { amountInWei, initialTokenAmountInWei, tokenName, tokenSymbol } from "../../constants";

describe("Link", function () {
  let link: ContractFactory;
  let coin: ContractFactory;
  let linkInstance: Link;
  let coinInstance: MindCoin;
  let owner: SignerWithAddress;

  beforeEach(async function () {
    link = await ethers.getContractFactory("Link");
    coin = await ethers.getContractFactory("LinkErc20");
    [owner] = await ethers.getSigners();

    coinInstance = (await coin.deploy(tokenName, tokenSymbol)) as MindCoin;

    linkInstance = (await link.deploy(
      owner.address, // VRF Coordinator
      coinInstance.address, // LINK Token contract
    )) as Link;

    await coinInstance.mint(owner.address, initialTokenAmountInWei);
  });

  describe("Random request", function () {
    it("should fail with no LINK", async function () {
      const coinInstanceBalance = await coinInstance.balanceOf(linkInstance.address);
      expect(coinInstanceBalance).to.equal(0);
      const tx = linkInstance.getRandomNumber();
      await expect(tx).to.be.revertedWith("Not enough LINK - fill contract with faucet");
    });

    it("should request Random", async function () {
      await coinInstance.transfer(linkInstance.address, amountInWei);
      const coinInstanceBalance = await coinInstance.balanceOf(linkInstance.address);
      expect(coinInstanceBalance).to.equal(amountInWei);

      const tx: ContractTransaction = await linkInstance.getRandomNumber();
      const receipt: ContractReceipt = await tx.wait();
      void owner;
      expect(receipt); // or what?
    });
  });

  describe("Fulfill random", function () {
    it("should fulfill random", async function () {
      const requestId = web3.utils.asciiToHex("Hello, World! :)\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0");
      const randomness = web3.utils.toHex("klgegk;glews;v;lsv1r33232r23r3rr");
      const tx = await linkInstance.rawFulfillRandomness(requestId, randomness);
      await expect(tx).to.emit(linkInstance, "Random").withArgs("1");
    });
  });
});

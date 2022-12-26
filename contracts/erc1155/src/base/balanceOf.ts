import { expect } from "chai";
import { ethers } from "hardhat";
import { constants, Contract } from "ethers";

import { amount, tokenId } from "@gemunion/contracts-constants";

export function shouldBalanceOf(factory: () => Promise<Contract>) {
  describe("balanceOf", function () {
    it("should fail for zero addr", async function () {
      const contractInstance = await factory();

      const tx = contractInstance.balanceOf(constants.AddressZero, tokenId);
      await expect(tx).to.be.revertedWith(`ERC1155: address zero is not a valid owner`);
    });

    it("should get balance of owner", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      await contractInstance.mint(owner.address, tokenId, amount, "0x");
      const balance = await contractInstance.balanceOf(owner.address, tokenId);
      expect(balance).to.equal(amount);
    });

    it("should get balance of not owner", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await contractInstance.mint(owner.address, tokenId, amount, "0x");
      const balance = await contractInstance.balanceOf(receiver.address, tokenId);
      expect(balance).to.equal(0);
    });
  });
}

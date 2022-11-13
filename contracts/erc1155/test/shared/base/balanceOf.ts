import { expect } from "chai";
import { ethers } from "hardhat";
import { constants } from "ethers";

import { amount, tokenId } from "@gemunion/contracts-test-constants";

import { deployErc1155Base } from "../fixtures";

export function shouldBalanceOf(name: string) {
  describe("balanceOf", function () {
    it("should fail for zero addr", async function () {
      const { contractInstance } = await deployErc1155Base(name);

      const tx = contractInstance.balanceOf(constants.AddressZero, tokenId);
      await expect(tx).to.be.revertedWith(`ERC1155: address zero is not a valid owner`);
    });

    it("should get balance of owner", async function () {
      const [owner] = await ethers.getSigners();
      const { contractInstance } = await deployErc1155Base(name);

      await contractInstance.mint(owner.address, tokenId, amount, "0x");
      const balance = await contractInstance.balanceOf(owner.address, tokenId);
      expect(balance).to.equal(amount);
    });

    it("should get balance of not owner", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const { contractInstance } = await deployErc1155Base(name);

      await contractInstance.mint(owner.address, tokenId, amount, "0x");
      const balance = await contractInstance.balanceOf(receiver.address, tokenId);
      expect(balance).to.equal(0);
    });
  });
}

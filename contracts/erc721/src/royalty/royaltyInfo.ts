import { expect } from "chai";
import { ethers, utils } from "hardhat";
import { Contract } from "ethers";

import { royalty } from "@gemunion/contracts-constants";

export function shouldGetRoyaltyInfo(factory: () => Promise<Contract>) {
  describe("royaltyInfo", function () {
    it("should get default royalty info", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      const amount = utils.parseUnits("1.00", "ether");
      const royaltyAmount = utils.parseUnits("0.01", "ether");

      const tx = await contractInstance.royaltyInfo(0, amount);
      expect(tx).deep.equal([owner.address, royaltyAmount]);
    });

    it("should get royalty info", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const amount = utils.parseUnits("1.00", "ether");
      const royaltyAmount = utils.parseUnits("0.02", "ether");

      await contractInstance.setTokenRoyalty(0, receiver.address, royalty * 2);

      const tx = await contractInstance.royaltyInfo(0, amount);
      expect(tx).deep.equal([receiver.address, royaltyAmount]);
    });
  });
}

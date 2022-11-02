import { expect } from "chai";
import { ethers } from "hardhat";
import { royalty } from "../../../constants";
import { deployErc998Base } from "../fixtures";

export function shouldGetRoyaltyInfo(name: string) {
  describe("royaltyInfo", function () {
    it("should get default royalty info", async function () {
      const [owner] = await ethers.getSigners();
      const { contractInstance } = await deployErc998Base(name);

      const amount = ethers.utils.parseUnits("1.00", "ether");
      const royaltyAmount = ethers.utils.parseUnits("0.01", "ether");

      const tx = await contractInstance.royaltyInfo(0, amount);
      expect(tx).deep.equal([owner.address, royaltyAmount]);
    });

    it("should get royalty info", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const { contractInstance } = await deployErc998Base(name);

      const amount = ethers.utils.parseUnits("1.00", "ether");
      const royaltyAmount = ethers.utils.parseUnits("0.02", "ether");

      await contractInstance.setTokenRoyalty(0, receiver.address, royalty * 2);

      const tx = await contractInstance.royaltyInfo(0, amount);
      expect(tx).deep.equal([receiver.address, royaltyAmount]);
    });
  });
}

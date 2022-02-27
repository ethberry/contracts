import { expect } from "chai";
import { ethers } from "hardhat";

export function shouldRoyaltyInfo() {
  describe("royaltyInfo", function () {
    it("should get default royalty info", async function () {
      const amount = ethers.utils.parseUnits("1.00", "ether");
      const royaltyAmount = ethers.utils.parseUnits("0.01", "ether");

      const tx = await this.erc721Instance.royaltyInfo(0, amount);
      expect(tx).deep.equal([this.owner.address, royaltyAmount]);
    });

    it("should get royalty info", async function () {
      const royaltyNumerator = 5000;
      const amount = ethers.utils.parseUnits("1.00", "ether");
      const royaltyAmount = ethers.utils.parseUnits("0.50", "ether");

      await this.erc721Instance.setTokenRoyalty(0, this.receiver.address, royaltyNumerator);

      const tx = await this.erc721Instance.royaltyInfo(0, amount);
      expect(tx).deep.equal([this.receiver.address, royaltyAmount]);
    });
  });
}

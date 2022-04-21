import { expect } from "chai";
import { ethers } from "hardhat";
import { royaltyNumerator } from "../../../constants";

export function shouldGetRoyaltyInfo() {
  describe("royaltyInfo", function () {
    it("should get default royalty info", async function () {
      const amount = ethers.utils.parseUnits("1.00", "ether");
      const royaltyAmount = ethers.utils.parseUnits("0.01", "ether");

      const tx = await this.erc721Instance.royaltyInfo(0, amount);
      expect(tx).deep.equal([this.owner.address, royaltyAmount]);
    });

    it("should get royalty info", async function () {
      const amount = ethers.utils.parseUnits("1.00", "ether");
      const royaltyAmount = ethers.utils.parseUnits("0.02", "ether");

      await this.erc721Instance.setTokenRoyalty(0, this.receiver.address, royaltyNumerator * 2);

      const tx = await this.erc721Instance.royaltyInfo(0, amount);
      expect(tx).deep.equal([this.receiver.address, royaltyAmount]);
    });
  });
}

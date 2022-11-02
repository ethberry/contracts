import { expect } from "chai";
import { ethers } from "hardhat";

import { royalty, tokenId } from "../../../../constants";
import { deployErc998Base } from "../../fixtures";

export function shouldBurn(name: string) {
  describe("burn", function () {
    it("should reset token royalty info", async function () {
      const [owner] = await ethers.getSigners();
      const { contractInstance } = await deployErc998Base(name);

      await contractInstance.mint(owner.address, tokenId);

      await contractInstance.setTokenRoyalty(tokenId, owner.address, royalty * 2);
      const [receiver, amount] = await contractInstance.royaltyInfo(tokenId, 1e6);
      expect(receiver).to.equal(owner.address);
      expect(amount).to.equal(20000);

      const tx = await contractInstance.burn(tokenId);
      await expect(tx)
        .to.emit(contractInstance, "Transfer")
        .withArgs(owner.address, ethers.constants.AddressZero, tokenId);

      const [receiver2, amount2] = await contractInstance.royaltyInfo(tokenId, 1e6);
      expect(receiver2).to.equal(owner.address);
      expect(amount2).to.equal(10000);
    });
  });
}

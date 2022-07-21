import { expect } from "chai";
import { ethers } from "hardhat";
import { DEFAULT_ADMIN_ROLE } from "../../../constants";

export function shouldSetTokenRoyalty(roles = false) {
  describe("setTokenRoyalty", function () {
    it("should set token royalty", async function () {
      const royalty = 5000;

      const tx = this.erc1155Instance.setTokenRoyalty(0, this.receiver.address, royalty);
      await expect(tx).to.emit(this.erc1155Instance, "TokenRoyaltyInfo").withArgs(0, this.receiver.address, royalty);
    });

    it("should fail: royalty fee will exceed salePrice", async function () {
      const royalty = 11000;

      const tx = this.erc1155Instance.setTokenRoyalty(0, this.receiver.address, royalty);
      await expect(tx).to.be.revertedWith("ERC2981: royalty fee will exceed salePrice");
    });

    it("should fail: invalid parameters", async function () {
      const royalty = 5000;

      const tx = this.erc1155Instance.setTokenRoyalty(0, ethers.constants.AddressZero, royalty);
      await expect(tx).to.be.revertedWith("ERC2981: Invalid parameters");
    });

    it("should fail: not admin", async function () {
      const royalty = 5000;

      const tx = this.erc1155Instance.connect(this.receiver).setTokenRoyalty(0, this.receiver.address, royalty);
      await expect(tx).to.be.revertedWith(
        roles
          ? `AccessControl: account ${this.receiver.address.toLowerCase()} is missing role ${DEFAULT_ADMIN_ROLE}`
          : "Ownable: caller is not the owner",
      );
    });
  });
}

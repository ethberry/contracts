import { expect } from "chai";
import { ethers } from "hardhat";
import { DEFAULT_ADMIN_ROLE, royalty } from "../../../constants";

export function shouldSetDefaultRoyalty(roles = false) {
  describe("setDefaultRoyalty", function () {
    it("should set token royalty", async function () {
      const tx = this.erc1155Instance.setDefaultRoyalty(this.receiver.address, royalty * 2);
      await expect(tx)
        .to.emit(this.erc1155Instance, "DefaultRoyaltyInfo")
        .withArgs(this.receiver.address, royalty * 2);
    });

    it("should fail: royalty fee will exceed salePrice", async function () {
      const tx = this.erc1155Instance.setDefaultRoyalty(this.receiver.address, royalty * royalty);
      await expect(tx).to.be.revertedWith("ERC2981: royalty fee will exceed salePrice");
    });

    it("should fail: invalid parameters", async function () {
      const tx = this.erc1155Instance.setDefaultRoyalty(ethers.constants.AddressZero, royalty);
      await expect(tx).to.be.revertedWith("ERC2981: invalid receiver");
    });

    it("should fail: not admin", async function () {
      const tx = this.erc1155Instance.connect(this.receiver).setDefaultRoyalty(this.receiver.address, royalty);
      await expect(tx).to.be.revertedWith(
        roles
          ? `AccessControl: account ${this.receiver.address.toLowerCase()} is missing role ${DEFAULT_ADMIN_ROLE}`
          : "Ownable: caller is not the owner",
      );
    });
  });
}

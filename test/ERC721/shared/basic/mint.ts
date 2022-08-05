import { expect } from "chai";
import { ethers } from "hardhat";

import { accessControlInterfaceId, MINTER_ROLE, tokenId } from "../../../constants";

export function shouldMint() {
  describe("mint", function () {
    it("should fail: account is missing role", async function () {
      const supportsAccessControl = await this.contractInstance.supportsInterface(accessControlInterfaceId);

      const tx = this.erc721Instance.connect(this.receiver).mint(this.receiver.address, tokenId);
      await expect(tx).to.be.revertedWith(
        supportsAccessControl
          ? `AccessControl: account ${this.receiver.address.toLowerCase()} is missing role ${MINTER_ROLE}`
          : "Ownable: caller is not the owner",
      );
    });

    it("should mint to wallet", async function () {
      const tx = this.erc721Instance.mint(this.owner.address, tokenId);
      await expect(tx)
        .to.emit(this.erc721Instance, "Transfer")
        .withArgs(ethers.constants.AddressZero, this.owner.address, tokenId);

      const balance = await this.erc721Instance.balanceOf(this.owner.address);
      expect(balance).to.equal(1);
    });

    it("should mint to non receiver", async function () {
      const tx = this.erc721Instance.mint(this.erc721NonReceiverInstance.address, tokenId);
      await expect(tx)
        .to.emit(this.erc721Instance, "Transfer")
        .withArgs(ethers.constants.AddressZero, this.erc721NonReceiverInstance.address, tokenId);
    });

    it("should mint to receiver", async function () {
      const tx = this.erc721Instance.mint(this.erc721ReceiverInstance.address, tokenId);
      await expect(tx)
        .to.emit(this.erc721Instance, "Transfer")
        .withArgs(ethers.constants.AddressZero, this.erc721ReceiverInstance.address, tokenId);

      const balance = await this.erc721Instance.balanceOf(this.erc721ReceiverInstance.address);
      expect(balance).to.equal(1);
    });
  });
}

import { expect } from "chai";
import { ethers } from "hardhat";

import { MINTER_ROLE } from "../../../constants";

export function shouldMint(roles = false) {
  describe("mint", function () {
    it("should fail: wrong role", async function () {
      const tx = this.erc721Instance.connect(this.receiver).mint(this.receiver.address);
      await expect(tx).to.be.revertedWith(
        roles
          ? `AccessControl: account ${this.receiver.address.toLowerCase()} is missing role ${MINTER_ROLE}`
          : "Ownable: caller is not the owner",
      );
    });

    it("should mint to wallet", async function () {
      const tx = this.erc721Instance.mint(this.receiver.address);
      await expect(tx)
        .to.emit(this.erc721Instance, "Transfer")
        .withArgs(ethers.constants.AddressZero, this.receiver.address, 0);

      const balance = await this.erc721Instance.balanceOf(this.receiver.address);
      expect(balance).to.equal(1);
    });

    it("should mint to non receiver", async function () {
      const tx = this.erc721Instance.mint(this.erc721NonReceiverInstance.address);
      await expect(tx)
        .to.emit(this.erc721Instance, "Transfer")
        .withArgs(ethers.constants.AddressZero, this.erc721NonReceiverInstance.address, 0);
    });

    it("should mint to receiver", async function () {
      const tx = this.erc721Instance.mint(this.erc721ReceiverInstance.address);
      await expect(tx)
        .to.emit(this.erc721Instance, "Transfer")
        .withArgs(ethers.constants.AddressZero, this.erc721ReceiverInstance.address, 0);

      const balance = await this.erc721Instance.balanceOf(this.erc721ReceiverInstance.address);
      expect(balance).to.equal(1);
    });
  });
}

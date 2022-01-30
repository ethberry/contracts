import { expect } from "chai";
import { ethers } from "hardhat";

import { MINTER_ROLE } from "../../constants";

export function shouldSafeMint() {
  describe("safeMint", function () {
    it("should fail for wrong role", async function () {
      const tx = this.erc998Instance.connect(this.receiver).safeMint(this.receiver.address);
      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${this.receiver.address.toLowerCase()} is missing role ${MINTER_ROLE}`,
      );
    });

    it("should mint to wallet", async function () {
      const tx = this.erc998Instance.safeMint(this.owner.address);
      await expect(tx).to.emit(this.erc998Instance, "Transfer").withArgs(ethers.constants.AddressZero, this.owner.address, 0);

      const balance = await this.erc998Instance.balanceOf(this.owner.address);
      expect(balance).to.equal(1);
    });

    it("should fail to mint to non receiver", async function () {
      const tx = this.erc998Instance.safeMint(this.erc721NonReceiverInstance.address);
      await expect(tx).to.be.revertedWith(`ERC721: transfer to non ERC721Receiver implementer`);
    });

    it("should mint to receiver", async function () {
      const tx = this.erc998Instance.safeMint(this.erc721ReceiverInstance.address);
      await expect(tx)
        .to.emit(this.erc998Instance, "Transfer")
        .withArgs(ethers.constants.AddressZero, this.erc721ReceiverInstance.address, 0);

      const balance = await this.erc998Instance.balanceOf(this.erc721ReceiverInstance.address);
      expect(balance).to.equal(1);
    });
  });
}

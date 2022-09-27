import { expect } from "chai";
import { ethers } from "hardhat";

import { amount, PAUSER_ROLE, tokenId } from "../../constants";
import { deployErc1155Base } from "./fixtures";

export function shouldERC1155Pause(name: string) {
  describe("pause", function () {
    it("should fail: account is missing role", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const { contractInstance } = await deployErc1155Base(name);

      const tx = contractInstance.connect(receiver).pause();
      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${PAUSER_ROLE}`,
      );

      const tx2 = contractInstance.connect(receiver).unpause();
      await expect(tx2).to.be.revertedWith(
        `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${PAUSER_ROLE}`,
      );
    });

    it("should pause/unpause", async function () {
      const [owner] = await ethers.getSigners();
      const { contractInstance } = await deployErc1155Base(name);

      const tx1 = contractInstance.mint(owner.address, tokenId, amount, "0x");
      await expect(tx1).to.not.be.reverted;

      const balanceOfOwner1 = await contractInstance.balanceOf(owner.address, tokenId);
      expect(balanceOfOwner1).to.equal(amount);

      const tx2 = contractInstance.pause();
      await expect(tx2).to.emit(contractInstance, "Paused").withArgs(owner.address);

      const tx3 = contractInstance.mint(owner.address, tokenId, amount, "0x");
      await expect(tx3).to.be.revertedWith(`ERC1155Pausable: token transfer while paused`);

      const tx4 = contractInstance.unpause();
      await expect(tx4).to.emit(contractInstance, "Unpaused").withArgs(owner.address);

      const tx5 = contractInstance.mint(owner.address, tokenId, amount, "0x");
      await expect(tx5).to.not.be.reverted;

      const balanceOfOwner = await contractInstance.balanceOf(owner.address, tokenId);
      expect(balanceOfOwner).to.equal(2 * amount);
    });
  });
}

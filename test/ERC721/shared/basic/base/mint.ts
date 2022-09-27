import { expect } from "chai";
import { ethers } from "hardhat";

import { accessControlInterfaceId, MINTER_ROLE, tokenId } from "../../../../constants";
import { deployErc721Base } from "../../fixtures";
import { deployErc721NonReceiver, deployErc721Receiver } from "../../fixtures/wallet";

export function shouldMint(name: string) {
  describe("mint", function () {
    it("should fail: account is missing role", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const { contractInstance } = await deployErc721Base(name);

      const supportsAccessControl = await contractInstance.supportsInterface(accessControlInterfaceId);

      const tx = contractInstance.connect(receiver).mint(receiver.address, tokenId);
      await expect(tx).to.be.revertedWith(
        supportsAccessControl
          ? `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${MINTER_ROLE}`
          : "Ownable: caller is not the owner",
      );
    });

    it("should mint to wallet", async function () {
      const [owner] = await ethers.getSigners();
      const { contractInstance } = await deployErc721Base(name);

      const tx = contractInstance.mint(owner.address, tokenId);
      await expect(tx)
        .to.emit(contractInstance, "Transfer")
        .withArgs(ethers.constants.AddressZero, owner.address, tokenId);

      const balance = await contractInstance.balanceOf(owner.address);
      expect(balance).to.equal(1);
    });

    it("should mint to non receiver", async function () {
      const { contractInstance } = await deployErc721Base(name);
      const { contractInstance: erc721NonReceiverInstance } = await deployErc721NonReceiver();

      const tx = contractInstance.mint(erc721NonReceiverInstance.address, tokenId);
      await expect(tx)
        .to.emit(contractInstance, "Transfer")
        .withArgs(ethers.constants.AddressZero, erc721NonReceiverInstance.address, tokenId);
    });

    it("should mint to receiver", async function () {
      const { contractInstance } = await deployErc721Base(name);
      const { contractInstance: erc721ReceiverInstance } = await deployErc721Receiver();

      const tx = contractInstance.mint(erc721ReceiverInstance.address, tokenId);
      await expect(tx)
        .to.emit(contractInstance, "Transfer")
        .withArgs(ethers.constants.AddressZero, erc721ReceiverInstance.address, tokenId);

      const balance = await contractInstance.balanceOf(erc721ReceiverInstance.address);
      expect(balance).to.equal(1);
    });
  });
}

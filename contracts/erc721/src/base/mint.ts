import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

import { InterfaceId, tokenId } from "@gemunion/contracts-constants";

import { deployErc721NonReceiver, deployErc721Receiver } from "@gemunion/contracts-mocks";

export function shouldMint(factory: () => Promise<Contract>, options: Record<string, any> = {}) {
  describe("mint", function () {
    it("should fail: account is missing role", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const supportsAccessControl = await contractInstance.supportsInterface(InterfaceId.IAccessControl);

      const tx = contractInstance.connect(receiver).mint(receiver.address, options.initialBalance + tokenId);
      await expect(tx).to.be.revertedWith(
        supportsAccessControl
          ? `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${options.minterRole}`
          : "Ownable: caller is not the owner",
      );
    });

    it("should mint to wallet", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx = contractInstance.mint(owner.address, options.initialBalance + tokenId);
      await expect(tx)
        .to.emit(contractInstance, "Transfer")
        .withArgs(ethers.constants.AddressZero, owner.address, options.initialBalance + tokenId);

      const balance = await contractInstance.balanceOf(owner.address);
      expect(balance).to.equal(options.initialBalance + 1);
    });

    it("should mint to non receiver", async function () {
      const contractInstance = await factory();
      const erc721NonReceiverInstance = await deployErc721NonReceiver();

      const tx = contractInstance.mint(erc721NonReceiverInstance.address, options.initialBalance + tokenId);
      await expect(tx)
        .to.emit(contractInstance, "Transfer")
        .withArgs(ethers.constants.AddressZero, erc721NonReceiverInstance.address, options.initialBalance + tokenId);
    });

    it("should mint to receiver", async function () {
      const contractInstance = await factory();
      const erc721ReceiverInstance = await deployErc721Receiver();

      const tx = contractInstance.mint(erc721ReceiverInstance.address, options.initialBalance + tokenId);
      await expect(tx)
        .to.emit(contractInstance, "Transfer")
        .withArgs(ethers.constants.AddressZero, erc721ReceiverInstance.address, options.initialBalance + tokenId);

      const balance = await contractInstance.balanceOf(erc721ReceiverInstance.address);
      expect(balance).to.equal(1);
    });
  });
}

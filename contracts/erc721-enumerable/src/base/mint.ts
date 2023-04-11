import { expect } from "chai";
import { ethers } from "hardhat";
import { constants, Contract } from "ethers";

import { InterfaceId } from "@gemunion/contracts-constants";

import { deployJerk, deployWallet } from "@gemunion/contracts-mocks";

export function shouldMint(factory: () => Promise<Contract>, options: Record<string, any> = {}) {
  describe("mint", function () {
    it("should fail: account is missing role", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const supportsAccessControl = await contractInstance.supportsInterface(InterfaceId.IAccessControl);

      const tx = contractInstance.connect(receiver).mint(receiver.address);
      await expect(tx).to.be.revertedWith(
        supportsAccessControl
          ? `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${options.minterRole}`
          : "Ownable: caller is not the owner",
      );
    });

    it("should mint to wallet", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx = contractInstance.mint(receiver.address);
      await expect(tx).to.emit(contractInstance, "Transfer").withArgs(constants.AddressZero, receiver.address, 0);

      const balance = await contractInstance.balanceOf(receiver.address);
      expect(balance).to.equal(1);
    });

    it("should mint to non receiver", async function () {
      const contractInstance = await factory();

      const erc721NonReceiverInstance = await deployJerk();

      const tx = contractInstance.mint(erc721NonReceiverInstance.address);
      await expect(tx)
        .to.emit(contractInstance, "Transfer")
        .withArgs(constants.AddressZero, erc721NonReceiverInstance.address, 0);
    });

    it("should mint to receiver", async function () {
      const contractInstance = await factory();

      const erc721ReceiverInstance = await deployWallet();

      const tx = contractInstance.mint(erc721ReceiverInstance.address);
      await expect(tx)
        .to.emit(contractInstance, "Transfer")
        .withArgs(constants.AddressZero, erc721ReceiverInstance.address, 0);

      const balance = await contractInstance.balanceOf(erc721ReceiverInstance.address);
      expect(balance).to.equal(1);
    });
  });
}

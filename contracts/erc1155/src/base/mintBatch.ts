import { expect } from "chai";
import { ethers } from "hardhat";
import { constants, Contract } from "ethers";

import { amount, InterfaceId, MINTER_ROLE, tokenId } from "@gemunion/contracts-constants";
import { deployJerk, deployWallet } from "@gemunion/contracts-mocks";

import type { IERC1155Options } from "../shared/defaultMint";
import { defaultMintBatchERC1155 } from "../shared/defaultMint";

export function shouldMintBatch(factory: () => Promise<Contract>, options: IERC1155Options = {}) {
  const { mintBatch = defaultMintBatchERC1155, minterRole = MINTER_ROLE } = options;

  describe("mintBatch", function () {
    it("should mint to wallet", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx1 = mintBatch(contractInstance, owner, receiver.address, [tokenId], [amount], "0x");
      await expect(tx1)
        .to.emit(contractInstance, "TransferBatch")
        .withArgs(owner.address, constants.AddressZero, receiver.address, [tokenId], [amount]);

      const balance = await contractInstance.balanceOf(receiver.address, tokenId);
      expect(balance).to.equal(amount);
    });

    it("should mint to receiver", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();
      const erc1155ReceiverInstance = await deployWallet();

      const tx1 = mintBatch(contractInstance, owner, erc1155ReceiverInstance.address, [tokenId], [amount], "0x");
      await expect(tx1)
        .to.emit(contractInstance, "TransferBatch")
        .withArgs(owner.address, constants.AddressZero, erc1155ReceiverInstance.address, [tokenId], [amount]);

      const balance = await contractInstance.balanceOf(erc1155ReceiverInstance.address, tokenId);
      expect(balance).to.equal(amount);
    });

    it("should fail: non receiver", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();
      const erc1155NonReceiverInstance = await deployJerk();

      const tx1 = mintBatch(contractInstance, owner, erc1155NonReceiverInstance.address, [tokenId], [amount], "0x");
      await expect(tx1).to.be.revertedWith(`ERC1155: transfer to non-ERC1155Receiver implementer`);
    });

    it("should fail: account is missing role", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const supportsAccessControl = await contractInstance.supportsInterface(InterfaceId.IAccessControl);

      const tx1 = mintBatch(contractInstance, receiver, owner.address, [tokenId], [amount], "0x");
      await expect(tx1).to.be.revertedWith(
        supportsAccessControl
          ? `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${minterRole}`
          : "Ownable: caller is not the owner",
      );
    });
  });
}

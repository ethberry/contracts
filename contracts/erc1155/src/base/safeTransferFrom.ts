import { expect } from "chai";
import { ethers } from "hardhat";
import { ZeroAddress } from "ethers";

import { amount, tokenId } from "@ethberry/contracts-constants";
import { deployRejector, deployHolder } from "@ethberry/contracts-finance";

import type { IERC1155Options } from "../shared/defaultMint";
import { defaultMintERC1155 } from "../shared/defaultMint";

export function shouldSafeTransferFrom(factory: () => Promise<any>, options: IERC1155Options = {}) {
  const { mint = defaultMintERC1155 } = options;

  describe("safeTransferFrom", function () {
    it("should transfer own tokens to EOA", async function () {
      const [owner, _receiver, stranger] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner, tokenId, amount, "0x");

      const tx = contractInstance.safeTransferFrom(owner, stranger, tokenId, amount, "0x");
      await expect(tx)
        .to.emit(contractInstance, "TransferSingle")
        .withArgs(owner, owner, stranger.address, tokenId, amount);

      const balanceOfOwner = await contractInstance.balanceOf(owner, tokenId);
      expect(balanceOfOwner).to.equal(0);

      const balanceOfReceiver = await contractInstance.balanceOf(stranger, tokenId);
      expect(balanceOfReceiver).to.equal(amount);
    });

    it("should transfer approved tokens to EOA", async function () {
      const [owner, receiver, stranger] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner, tokenId, amount, "0x");
      await contractInstance.setApprovalForAll(receiver, true);

      const tx = contractInstance.connect(receiver).safeTransferFrom(owner, stranger, tokenId, amount, "0x");
      await expect(tx)
        .to.emit(contractInstance, "TransferSingle")
        .withArgs(receiver, owner, stranger.address, tokenId, amount);

      const balanceOfOwner = await contractInstance.balanceOf(owner, tokenId);
      expect(balanceOfOwner).to.equal(0);

      const balanceOfReceiver = await contractInstance.balanceOf(stranger, tokenId);
      expect(balanceOfReceiver).to.equal(amount);
    });

    it("should transfer own tokens to receiver contract", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      const erc1155ReceiverInstance = await deployHolder();

      await mint(contractInstance, owner, owner, tokenId, amount, "0x");
      const tx = contractInstance.safeTransferFrom(owner, erc1155ReceiverInstance, tokenId, amount, "0x");
      await expect(tx)
        .to.emit(contractInstance, "TransferSingle")
        .withArgs(owner, owner, erc1155ReceiverInstance, tokenId, amount);

      const balanceOfOwner = await contractInstance.balanceOf(owner, tokenId);
      expect(balanceOfOwner).to.equal(0);

      const balanceOfReceiver = await contractInstance.balanceOf(erc1155ReceiverInstance, tokenId);
      expect(balanceOfReceiver).to.equal(amount);
    });

    it("should transfer approved tokens to receiver contract", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const erc1155ReceiverInstance = await deployHolder();

      await mint(contractInstance, owner, owner, tokenId, amount, "0x");
      await contractInstance.setApprovalForAll(receiver, true);
      const checkApprove = await contractInstance.isApprovedForAll(owner, receiver);
      expect(checkApprove).to.equal(true);
      await contractInstance.setApprovalForAll(receiver, true);

      const tx = contractInstance
        .connect(receiver)
        .safeTransferFrom(owner, erc1155ReceiverInstance, tokenId, amount, "0x");
      await expect(tx)
        .to.emit(contractInstance, "TransferSingle")
        .withArgs(receiver, owner, erc1155ReceiverInstance, tokenId, amount);

      const balanceOfOwner = await contractInstance.balanceOf(owner, tokenId);
      expect(balanceOfOwner).to.equal(0);

      const balanceOfReceiver = await contractInstance.balanceOf(erc1155ReceiverInstance, tokenId);
      expect(balanceOfReceiver).to.equal(amount);
    });

    it("should fail: ERC1155MissingApprovalForAll", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();
      await mint(contractInstance, owner, owner, tokenId, amount, "0x");
      const tx = contractInstance.connect(receiver).safeTransferFrom(owner, receiver, tokenId, amount, "0x");

      await expect(tx)
        .to.be.revertedWithCustomError(contractInstance, "ERC1155MissingApprovalForAll")
        .withArgs(receiver, owner);
    });

    it("should fail: ERC1155InvalidReceiver (NonReceiver)", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      const erc1155NonReceiverInstance = await deployRejector();

      await mint(contractInstance, owner, owner, tokenId, amount, "0x");
      const tx = contractInstance.safeTransferFrom(owner, erc1155NonReceiverInstance, tokenId, amount, "0x");
      await expect(tx)
        .to.be.revertedWithCustomError(contractInstance, "ERC1155InvalidReceiver")
        .withArgs(erc1155NonReceiverInstance);
    });

    it("should fail: ERC1155InvalidReceiver (ZeroAddress)", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner, tokenId, amount, "0x");
      const tx = contractInstance.safeTransferFrom(owner, ZeroAddress, tokenId, amount, "0x");
      await expect(tx).to.be.revertedWithCustomError(contractInstance, "ERC1155InvalidReceiver").withArgs(ZeroAddress);
    });
  });
}

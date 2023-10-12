import { expect } from "chai";
import { ethers } from "hardhat";
import { ZeroAddress } from "ethers";

import { tokenId } from "@gemunion/contracts-constants";
import { deployJerk, deployWallet } from "@gemunion/contracts-mocks";

import type { IERC721Options } from "../shared/defaultMint";
import { defaultMintERC721 } from "../shared/defaultMint";

export function shouldSafeTransferFrom(factory: () => Promise<any>, options: IERC721Options = {}) {
  const { mint = defaultMintERC721, batchSize = 0n } = options;

  describe("safeTransferFrom", function () {
    it("should transfer own tokens to EOA", async function () {
      const [owner, _receiver, stranger] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner, batchSize + tokenId);
      const tx = contractInstance.safeTransferFrom(owner, stranger, batchSize + tokenId);

      await expect(tx)
        .to.emit(contractInstance, "Transfer")
        .withArgs(owner.address, stranger.address, batchSize + tokenId);

      const balanceOfOwner = await contractInstance.balanceOf(owner);
      expect(balanceOfOwner).to.equal(batchSize);

      const balanceOfReceiver = await contractInstance.balanceOf(stranger);
      expect(balanceOfReceiver).to.equal(1);
    });

    it("should transfer approved tokens to EOA", async function () {
      const [owner, receiver, stranger] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner, batchSize + tokenId);
      await contractInstance.approve(receiver, batchSize + tokenId);

      const tx = contractInstance.connect(receiver).safeTransferFrom(owner, stranger, batchSize + tokenId);

      await expect(tx)
        .to.emit(contractInstance, "Transfer")
        .withArgs(owner.address, stranger.address, batchSize + tokenId);

      const balanceOfOwner = await contractInstance.balanceOf(owner);
      expect(balanceOfOwner).to.equal(batchSize);

      const balanceOfReceiver = await contractInstance.balanceOf(stranger);
      expect(balanceOfReceiver).to.equal(1);
    });

    it("should transfer own tokens to receiver contract", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      const erc721ReceiverInstance = await deployWallet();

      await mint(contractInstance, owner, owner, batchSize + tokenId);
      const tx = contractInstance.safeTransferFrom(owner, erc721ReceiverInstance, batchSize + tokenId);

      await expect(tx)
        .to.emit(contractInstance, "Transfer")
        .withArgs(owner.address, await erc721ReceiverInstance.getAddress(), batchSize + tokenId);

      const balanceOfOwner = await contractInstance.balanceOf(owner);
      expect(balanceOfOwner).to.equal(batchSize);

      const balanceOfReceiver = await contractInstance.balanceOf(erc721ReceiverInstance);
      expect(balanceOfReceiver).to.equal(1);
    });

    it("should transfer approved tokens to receiver contract", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const erc721ReceiverInstance = await deployWallet();

      await mint(contractInstance, owner, owner, batchSize + tokenId);
      await contractInstance.approve(receiver, batchSize + tokenId);

      const tx = contractInstance
        .connect(receiver)
        .safeTransferFrom(owner, erc721ReceiverInstance, batchSize + tokenId);

      await expect(tx)
        .to.emit(contractInstance, "Transfer")
        .withArgs(owner.address, await erc721ReceiverInstance.getAddress(), batchSize + tokenId);

      const balanceOfOwner = await contractInstance.balanceOf(owner);
      expect(balanceOfOwner).to.equal(batchSize);

      const balanceOfReceiver = await contractInstance.balanceOf(erc721ReceiverInstance);
      expect(balanceOfReceiver).to.equal(1);
    });

    it("should fail: ERC721InsufficientApproval", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner, batchSize + tokenId);
      const tx = contractInstance.connect(receiver).safeTransferFrom(owner, receiver, batchSize + tokenId);

      await expect(tx)
        .to.be.revertedWithCustomError(contractInstance, "ERC721InsufficientApproval")
        .withArgs(receiver.address, batchSize + tokenId);
    });

    it("should fail: ERC721InvalidReceiver (NonReceiver)", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      const erc721NonReceiverInstance = await deployJerk();

      await mint(contractInstance, owner, owner, batchSize + tokenId);
      const tx = contractInstance.safeTransferFrom(owner, erc721NonReceiverInstance, batchSize + tokenId);
      await expect(tx)
        .to.be.revertedWithCustomError(contractInstance, "ERC721InvalidReceiver")
        .withArgs(await erc721NonReceiverInstance.getAddress());
    });

    it("should fail: ERC721InvalidReceiver (ZeroAddress)", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner, batchSize + tokenId);
      const tx = contractInstance.safeTransferFrom(owner, ZeroAddress, batchSize + tokenId);
      await expect(tx).to.be.revertedWithCustomError(contractInstance, "ERC721InvalidReceiver").withArgs(ZeroAddress);
    });
  });
}

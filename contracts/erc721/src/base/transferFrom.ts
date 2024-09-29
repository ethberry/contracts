import { expect } from "chai";
import { ethers } from "hardhat";
import { ZeroAddress } from "ethers";

import { tokenId } from "@ethberry/contracts-constants";

import type { IERC721Options } from "../shared/defaultMint";
import { defaultMintERC721 } from "../shared/defaultMint";
import { deployHolder } from "@ethberry/contracts-finance";

export function shouldTransferFrom(factory: () => Promise<any>, options: IERC721Options = {}) {
  const { mint = defaultMintERC721, batchSize = 0n } = options;

  describe("transferFrom", function () {
    it("should transfer own tokens to EOA", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner, batchSize + tokenId);
      const tx = contractInstance.transferFrom(owner, receiver, batchSize + tokenId);

      await expect(tx)
        .to.emit(contractInstance, "Transfer")
        .withArgs(owner, receiver, batchSize + tokenId);

      const balanceOfOwner = await contractInstance.balanceOf(owner);
      expect(balanceOfOwner).to.equal(batchSize);

      const balanceOfReceiver = await contractInstance.balanceOf(receiver);
      expect(balanceOfReceiver).to.equal(1);
    });

    it("should transfer approved tokens to EOA", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner, batchSize + tokenId);
      await contractInstance.approve(receiver, batchSize + tokenId);

      const tx = contractInstance.connect(receiver).transferFrom(owner, receiver, batchSize + tokenId);

      await expect(tx)
        .to.emit(contractInstance, "Transfer")
        .withArgs(owner, receiver, batchSize + tokenId);

      const balanceOfOwner = await contractInstance.balanceOf(owner);
      expect(balanceOfOwner).to.equal(batchSize);

      const balanceOfReceiver = await contractInstance.balanceOf(receiver);
      expect(balanceOfReceiver).to.equal(1);
    });

    it("should transfer own tokens to receiver contract", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      const erc721ReceiverInstance = await deployHolder();

      await mint(contractInstance, owner, owner, batchSize + tokenId);
      const tx = contractInstance.transferFrom(owner, erc721ReceiverInstance, batchSize + tokenId);

      await expect(tx)
        .to.emit(contractInstance, "Transfer")
        .withArgs(owner, erc721ReceiverInstance, batchSize + tokenId);

      const balanceOfOwner = await contractInstance.balanceOf(owner);
      expect(balanceOfOwner).to.equal(batchSize);

      const balanceOfReceiver = await contractInstance.balanceOf(erc721ReceiverInstance);
      expect(balanceOfReceiver).to.equal(1);
    });

    it("should transfer approved tokens to receiver contract", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const erc721ReceiverInstance = await deployHolder();

      await mint(contractInstance, owner, owner, batchSize + tokenId);
      await contractInstance.approve(receiver, batchSize + tokenId);

      const tx = contractInstance.connect(receiver).transferFrom(owner, erc721ReceiverInstance, batchSize + tokenId);

      await expect(tx)
        .to.emit(contractInstance, "Transfer")
        .withArgs(owner, erc721ReceiverInstance, batchSize + tokenId);

      const balanceOfOwner = await contractInstance.balanceOf(owner);
      expect(balanceOfOwner).to.equal(batchSize);

      const balanceOfReceiver = await contractInstance.balanceOf(erc721ReceiverInstance);
      expect(balanceOfReceiver).to.equal(1);
    });

    it("should fail: ERC721InsufficientApproval (NonReceiver)", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner, batchSize + tokenId);
      const tx = contractInstance.connect(receiver).transferFrom(owner, receiver, batchSize + tokenId);

      await expect(tx)
        .to.be.revertedWithCustomError(contractInstance, "ERC721InsufficientApproval")
        .withArgs(receiver, batchSize + tokenId);
    });

    it("should fail: ERC721InvalidReceiver (ZeroAddress)", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner, batchSize + tokenId);
      const tx = contractInstance.transferFrom(owner, ZeroAddress, batchSize + tokenId);

      await expect(tx).to.be.revertedWithCustomError(contractInstance, "ERC721InvalidReceiver").withArgs(ZeroAddress);
    });
  });
}

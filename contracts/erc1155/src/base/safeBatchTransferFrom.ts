import { expect } from "chai";
import { ethers } from "hardhat";
import { ZeroAddress } from "ethers";

import { amount, tokenId } from "@gemunion/contracts-constants";
import { deployRejector, deployHolder } from "@gemunion/contracts-finance";

import type { IERC1155Options } from "../shared/defaultMint";
import { defaultMintERC1155 } from "../shared/defaultMint";

export function shouldSafeBatchTransferFrom(factory: () => Promise<any>, options: IERC1155Options = {}) {
  const { mint = defaultMintERC1155 } = options;

  describe("safeBatchTransferFrom", function () {
    it("should transfer own tokens to EOA", async function () {
      const [owner, _receiver, stranger] = await ethers.getSigners();
      const contractInstance = await factory();

      const tokenId_1 = 2n;
      await mint(contractInstance, owner, owner, tokenId, amount, "0x");
      await mint(contractInstance, owner, owner, tokenId_1, amount, "0x");
      const tx = contractInstance.safeBatchTransferFrom(owner, stranger, [tokenId, tokenId_1], [amount, amount], "0x");
      await expect(tx)
        .to.emit(contractInstance, "TransferBatch")
        .withArgs(owner, owner, stranger.address, [tokenId, tokenId_1], [amount, amount]);

      const balanceOfOwner = await contractInstance.balanceOf(owner, tokenId);
      expect(balanceOfOwner).to.equal(0);

      const balanceOfReceiver = await contractInstance.balanceOf(stranger, tokenId);
      expect(balanceOfReceiver).to.equal(amount);
    });

    it("should transfer approved tokens to EOA", async function () {
      const [owner, receiver, stranger] = await ethers.getSigners();
      const contractInstance = await factory();

      const tokenId_1 = 2n;
      await mint(contractInstance, owner, owner, tokenId, amount, "0x");
      await mint(contractInstance, owner, owner, tokenId_1, amount, "0x");
      await contractInstance.setApprovalForAll(receiver, true);
      const tx = contractInstance.safeBatchTransferFrom(owner, stranger, [tokenId, tokenId_1], [amount, amount], "0x");
      await expect(tx)
        .to.emit(contractInstance, "TransferBatch")
        .withArgs(owner, owner, stranger.address, [tokenId, tokenId_1], [amount, amount]);

      const balanceOfOwner = await contractInstance.balanceOf(owner, tokenId);
      expect(balanceOfOwner).to.equal(0);

      const balanceOfReceiver = await contractInstance.balanceOf(stranger, tokenId);
      expect(balanceOfReceiver).to.equal(amount);
    });

    it("should transfer own tokens to receiver contract", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      const erc1155ReceiverInstance = await deployHolder();

      const tokenId_1 = 2n;
      await mint(contractInstance, owner, owner, tokenId, amount, "0x");
      await mint(contractInstance, owner, owner, tokenId_1, amount, "0x");
      const tx = contractInstance.safeBatchTransferFrom(
        owner,
        erc1155ReceiverInstance,
        [tokenId, tokenId_1],
        [amount, amount],
        "0x",
      );
      await expect(tx)
        .to.emit(contractInstance, "TransferBatch")
        .withArgs(owner, owner, erc1155ReceiverInstance, [tokenId, tokenId_1], [amount, amount]);

      const balanceOfOwner1 = await contractInstance.balanceOf(owner, tokenId);
      expect(balanceOfOwner1).to.equal(0);
      const balanceOfOwner2 = await contractInstance.balanceOf(owner, tokenId_1);
      expect(balanceOfOwner2).to.equal(0);

      const balanceOfReceiver1 = await contractInstance.balanceOf(erc1155ReceiverInstance, tokenId);
      expect(balanceOfReceiver1).to.equal(amount);
      const balanceOfReceiver2 = await contractInstance.balanceOf(erc1155ReceiverInstance, tokenId);
      expect(balanceOfReceiver2).to.equal(amount);
    });

    it("should transfer approved tokens to receiver contract", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const erc1155ReceiverInstance = await deployHolder();

      const tokenId_1 = 2n;
      await mint(contractInstance, owner, owner, tokenId, amount, "0x");
      await mint(contractInstance, owner, owner, tokenId_1, amount, "0x");
      await contractInstance.setApprovalForAll(receiver, true);

      const tx = contractInstance
        .connect(receiver)
        .safeBatchTransferFrom(owner, erc1155ReceiverInstance, [tokenId, tokenId_1], [amount, amount], "0x");
      await expect(tx)
        .to.emit(contractInstance, "TransferBatch")
        .withArgs(receiver, owner, erc1155ReceiverInstance, [tokenId, tokenId_1], [amount, amount]);

      const balanceOfOwner1 = await contractInstance.balanceOf(owner, tokenId);
      expect(balanceOfOwner1).to.equal(0);
      const balanceOfOwner2 = await contractInstance.balanceOf(owner, tokenId_1);
      expect(balanceOfOwner2).to.equal(0);

      const balanceOfReceiver1 = await contractInstance.balanceOf(erc1155ReceiverInstance, tokenId);
      expect(balanceOfReceiver1).to.equal(amount);
      const balanceOfReceiver2 = await contractInstance.balanceOf(erc1155ReceiverInstance, tokenId);
      expect(balanceOfReceiver2).to.equal(amount);
    });

    it("should fail: ERC1155MissingApprovalForAll", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const erc1155ReceiverInstance = await deployHolder();

      const tokenId_1 = 2n;
      await mint(contractInstance, owner, owner, tokenId, amount, "0x");
      await mint(contractInstance, owner, owner, tokenId_1, amount, "0x");
      const tx = contractInstance
        .connect(receiver)
        .safeBatchTransferFrom(owner, erc1155ReceiverInstance, [tokenId, tokenId_1], [amount, amount], "0x");
      await expect(tx)
        .to.be.revertedWithCustomError(contractInstance, "ERC1155MissingApprovalForAll")
        .withArgs(receiver, owner);
    });

    it("should fail: ERC1155InvalidReceiver (NonReceiver)", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      const erc1155NonReceiverInstance = await deployRejector();

      const tokenId_1 = 2n;
      await mint(contractInstance, owner, owner, tokenId, amount, "0x");
      await mint(contractInstance, owner, owner, tokenId_1, amount, "0x");
      const tx = contractInstance.safeBatchTransferFrom(
        owner,
        erc1155NonReceiverInstance,
        [tokenId, tokenId_1],
        [amount, amount],
        "0x",
      );
      await expect(tx)
        .to.be.revertedWithCustomError(contractInstance, "ERC1155InvalidReceiver")
        .withArgs(erc1155NonReceiverInstance);
    });

    it("should fail: ERC1155InvalidReceiver (ZeroAddress)", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner, tokenId, amount, "0x");
      const tx = contractInstance.safeBatchTransferFrom(owner, ZeroAddress, [tokenId], [amount], "0x");
      await expect(tx).to.be.revertedWithCustomError(contractInstance, "ERC1155InvalidReceiver").withArgs(ZeroAddress);
    });
  });
}

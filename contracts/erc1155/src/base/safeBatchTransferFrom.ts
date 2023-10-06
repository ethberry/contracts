import { expect } from "chai";
import { ethers } from "hardhat";
import { ZeroAddress } from "ethers";

import { amount, tokenId } from "@gemunion/contracts-constants";
import { deployJerk, deployWallet } from "@gemunion/contracts-mocks";

import type { IERC1155Options } from "../shared/defaultMint";
import { defaultMintERC1155 } from "../shared/defaultMint";

export function shouldSafeBatchTransferFrom(factory: () => Promise<any>, options: IERC1155Options = {}) {
  const { mint = defaultMintERC1155 } = options;

  describe("safeBatchTransferFrom", function () {
    it("should transfer own tokens to receiver contract", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      const erc1155ReceiverInstance = await deployWallet();
      const address = await erc1155ReceiverInstance.getAddress();

      const tokenId_1 = 2n;
      await mint(contractInstance, owner, owner.address, tokenId, amount, "0x");
      await mint(contractInstance, owner, owner.address, tokenId_1, amount, "0x");
      const tx = contractInstance.safeBatchTransferFrom(
        owner.address,
        address,
        [tokenId, tokenId_1],
        [amount, amount],
        "0x",
      );
      await expect(tx)
        .to.emit(contractInstance, "TransferBatch")
        .withArgs(owner.address, owner.address, address, [tokenId, tokenId_1], [amount, amount]);

      const balanceOfOwner1 = await contractInstance.balanceOf(owner.address, tokenId);
      expect(balanceOfOwner1).to.equal(0);
      const balanceOfOwner2 = await contractInstance.balanceOf(owner.address, tokenId_1);
      expect(balanceOfOwner2).to.equal(0);

      const balanceOfReceiver1 = await contractInstance.balanceOf(address, tokenId);
      expect(balanceOfReceiver1).to.equal(amount);
      const balanceOfReceiver2 = await contractInstance.balanceOf(address, tokenId);
      expect(balanceOfReceiver2).to.equal(amount);
    });

    it("should fail: ERC1155InvalidReceiver (not receiver)", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      const erc1155NonReceiverInstance = await deployJerk();
      const address = await erc1155NonReceiverInstance.getAddress();

      const tokenId_1 = 2n;
      await mint(contractInstance, owner, owner.address, tokenId, amount, "0x");
      await mint(contractInstance, owner, owner.address, tokenId_1, amount, "0x");
      const tx = contractInstance.safeBatchTransferFrom(
        owner.address,
        address,
        [tokenId, tokenId_1],
        [amount, amount],
        "0x",
      );
      await expect(tx).to.be.revertedWithCustomError(contractInstance, "ERC1155InvalidReceiver").withArgs(address);
    });

    it("should fail: ERC1155InvalidReceiver (ZeroAddress)", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address, tokenId, amount, "0x");
      const tx = contractInstance.safeBatchTransferFrom(owner.address, ZeroAddress, [tokenId], [amount], "0x");
      await expect(tx).to.be.revertedWithCustomError(contractInstance, "ERC1155InvalidReceiver").withArgs(ZeroAddress);
    });

    it("should fail: ERC1155MissingApprovalForAll", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const erc1155ReceiverInstance = await deployWallet();
      const address = await erc1155ReceiverInstance.getAddress();

      const tokenId_1 = 2n;
      await mint(contractInstance, owner, owner.address, tokenId, amount, "0x");
      await mint(contractInstance, owner, owner.address, tokenId_1, amount, "0x");
      const tx = contractInstance
        .connect(receiver)
        .safeBatchTransferFrom(owner.address, address, [tokenId, tokenId_1], [amount, amount], "0x");
      await expect(tx)
        .to.be.revertedWithCustomError(contractInstance, "ERC1155MissingApprovalForAll")
        .withArgs(receiver.address, owner.address);
    });

    it("should transfer approved tokens to receiver contract", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const erc1155ReceiverInstance = await deployWallet();
      const address = await erc1155ReceiverInstance.getAddress();

      const tokenId_1 = 2n;
      await mint(contractInstance, owner, owner.address, tokenId, amount, "0x");
      await mint(contractInstance, owner, owner.address, tokenId_1, amount, "0x");
      await contractInstance.setApprovalForAll(receiver.address, true);

      const tx = contractInstance
        .connect(receiver)
        .safeBatchTransferFrom(owner.address, address, [tokenId, tokenId_1], [amount, amount], "0x");
      await expect(tx)
        .to.emit(contractInstance, "TransferBatch")
        .withArgs(receiver.address, owner.address, address, [tokenId, tokenId_1], [amount, amount]);

      const balanceOfOwner1 = await contractInstance.balanceOf(owner.address, tokenId);
      expect(balanceOfOwner1).to.equal(0);
      const balanceOfOwner2 = await contractInstance.balanceOf(owner.address, tokenId_1);
      expect(balanceOfOwner2).to.equal(0);

      const balanceOfReceiver1 = await contractInstance.balanceOf(address, tokenId);
      expect(balanceOfReceiver1).to.equal(amount);
      const balanceOfReceiver2 = await contractInstance.balanceOf(address, tokenId);
      expect(balanceOfReceiver2).to.equal(amount);
    });
  });
}

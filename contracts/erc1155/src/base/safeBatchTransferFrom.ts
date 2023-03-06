import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

import { amount, tokenId } from "@gemunion/contracts-constants";
import { deployJerk, deployWallet } from "@gemunion/contracts-mocks";

export function shouldSafeBatchTransferFrom(factory: () => Promise<Contract>) {
  describe("safeBatchTransferFrom", function () {
    it("should transfer own tokens to receiver contract", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();
      const erc1155ReceiverInstance = await deployWallet();

      const tokenId_1 = 2;
      await contractInstance.mint(owner.address, tokenId, amount, "0x");
      await contractInstance.mint(owner.address, tokenId_1, amount, "0x");
      const tx = contractInstance.safeBatchTransferFrom(
        owner.address,
        erc1155ReceiverInstance.address,
        [tokenId, tokenId_1],
        [amount, amount],
        "0x",
      );
      await expect(tx)
        .to.emit(contractInstance, "TransferBatch")
        .withArgs(
          owner.address,
          owner.address,
          erc1155ReceiverInstance.address,
          [tokenId, tokenId_1],
          [amount, amount],
        );

      const balanceOfOwner1 = await contractInstance.balanceOf(owner.address, tokenId);
      expect(balanceOfOwner1).to.equal(0);
      const balanceOfOwner2 = await contractInstance.balanceOf(owner.address, tokenId_1);
      expect(balanceOfOwner2).to.equal(0);

      const balanceOfReceiver1 = await contractInstance.balanceOf(erc1155ReceiverInstance.address, tokenId);
      expect(balanceOfReceiver1).to.equal(amount);
      const balanceOfReceiver2 = await contractInstance.balanceOf(erc1155ReceiverInstance.address, tokenId);
      expect(balanceOfReceiver2).to.equal(amount);
    });

    it("should fail: transfer to non ERC1155Receiver implementer", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();
      const erc1155NonReceiverInstance = await deployJerk();

      const tokenId_1 = 2;
      await contractInstance.mint(owner.address, tokenId, amount, "0x");
      await contractInstance.mint(owner.address, tokenId_1, amount, "0x");
      const tx = contractInstance.safeBatchTransferFrom(
        owner.address,
        erc1155NonReceiverInstance.address,
        [tokenId, tokenId_1],
        [amount, amount],
        "0x",
      );
      await expect(tx).to.be.revertedWith("ERC1155: transfer to non-ERC1155Receiver implementer");
    });

    it("should fail: not an owner", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();
      const erc1155ReceiverInstance = await deployWallet();

      const tokenId_1 = 2;
      await contractInstance.mint(owner.address, tokenId, amount, "0x");
      await contractInstance.mint(owner.address, tokenId_1, amount, "0x");
      const tx = contractInstance
        .connect(receiver)
        .safeBatchTransferFrom(
          owner.address,
          erc1155ReceiverInstance.address,
          [tokenId, tokenId_1],
          [amount, amount],
          "0x",
        );
      await expect(tx).to.be.revertedWith("ERC1155: caller is not token owner or approved");
    });

    it("should transfer approved tokens to receiver contract", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();
      const erc1155ReceiverInstance = await deployWallet();

      const tokenId_1 = 2;
      await contractInstance.mint(owner.address, tokenId, amount, "0x");
      await contractInstance.mint(owner.address, tokenId_1, amount, "0x");
      await contractInstance.setApprovalForAll(receiver.address, true);

      const tx = contractInstance
        .connect(receiver)
        .safeBatchTransferFrom(
          owner.address,
          erc1155ReceiverInstance.address,
          [tokenId, tokenId_1],
          [amount, amount],
          "0x",
        );
      await expect(tx)
        .to.emit(contractInstance, "TransferBatch")
        .withArgs(
          receiver.address,
          owner.address,
          erc1155ReceiverInstance.address,
          [tokenId, tokenId_1],
          [amount, amount],
        );

      const balanceOfOwner1 = await contractInstance.balanceOf(owner.address, tokenId);
      expect(balanceOfOwner1).to.equal(0);
      const balanceOfOwner2 = await contractInstance.balanceOf(owner.address, tokenId_1);
      expect(balanceOfOwner2).to.equal(0);

      const balanceOfReceiver1 = await contractInstance.balanceOf(erc1155ReceiverInstance.address, tokenId);
      expect(balanceOfReceiver1).to.equal(amount);
      const balanceOfReceiver2 = await contractInstance.balanceOf(erc1155ReceiverInstance.address, tokenId);
      expect(balanceOfReceiver2).to.equal(amount);
    });
  });
}

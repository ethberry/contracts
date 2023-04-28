import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

import { amount, tokenId } from "@gemunion/contracts-constants";
import { deployJerk, deployWallet } from "@gemunion/contracts-mocks";

import type { IERC1155Options } from "../shared/defaultMint";
import { defaultMintERC1155 } from "../shared/defaultMint";

export function shouldSafeTransferFrom(factory: () => Promise<Contract>, options: IERC1155Options = {}) {
  const { mint = defaultMintERC1155 } = options;

  describe("safeTransferFrom", function () {
    it("should fail: not an owner", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();
      await mint(contractInstance, owner, owner.address, tokenId, amount, "0x");
      const tx = contractInstance
        .connect(receiver)
        .safeTransferFrom(owner.address, receiver.address, tokenId, amount, "0x");
      await expect(tx).to.be.revertedWith("ERC1155: caller is not token owner or approved");
    });

    it("should transfer own tokens to receiver contract", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();
      const erc1155ReceiverInstance = await deployWallet();
      await mint(contractInstance, owner, owner.address, tokenId, amount, "0x");
      const tx = contractInstance.safeTransferFrom(
        owner.address,
        erc1155ReceiverInstance.address,
        tokenId,
        amount,
        "0x",
      );
      await expect(tx)
        .to.emit(contractInstance, "TransferSingle")
        .withArgs(owner.address, owner.address, erc1155ReceiverInstance.address, tokenId, amount);

      const balanceOfOwner = await contractInstance.balanceOf(owner.address, tokenId);
      expect(balanceOfOwner).to.equal(0);

      const balanceOfReceiver = await contractInstance.balanceOf(erc1155ReceiverInstance.address, tokenId);
      expect(balanceOfReceiver).to.equal(amount);
    });

    it("should fail: transfer to non ERC1155Receiver implementer", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();
      const erc1155NonReceiverInstance = await deployJerk();

      await mint(contractInstance, owner, owner.address, tokenId, amount, "0x");
      const tx = contractInstance.safeTransferFrom(
        owner.address,
        erc1155NonReceiverInstance.address,
        tokenId,
        amount,
        "0x",
      );
      await expect(tx).to.be.revertedWith("ERC1155: transfer to non-ERC1155Receiver implementer");
    });

    it("should transfer approved tokens to receiver contract", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();
      const erc1155ReceiverInstance = await deployWallet();

      await mint(contractInstance, owner, owner.address, tokenId, amount, "0x");
      await contractInstance.setApprovalForAll(receiver.address, true);
      const checkApprove = await contractInstance.isApprovedForAll(owner.address, receiver.address);
      expect(checkApprove).to.equal(true);
      await contractInstance.setApprovalForAll(receiver.address, true);

      const tx = contractInstance
        .connect(receiver)
        .safeTransferFrom(owner.address, erc1155ReceiverInstance.address, tokenId, amount, "0x");
      await expect(tx)
        .to.emit(contractInstance, "TransferSingle")
        .withArgs(receiver.address, owner.address, erc1155ReceiverInstance.address, tokenId, amount);

      const balanceOfOwner = await contractInstance.balanceOf(owner.address, tokenId);
      expect(balanceOfOwner).to.equal(0);

      const balanceOfReceiver = await contractInstance.balanceOf(erc1155ReceiverInstance.address, tokenId);
      expect(balanceOfReceiver).to.equal(amount);
    });
  });
}

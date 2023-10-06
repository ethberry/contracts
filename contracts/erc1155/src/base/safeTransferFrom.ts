import { expect } from "chai";
import { ethers } from "hardhat";
import { ZeroAddress } from "ethers";

import { amount, tokenId } from "@gemunion/contracts-constants";
import { deployJerk, deployWallet } from "@gemunion/contracts-mocks";

import type { IERC1155Options } from "../shared/defaultMint";
import { defaultMintERC1155 } from "../shared/defaultMint";

export function shouldSafeTransferFrom(factory: () => Promise<any>, options: IERC1155Options = {}) {
  const { mint = defaultMintERC1155 } = options;

  describe("safeTransferFrom", function () {
    it("should transfer own tokens to receiver contract", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      const erc1155ReceiverInstance = await deployWallet();
      const address = await erc1155ReceiverInstance.getAddress();

      await mint(contractInstance, owner, owner.address, tokenId, amount, "0x");
      const tx = contractInstance.safeTransferFrom(owner.address, address, tokenId, amount, "0x");
      await expect(tx)
        .to.emit(contractInstance, "TransferSingle")
        .withArgs(owner.address, owner.address, address, tokenId, amount);

      const balanceOfOwner = await contractInstance.balanceOf(owner.address, tokenId);
      expect(balanceOfOwner).to.equal(0);

      const balanceOfReceiver = await contractInstance.balanceOf(address, tokenId);
      expect(balanceOfReceiver).to.equal(amount);
    });

    it("should transfer approved tokens to receiver contract", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const erc1155ReceiverInstance = await deployWallet();
      const address = await erc1155ReceiverInstance.getAddress();

      await mint(contractInstance, owner, owner.address, tokenId, amount, "0x");
      await contractInstance.setApprovalForAll(receiver.address, true);
      const checkApprove = await contractInstance.isApprovedForAll(owner.address, receiver.address);
      expect(checkApprove).to.equal(true);
      await contractInstance.setApprovalForAll(receiver.address, true);

      const tx = contractInstance.connect(receiver).safeTransferFrom(owner.address, address, tokenId, amount, "0x");
      await expect(tx)
        .to.emit(contractInstance, "TransferSingle")
        .withArgs(receiver.address, owner.address, address, tokenId, amount);

      const balanceOfOwner = await contractInstance.balanceOf(owner.address, tokenId);
      expect(balanceOfOwner).to.equal(0);

      const balanceOfReceiver = await contractInstance.balanceOf(address, tokenId);
      expect(balanceOfReceiver).to.equal(amount);
    });

    it("should fail: ERC1155MissingApprovalForAll", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();
      await mint(contractInstance, owner, owner.address, tokenId, amount, "0x");
      const tx = contractInstance
        .connect(receiver)
        .safeTransferFrom(owner.address, receiver.address, tokenId, amount, "0x");

      await expect(tx)
        .to.be.revertedWithCustomError(contractInstance, "ERC1155MissingApprovalForAll")
        .withArgs(receiver.address, owner.address);
    });

    it("should fail: ERC1155InvalidReceiver (NonReceiver)", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      const erc1155NonReceiverInstance = await deployJerk();
      const address = await erc1155NonReceiverInstance.getAddress();

      await mint(contractInstance, owner, owner.address, tokenId, amount, "0x");
      const tx = contractInstance.safeTransferFrom(owner.address, address, tokenId, amount, "0x");
      await expect(tx).to.be.revertedWithCustomError(contractInstance, "ERC1155InvalidReceiver").withArgs(address);
    });

    it("should fail: ERC1155InvalidReceiver (ZeroAddress)", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address, tokenId, amount, "0x");
      const tx = contractInstance.safeTransferFrom(owner.address, ZeroAddress, tokenId, amount, "0x");
      await expect(tx).to.be.revertedWithCustomError(contractInstance, "ERC1155InvalidReceiver").withArgs(ZeroAddress);
    });
  });
}

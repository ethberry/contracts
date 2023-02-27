import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

import { amount, tokenId } from "@gemunion/contracts-constants";
import { deployErc1155NonReceiver, deployErc1155Receiver } from "@gemunion/contracts-mocks";

export function shouldSafeTransferFrom(factory: () => Promise<Contract>) {
  describe("safeTransferFrom", function () {
    it("should fail: not an owner", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();
      await contractInstance.mint(owner.address, tokenId, amount, "0x");
      const tx = contractInstance
        .connect(receiver)
        .safeTransferFrom(owner.address, receiver.address, tokenId, amount, "0x");
      await expect(tx).to.be.revertedWith("ERC1155: caller is not token owner or approved");
    });

    it("should transfer own tokens to receiver contract", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();
      const erc1155ReceiverInstance = await deployErc1155Receiver();
      await contractInstance.mint(owner.address, tokenId, amount, "0x");
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
      const erc1155NonReceiverInstance = await deployErc1155NonReceiver();

      await contractInstance.mint(owner.address, tokenId, amount, "0x");
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
      const erc1155ReceiverInstance = await deployErc1155Receiver();

      await contractInstance.mint(owner.address, tokenId, amount, "0x");
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

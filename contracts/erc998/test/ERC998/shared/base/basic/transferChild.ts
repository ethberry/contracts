import { expect } from "chai";
import { ethers } from "hardhat";

import { whiteListChildInterfaceId } from "@gemunion/contracts-test-constants";

import { deployErc998Base, deployErc721NonReceiver, deployErc721Receiver } from "../../../../ERC721/shared/fixtures";

export function shouldTransferChild(name: string) {
  describe("transferChild", function () {
    it("should transfer token owned by another token to wallet", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const { contractInstance: erc721Instance } = await deployErc998Base(name);
      const { contractInstance: erc721InstanceMock } = await deployErc998Base("ERC721ABCE");

      const supportsWhiteListChild = await erc721Instance.supportsInterface(whiteListChildInterfaceId);
      if (supportsWhiteListChild) {
        await erc721Instance.whiteListChild(erc721InstanceMock.address, 0);
      }

      await erc721InstanceMock.mint(owner.address);
      await erc721Instance.mint(owner.address); // this is edge case
      await erc721Instance.mint(owner.address);

      const tx1 = erc721InstanceMock["safeTransferFrom(address,address,uint256,bytes)"](
        owner.address,
        erc721Instance.address,
        0, // erc721 tokenId
        "0x0000000000000000000000000000000000000000000000000000000000000001", // erc998 tokenId
      );
      await expect(tx1).to.not.be.reverted;

      const tx2 = erc721Instance.transferChild(1, receiver.address, erc721InstanceMock.address, 0);
      await expect(tx2)
        .to.emit(erc721Instance, "TransferChild")
        .withArgs(1, receiver.address, erc721InstanceMock.address, 0, 1);
    });

    it("should transfer token owned by another token to the receiver contract", async function () {
      const [owner] = await ethers.getSigners();
      const { contractInstance: erc721Instance } = await deployErc998Base(name);
      const { contractInstance: erc721InstanceMock } = await deployErc998Base("ERC721ABCE");
      const { contractInstance: erc721ReceiverInstance } = await deployErc721Receiver();

      const supportsWhiteListChild = await erc721Instance.supportsInterface(whiteListChildInterfaceId);
      if (supportsWhiteListChild) {
        await erc721Instance.whiteListChild(erc721InstanceMock.address, 0);
      }

      await erc721InstanceMock.mint(owner.address);
      await erc721Instance.mint(owner.address); // this is edge case
      await erc721Instance.mint(owner.address);

      const tx1 = erc721InstanceMock["safeTransferFrom(address,address,uint256,bytes)"](
        owner.address,
        erc721Instance.address,
        0, // erc721 tokenId
        "0x0000000000000000000000000000000000000000000000000000000000000001", // erc998 tokenId
      );
      await expect(tx1).to.not.be.reverted;

      const tx2 = erc721Instance.transferChild(1, erc721ReceiverInstance.address, erc721InstanceMock.address, 0);
      await expect(tx2)
        .to.emit(erc721Instance, "TransferChild")
        .withArgs(1, erc721ReceiverInstance.address, erc721InstanceMock.address, 0, 1);
    });

    it("should transfer token owned by another token to the non receiver contract", async function () {
      const [owner] = await ethers.getSigners();
      const { contractInstance: erc721Instance } = await deployErc998Base(name);
      const { contractInstance: erc721InstanceMock } = await deployErc998Base("ERC721ABCE");
      const { contractInstance: erc721NonReceiverInstance } = await deployErc721NonReceiver();

      const supportsWhiteListChild = await erc721Instance.supportsInterface(whiteListChildInterfaceId);
      if (supportsWhiteListChild) {
        await erc721Instance.whiteListChild(erc721InstanceMock.address, 0);
      }

      await erc721InstanceMock.mint(owner.address);
      await erc721Instance.mint(owner.address); // this is edge case
      await erc721Instance.mint(owner.address);

      const tx1 = erc721InstanceMock["safeTransferFrom(address,address,uint256,bytes)"](
        owner.address,
        erc721Instance.address,
        0, // erc721 tokenId
        "0x0000000000000000000000000000000000000000000000000000000000000001", // erc998 tokenId
      );
      await expect(tx1).to.not.be.reverted;

      const tx2 = erc721Instance.transferChild(1, erc721NonReceiverInstance.address, erc721InstanceMock.address, 0);
      await expect(tx2)
        .to.emit(erc721Instance, "TransferChild")
        .withArgs(1, erc721NonReceiverInstance.address, erc721InstanceMock.address, 0, 1);
    });

    it("should not transfer token which is not owned", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const { contractInstance: erc721Instance } = await deployErc998Base(name);
      const { contractInstance: erc721InstanceMock } = await deployErc998Base("ERC721ABCE");

      const supportsWhiteListChild = await erc721Instance.supportsInterface(whiteListChildInterfaceId);
      if (supportsWhiteListChild) {
        await erc721Instance.whiteListChild(erc721InstanceMock.address, 0);
      }

      await erc721InstanceMock.mint(owner.address);
      await erc721Instance.mint(owner.address); // this is edge case
      await erc721Instance.mint(owner.address);

      const tx = erc721Instance.transferChild(1, receiver.address, erc721InstanceMock.address, 0);

      await expect(tx).to.be.revertedWith(`CTD: _transferChild _childContract _childTokenId not found`);
    });

    it("should transfer 998 token owned by another token to the wallet", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const { contractInstance: erc721Instance } = await deployErc998Base(name);

      const supportsWhiteListChild = await erc721Instance.supportsInterface(whiteListChildInterfaceId);
      if (supportsWhiteListChild) {
        await erc721Instance.whiteListChild(erc721Instance.address, 0);
      }

      await erc721Instance.mint(owner.address); // this is edge case
      await erc721Instance.mint(owner.address);
      await erc721Instance.mint(owner.address);

      const tx1 = erc721Instance["safeTransferFrom(address,address,uint256,bytes)"](
        owner.address,
        erc721Instance.address,
        1, // erc998 tokenId
        "0x0000000000000000000000000000000000000000000000000000000000000002", // erc998 tokenId
      );
      await expect(tx1).to.not.be.reverted;

      const tx2 = erc721Instance.transferChild(2, receiver.address, erc721Instance.address, 1);
      await expect(tx2)
        .to.emit(erc721Instance, "TransferChild")
        .withArgs(2, receiver.address, erc721Instance.address, 1, 1);
    });
  });
}

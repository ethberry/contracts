import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

import { whiteListChildInterfaceId } from "@gemunion/contracts-constants";

import { deployErc721NonReceiver, deployErc721Receiver } from "@gemunion/contracts-mocks";

import { deployErc998Base } from "../../fixtures";

export function shouldSafeTransferChild(factory: () => Promise<Contract>) {
  describe("safeTransferChild", function () {
    it("should transfer token owned by another token to the wallet", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const erc721Instance = await factory();
      const erc721InstanceMock = await deployErc998Base("ERC721ABCE");

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

      const tx2 = erc721Instance["safeTransferChild(uint256,address,address,uint256)"](
        1,
        receiver.address,
        erc721InstanceMock.address,
        0,
      );
      await expect(tx2)
        .to.emit(erc721Instance, "TransferChild")
        .withArgs(1, receiver.address, erc721InstanceMock.address, 0, 1);
    });

    it("should transfer token owned by another token to the receiver contract", async function () {
      const [owner] = await ethers.getSigners();
      const erc721Instance = await factory();
      const erc721InstanceMock = await deployErc998Base("ERC721ABCE");
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

      const tx2 = erc721Instance["safeTransferChild(uint256,address,address,uint256)"](
        1,
        erc721ReceiverInstance.address,
        erc721InstanceMock.address,
        0,
      );
      await expect(tx2)
        .to.emit(erc721Instance, "TransferChild")
        .withArgs(1, erc721ReceiverInstance.address, erc721InstanceMock.address, 0, 1);
    });

    it("should non transfer token owned by another token to the non receiver contract", async function () {
      const [owner] = await ethers.getSigners();
      const erc721Instance = await factory();
      const erc721InstanceMock = await deployErc998Base("ERC721ABCE");
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

      const tx2 = erc721Instance["safeTransferChild(uint256,address,address,uint256)"](
        1,
        erc721NonReceiverInstance.address,
        erc721InstanceMock.address,
        0,
      );
      await expect(tx2).to.be.revertedWith(`ERC721: transfer to non ERC721Receiver implementer`);
    });

    it("should not transfer token which is not owned", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const erc721Instance = await factory();
      const erc721InstanceMock = await deployErc998Base("ERC721ABCE");

      await erc721InstanceMock.mint(owner.address);
      await erc721Instance.mint(owner.address); // this is edge case
      await erc721Instance.mint(owner.address);

      const tx = erc721Instance["safeTransferChild(uint256,address,address,uint256)"](
        1,
        receiver.address,
        erc721InstanceMock.address,
        0,
      );

      await expect(tx).to.be.revertedWith(`CTD: _transferChild _childContract _childTokenId not found`);
    });

    it("should transfer 998 token owned by another token to the wallet", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const erc721Instance = await factory();

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

      const tx2 = erc721Instance["safeTransferChild(uint256,address,address,uint256)"](
        2,
        receiver.address,
        erc721Instance.address,
        1,
      );
      await expect(tx2)
        .to.emit(erc721Instance, "TransferChild")
        .withArgs(2, receiver.address, erc721Instance.address, 1, 1);
    });
  });
}

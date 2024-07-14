import { expect } from "chai";
import { ethers } from "hardhat";
import { ZeroAddress } from "ethers";

import type { IERC721EnumOptions } from "../shared/defaultMint";
import { defaultMintERC721 } from "../shared/defaultMint";
import { deployHolder } from "@gemunion/contracts-finance";

export function shouldTransferFrom(factory: () => Promise<any>, options: IERC721EnumOptions = {}) {
  const { mint = defaultMintERC721, tokenId: defaultTokenId = 0n } = options;

  describe("transferFrom", function () {
    it("should transfer own tokens to EOA", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner);
      const tx = contractInstance.transferFrom(owner, receiver, defaultTokenId);

      await expect(tx).to.emit(contractInstance, "Transfer").withArgs(owner.address, receiver.address, defaultTokenId);

      const balanceOfOwner = await contractInstance.balanceOf(owner);
      expect(balanceOfOwner).to.equal(0);

      const balanceOfReceiver = await contractInstance.balanceOf(receiver);
      expect(balanceOfReceiver).to.equal(1);
    });

    it("should transfer approved tokens to EOA", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner);
      await contractInstance.approve(receiver, defaultTokenId);

      const tx = contractInstance.connect(receiver).transferFrom(owner, receiver, defaultTokenId);

      await expect(tx).to.emit(contractInstance, "Transfer").withArgs(owner.address, receiver.address, defaultTokenId);

      const balanceOfOwner = await contractInstance.balanceOf(owner);
      expect(balanceOfOwner).to.equal(0);

      const balanceOfReceiver = await contractInstance.balanceOf(receiver);
      expect(balanceOfReceiver).to.equal(1);
    });

    it("should transfer own tokens to receiver contract", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      const erc721ReceiverInstance = await deployHolder();

      await mint(contractInstance, owner, owner);
      const tx = contractInstance.transferFrom(owner, erc721ReceiverInstance, defaultTokenId);

      await expect(tx)
        .to.emit(contractInstance, "Transfer")
        .withArgs(owner.address, await erc721ReceiverInstance.getAddress(), defaultTokenId);

      const balanceOfOwner = await contractInstance.balanceOf(owner);
      expect(balanceOfOwner).to.equal(0);

      const balanceOfReceiver = await contractInstance.balanceOf(erc721ReceiverInstance);
      expect(balanceOfReceiver).to.equal(1);
    });

    it("should transfer approved tokens to receiver contract", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const erc721ReceiverInstance = await deployHolder();

      await mint(contractInstance, owner, owner);
      await contractInstance.approve(receiver, defaultTokenId);

      const tx = contractInstance.connect(receiver).transferFrom(owner, erc721ReceiverInstance, defaultTokenId);

      await expect(tx)
        .to.emit(contractInstance, "Transfer")
        .withArgs(owner.address, await erc721ReceiverInstance.getAddress(), defaultTokenId);

      const balanceOfOwner = await contractInstance.balanceOf(owner);
      expect(balanceOfOwner).to.equal(0);

      const balanceOfReceiver = await contractInstance.balanceOf(erc721ReceiverInstance);
      expect(balanceOfReceiver).to.equal(1);
    });

    it("should fail: ERC721InsufficientApproval (NonReceiver)", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner);
      const tx = contractInstance.connect(receiver).transferFrom(owner, receiver, defaultTokenId);

      await expect(tx)
        .to.be.revertedWithCustomError(contractInstance, "ERC721InsufficientApproval")
        .withArgs(receiver.address, defaultTokenId);
    });

    it("should fail: ERC721InvalidReceiver (ZeroAddress)", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner);
      const tx = contractInstance.transferFrom(owner, ZeroAddress, defaultTokenId);

      await expect(tx).to.be.revertedWithCustomError(contractInstance, "ERC721InvalidReceiver").withArgs(ZeroAddress);
    });
  });
}

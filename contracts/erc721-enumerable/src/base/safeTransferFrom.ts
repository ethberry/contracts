import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

import { deployJerk, deployWallet } from "@gemunion/contracts-mocks";

import type { IERC721EnumOptions } from "../shared/defaultMint";
import { defaultMintERC721 } from "../shared/defaultMint";

export function shouldSafeTransferFrom(factory: () => Promise<Contract>, options: IERC721EnumOptions = {}) {
  const { mint = defaultMintERC721 } = options;

  describe("safeTransferFrom", function () {
    it("should fail: not an owner", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address);
      const tx = contractInstance
        .connect(receiver)
        ["safeTransferFrom(address,address,uint256)"](owner.address, receiver.address, 0);

      await expect(tx).to.be.revertedWith(`ERC721: caller is not token owner or approved`);
    });

    it("should transfer own tokens to receiver contract", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      const erc721ReceiverInstance = await deployWallet();

      await mint(contractInstance, owner, owner.address);
      const tx = contractInstance["safeTransferFrom(address,address,uint256)"](
        owner.address,
        erc721ReceiverInstance.address,
        0,
      );

      await expect(tx).to.emit(contractInstance, "Transfer").withArgs(owner.address, erc721ReceiverInstance.address, 0);

      const balanceOfOwner = await contractInstance.balanceOf(owner.address);
      expect(balanceOfOwner).to.equal(0);

      const balanceOfReceiver = await contractInstance.balanceOf(erc721ReceiverInstance.address);
      expect(balanceOfReceiver).to.equal(1);
    });

    it("should transfer own tokens to non receiver contract", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();
      const erc721NonReceiverInstance = await deployJerk();

      await mint(contractInstance, owner, owner.address);
      const tx = contractInstance["safeTransferFrom(address,address,uint256)"](
        owner.address,
        erc721NonReceiverInstance.address,
        0,
      );
      await expect(tx).to.be.revertedWith(`ERC721: transfer to non ERC721Receiver implementer`);
    });

    it("should transfer approved tokens to receiver contract", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const erc721ReceiverInstance = await deployWallet();

      await mint(contractInstance, owner, owner.address);
      await contractInstance.approve(receiver.address, 0);

      const tx = contractInstance
        .connect(receiver)
        ["safeTransferFrom(address,address,uint256)"](owner.address, erc721ReceiverInstance.address, 0);

      await expect(tx).to.emit(contractInstance, "Transfer").withArgs(owner.address, erc721ReceiverInstance.address, 0);

      const balanceOfOwner = await contractInstance.balanceOf(owner.address);
      expect(balanceOfOwner).to.equal(0);

      const balanceOfReceiver = await contractInstance.balanceOf(erc721ReceiverInstance.address);
      expect(balanceOfReceiver).to.equal(1);
    });

    it("should transfer approved tokens to non receiver contract", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const erc721NonReceiverInstance = await deployJerk();

      await mint(contractInstance, owner, owner.address);
      await contractInstance.approve(receiver.address, 0);

      const tx = contractInstance
        .connect(receiver)
        ["safeTransferFrom(address,address,uint256)"](owner.address, erc721NonReceiverInstance.address, 0);
      await expect(tx).to.be.revertedWith(`ERC721: transfer to non ERC721Receiver implementer`);
    });
  });
}

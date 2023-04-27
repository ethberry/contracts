import { expect } from "chai";
import { ethers } from "hardhat";
import { constants, Contract } from "ethers";
import { TMintERC721EnumFn } from "../shared/interfaces/IMintERC721Fn";
import { defaultMintERC721Enum } from "../shared/defaultMintERC721";

export function shouldTransferFrom(factory: () => Promise<Contract>, mint: TMintERC721EnumFn = defaultMintERC721Enum) {
  describe("transferFrom", function () {
    it("should fail: not an owner", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address);
      const tx = contractInstance.connect(receiver).transferFrom(owner.address, receiver.address, 0);

      await expect(tx).to.be.revertedWith(`ERC721: caller is not token owner or approved`);
    });

    it("should fail: zero addr", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address);
      const tx = contractInstance.transferFrom(owner.address, constants.AddressZero, 0);

      await expect(tx).to.be.revertedWith(`ERC721: transfer to the zero address`);
    });

    it("should transfer own tokens to wallet", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address);
      const tx = contractInstance.transferFrom(owner.address, receiver.address, 0);

      await expect(tx).to.emit(contractInstance, "Transfer").withArgs(owner.address, receiver.address, 0);

      const balanceOfOwner = await contractInstance.balanceOf(owner.address);
      expect(balanceOfOwner).to.equal(0);

      const balanceOfReceiver = await contractInstance.balanceOf(receiver.address);
      expect(balanceOfReceiver).to.equal(1);
    });

    it("should transfer approved tokens to wallet", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address);
      await contractInstance.approve(receiver.address, 0);

      const tx = contractInstance.connect(receiver).transferFrom(owner.address, receiver.address, 0);

      await expect(tx).to.emit(contractInstance, "Transfer").withArgs(owner.address, receiver.address, 0);

      const balanceOfOwner = await contractInstance.balanceOf(owner.address);
      expect(balanceOfOwner).to.equal(0);

      const balanceOfReceiver = await contractInstance.balanceOf(receiver.address);
      expect(balanceOfReceiver).to.equal(1);
    });
  });
}

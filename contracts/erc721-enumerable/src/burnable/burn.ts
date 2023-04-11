import { expect } from "chai";
import { ethers } from "hardhat";
import { constants, Contract } from "ethers";

export function shouldBehaveLikeERC721Burnable(factory: () => Promise<Contract>) {
  describe("burn", function () {
    it("should fail: not an owner", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await contractInstance.mint(owner.address);
      const tx = contractInstance.connect(receiver).burn(0);

      await expect(tx).to.be.revertedWith(`ERC721: caller is not token owner or approved`);
    });

    it("should burn own token", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      await contractInstance.mint(owner.address);
      const tx = await contractInstance.burn(0);

      await expect(tx).to.emit(contractInstance, "Transfer").withArgs(owner.address, constants.AddressZero, 0);

      const balanceOfOwner = await contractInstance.balanceOf(owner.address);
      expect(balanceOfOwner).to.equal(0);
    });

    it("should burn approved token", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await contractInstance.mint(owner.address);
      await contractInstance.approve(receiver.address, 0);

      const tx = await contractInstance.burn(0);

      await expect(tx).to.emit(contractInstance, "Transfer").withArgs(owner.address, constants.AddressZero, 0);

      const balanceOfOwner = await contractInstance.balanceOf(owner.address);
      expect(balanceOfOwner).to.equal(0);
    });
  });
}

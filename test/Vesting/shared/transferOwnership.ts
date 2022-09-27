import { expect } from "chai";
import { ethers } from "hardhat";
import { deployVestingFixture } from "./fixture";

export function shouldTransferOwnership(name: string) {
  describe("transferOwnership", function () {
    it("Should transfer ownership", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const { contractInstance } = await deployVestingFixture(name);

      const tx = contractInstance.connect(receiver).transferOwnership(owner.address);
      await expect(tx).to.emit(contractInstance, "OwnershipTransferred").withArgs(receiver.address, owner.address);
    });

    it("Should fail: not an owner", async function () {
      const [_, receiver] = await ethers.getSigners();
      const { contractInstance } = await deployVestingFixture(name);

      const tx = contractInstance.transferOwnership(receiver.address);
      await expect(tx).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should fail: transfer to zero addr", async function () {
      const [_, receiver] = await ethers.getSigners();
      const { contractInstance } = await deployVestingFixture(name);

      const tx = contractInstance.connect(receiver).transferOwnership(ethers.constants.AddressZero);
      await expect(tx).to.be.revertedWith("Ownable: new owner is the zero address");
    });
  });
}

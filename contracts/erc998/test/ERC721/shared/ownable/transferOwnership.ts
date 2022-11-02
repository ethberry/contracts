import { expect } from "chai";
import { ethers } from "hardhat";

import { deployErc998Base } from "../fixtures";

export function shouldTransferOwnership(name: string) {
  describe("transferOwnership", function () {
    it("Should transfer ownership", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const { contractInstance } = await deployErc998Base(name);

      const tx = contractInstance.transferOwnership(receiver.address);
      await expect(tx).to.emit(contractInstance, "OwnershipTransferred").withArgs(owner.address, receiver.address);
    });

    it("Should fail: not an owner", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const { contractInstance } = await deployErc998Base(name);

      const tx = contractInstance.connect(receiver).transferOwnership(receiver.address);
      await expect(tx).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should fail: transfer to zero addr", async function () {
      const { contractInstance } = await deployErc998Base(name);

      const tx = contractInstance.transferOwnership(ethers.constants.AddressZero);
      await expect(tx).to.be.revertedWith("Ownable: new owner is the zero address");
    });
  });
}
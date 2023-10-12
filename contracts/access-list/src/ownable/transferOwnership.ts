import { expect } from "chai";
import { ethers } from "hardhat";
import { ZeroAddress } from "ethers";

export function shouldTransferOwnership(factory: () => Promise<any>) {
  describe("transferOwnership", function () {
    it("should transfer ownership", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx = contractInstance.transferOwnership(receiver);
      await expect(tx).to.emit(contractInstance, "OwnershipTransferred").withArgs(owner.address, receiver.address);
    });

    it("should fail: OwnableUnauthorizedAccount", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx = contractInstance.connect(receiver).transferOwnership(receiver);
      await expect(tx)
        .to.be.revertedWithCustomError(contractInstance, "OwnableUnauthorizedAccount")
        .withArgs(receiver.address);
    });

    it("should fail: OwnableInvalidOwner", async function () {
      const contractInstance = await factory();

      const tx = contractInstance.transferOwnership(ZeroAddress);

      await expect(tx).to.be.revertedWithCustomError(contractInstance, "OwnableInvalidOwner").withArgs(ZeroAddress);
    });
  });
}

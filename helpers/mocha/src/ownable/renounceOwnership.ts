import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

export function shouldRenounceOwnership(factory: () => Promise<Contract>) {
  describe("renounceOwnership", function () {
    it("Should renounce ownership", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx = contractInstance.renounceOwnership();
      await expect(tx)
        .to.emit(contractInstance, "OwnershipTransferred")
        .withArgs(owner.address, ethers.constants.AddressZero);
    });

    it("Should fail: not an owner", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx = contractInstance.connect(receiver).renounceOwnership();
      await expect(tx).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
}

import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

import { amount, InterfaceId, MINTER_ROLE } from "@gemunion/contracts-constants";

export function shouldMint(factory: () => Promise<Contract>, options: Record<string, any>) {
  describe("mint", function () {
    it("should fail: account is missing role", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const supportsAccessControl = await contractInstance.supportsInterface(InterfaceId.IAccessControl);

      const tx = contractInstance.connect(receiver).mint(receiver.address, amount);
      await expect(tx).to.be.revertedWith(
        supportsAccessControl
          ? `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${
              options.MINTER_ROLE || MINTER_ROLE
            }`
          : "Ownable: caller is not the owner",
      );
    });

    it("should mint", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx = contractInstance.mint(owner.address, amount);
      await expect(tx)
        .to.emit(contractInstance, "Transfer")
        .withArgs(ethers.constants.AddressZero, owner.address, amount);

      const balance = await contractInstance.balanceOf(owner.address);
      expect(balance).to.equal(amount);

      const totalSupply = await contractInstance.totalSupply();
      expect(totalSupply).to.equal(amount);
    });
  });
}

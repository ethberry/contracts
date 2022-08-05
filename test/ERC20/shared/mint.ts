import { expect } from "chai";
import { ethers } from "hardhat";

import { accessControlInterfaceId, amount, MINTER_ROLE } from "../../constants";

export function shouldMint() {
  describe("mint", function () {
    it("should fail: account is missing role", async function () {
      const supportsAccessControl = await this.contractInstance.supportsInterface(accessControlInterfaceId);

      const tx = this.erc20Instance.connect(this.receiver).mint(this.receiver.address, amount);
      await expect(tx).to.be.revertedWith(
        supportsAccessControl
          ? `AccessControl: account ${this.receiver.address.toLowerCase()} is missing role ${MINTER_ROLE}`
          : "Ownable: caller is not the owner",
      );
    });

    it("should mint", async function () {
      const tx = this.erc20Instance.mint(this.owner.address, amount);
      await expect(tx)
        .to.emit(this.erc20Instance, "Transfer")
        .withArgs(ethers.constants.AddressZero, this.owner.address, amount);

      const balance = await this.erc20Instance.balanceOf(this.owner.address);
      expect(balance).to.equal(amount);

      const totalSupply = await this.erc20Instance.totalSupply();
      expect(totalSupply).to.equal(amount);
    });
  });
}

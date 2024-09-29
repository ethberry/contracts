import { expect } from "chai";
import { ethers } from "hardhat";
import { ZeroAddress } from "ethers";

import { amount, InterfaceId, MINTER_ROLE } from "@ethberry/contracts-constants";

import type { IERC20Options } from "../shared/defaultMint";
import { defaultMintERC20 } from "../shared/defaultMint";

export function shouldMint(factory: () => Promise<any>, options: IERC20Options = {}) {
  const { mint = defaultMintERC20, minterRole = MINTER_ROLE } = options;

  describe("mint", function () {
    it("should mint", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx = mint(contractInstance, owner, owner);
      await expect(tx).to.emit(contractInstance, "Transfer").withArgs(ZeroAddress, owner, amount);

      const balance = await contractInstance.balanceOf(owner);
      expect(balance).to.equal(amount);

      const totalSupply = await contractInstance.totalSupply();
      expect(totalSupply).to.equal(amount);
    });

    it("should fail: AccessControlUnauthorizedAccount/OwnableUnauthorizedAccount", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const supportsAccessControl = await contractInstance.supportsInterface(InterfaceId.IAccessControl);

      const tx = mint(contractInstance, receiver, receiver);

      if (supportsAccessControl) {
        await expect(tx)
          .to.be.revertedWithCustomError(contractInstance, "AccessControlUnauthorizedAccount")
          .withArgs(receiver, minterRole);
      } else {
        // Ownable
        await expect(tx)
          .to.be.revertedWithCustomError(contractInstance, "OwnableUnauthorizedAccount")
          .withArgs(receiver);
      }
    });
  });
}

import { expect } from "chai";
import { ethers } from "hardhat";
import { constants, Contract } from "ethers";

import { amount, InterfaceId } from "@gemunion/contracts-constants";
import { TMintERC20Fn } from "../shared/interfaces/IERC20MintFn";

export function shouldMint(factory: () => Promise<Contract>, mint: TMintERC20Fn, options: Record<string, any> = {}) {
  describe("mint", function () {
    it("should fail: account is missing role", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const supportsAccessControl = await contractInstance.supportsInterface(InterfaceId.IAccessControl);

      const tx = mint(contractInstance, receiver, receiver.address);

      await expect(tx).to.be.revertedWith(
        supportsAccessControl
          ? `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${options.minterRole}`
          : "Ownable: caller is not the owner",
      );
    });

    it("should mint", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx = mint(contractInstance, owner, owner.address);
      // const tx = contractInstance.mintERC20(owner.address, amount);
      await expect(tx).to.emit(contractInstance, "Transfer").withArgs(constants.AddressZero, owner.address, amount);

      const balance = await contractInstance.balanceOf(owner.address);
      expect(balance).to.equal(amount);

      const totalSupply = await contractInstance.totalSupply();
      expect(totalSupply).to.equal(amount);
    });
  });
}

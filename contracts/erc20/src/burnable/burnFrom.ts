import { expect } from "chai";
import { ethers } from "hardhat";
import { ZeroAddress } from "ethers";

import { amount } from "@gemunion/contracts-constants";

import type { IERC20Options } from "../shared/defaultMint";
import { defaultMintERC20 } from "../shared/defaultMint";

export function shouldBurnFrom(factory: () => Promise<any>, options: IERC20Options = {}) {
  const { mint = defaultMintERC20 } = options;

  describe("burnFrom", function () {
    it("should burn tokens from other account", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address);

      await contractInstance.approve(receiver.address, amount);
      const tx = contractInstance.connect(receiver).burnFrom(owner.address, amount);
      await expect(tx).to.emit(contractInstance, "Transfer").withArgs(owner.address, ZeroAddress, amount);
    });

    it("should burn zero tokens from other account", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address, 0);

      await contractInstance.approve(receiver.address, amount);
      const tx = contractInstance.connect(receiver).burnFrom(owner.address, 0);
      await expect(tx).to.emit(contractInstance, "Transfer").withArgs(owner.address, ZeroAddress, 0);
    });

    it("should fail: burn amount exceeds balance", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address, 0);

      await contractInstance.approve(receiver.address, amount);
      const tx = contractInstance.connect(receiver).burnFrom(owner.address, amount);
      await expect(tx).to.be.revertedWith("ERC20: burn amount exceeds balance");
    });

    it("should fail: not allowed", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx = contractInstance.connect(receiver).burnFrom(owner.address, amount);
      await expect(tx).to.be.revertedWith("ERC20: insufficient allowance");
    });
  });
}

import { expect } from "chai";
import { ethers } from "hardhat";

import { amount } from "@gemunion/contracts-test-constants";

import { deployErc20Base, deployErc20Borrower } from "../fixtures";

export function shouldFlashLoan(name: string) {
  describe("flashLoan", function () {
    it("success", async function () {
      const [owner] = await ethers.getSigners();
      const { contractInstance } = await deployErc20Base(name);

      await contractInstance.mint(owner.address, amount);

      const { contractInstance: erc20FlashBorrowerInstance } = await deployErc20Borrower();

      const tx = contractInstance.flashLoan(erc20FlashBorrowerInstance.address, contractInstance.address, amount, "0x");

      await expect(tx)
        .to.emit(contractInstance, "Transfer")
        .withArgs(ethers.constants.AddressZero, erc20FlashBorrowerInstance.address, amount);
      await expect(tx)
        .to.emit(contractInstance, "Transfer")
        .withArgs(erc20FlashBorrowerInstance.address, ethers.constants.AddressZero, amount);
      await expect(tx)
        .to.emit(erc20FlashBorrowerInstance, "BalanceOf")
        .withArgs(contractInstance.address, erc20FlashBorrowerInstance.address, amount);
      await expect(tx)
        .to.emit(erc20FlashBorrowerInstance, "TotalSupply")
        .withArgs(contractInstance.address, amount * 2);

      const totalSupply = await contractInstance.totalSupply();
      expect(totalSupply).to.equal(amount);

      const balanceOf = await contractInstance.balanceOf(erc20FlashBorrowerInstance.address);
      expect(balanceOf).to.equal(0);

      const allowance = await contractInstance.allowance(erc20FlashBorrowerInstance.address, contractInstance.address);
      expect(allowance).to.equal(0);
    });

    it("missing return value", async function () {
      const [owner] = await ethers.getSigners();
      const { contractInstance } = await deployErc20Base(name);

      await contractInstance.mint(owner.address, amount);

      const erc20FlashBorrower = await ethers.getContractFactory("ERC3156FlashBorrowerMock");
      const erc20FlashBorrowerInstance = await erc20FlashBorrower.deploy(false, true);

      const tx = contractInstance.flashLoan(erc20FlashBorrowerInstance.address, contractInstance.address, amount, "0x");
      await expect(tx).to.be.revertedWith("ERC20FlashMint: invalid return value");
    });

    it("missing approval", async function () {
      const [owner] = await ethers.getSigners();
      const { contractInstance } = await deployErc20Base(name);

      await contractInstance.mint(owner.address, amount);

      const erc20FlashBorrower = await ethers.getContractFactory("ERC3156FlashBorrowerMock");
      const erc20FlashBorrowerInstance = await erc20FlashBorrower.deploy(true, false);

      const tx = contractInstance.flashLoan(erc20FlashBorrowerInstance.address, contractInstance.address, amount, "0x");
      await expect(tx).to.be.revertedWith("ERC20: insufficient allowance");
    });

    it("unavailable funds", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const { contractInstance } = await deployErc20Base(name);

      await contractInstance.mint(owner.address, amount);

      const erc20FlashBorrower = await ethers.getContractFactory("ERC3156FlashBorrowerMock");
      const erc20FlashBorrowerInstance = await erc20FlashBorrower.deploy(true, true);

      const data = contractInstance.interface.encodeFunctionData("transfer", [receiver.address, 10]);

      const tx = contractInstance.flashLoan(erc20FlashBorrowerInstance.address, contractInstance.address, amount, data);
      await expect(tx).to.be.revertedWith("ERC20: burn amount exceeds balance");
    });

    it("more than maxFlashLoan", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const { contractInstance } = await deployErc20Base(name);

      await contractInstance.mint(owner.address, amount);

      const erc20FlashBorrower = await ethers.getContractFactory("ERC3156FlashBorrowerMock");
      const erc20FlashBorrowerInstance = await erc20FlashBorrower.deploy(true, true);

      const data = contractInstance.interface.encodeFunctionData("transfer", [receiver.address, 10]);

      // _mint overflow reverts using a panic code. No reason string.
      const tx = contractInstance.flashLoan(
        erc20FlashBorrowerInstance.address,
        contractInstance.address,
        ethers.constants.MaxUint256,
        data,
      );
      await expect(tx).to.be.revertedWith("ERC20FlashMint: amount exceeds maxFlashLoan");
    });
  });
}

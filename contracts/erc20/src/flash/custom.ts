import { expect } from "chai";
import { ethers } from "hardhat";
import { ZeroAddress } from "ethers";

import { amount } from "@gemunion/contracts-constants";

import type { IERC20Options } from "../shared/defaultMint";
import { defaultMintERC20 } from "../shared/defaultMint";
import { deployErc20Borrower } from "./fixtures";

export function shouldFlashCustom(factory: () => Promise<any>, options: IERC20Options = {}) {
  const { mint = defaultMintERC20 } = options;

  describe("custom flash fee & custom fee receiver", function () {
    const borrowerInitialBalance = amount * 2n;
    const customFlashFee = amount / 2n;

    it("default flash fee receiver", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();
      const address1 = await contractInstance.getAddress();

      await mint(contractInstance, owner, owner.address, amount);

      const erc20FlashBorrowerInstance = await deployErc20Borrower();
      const address2 = await erc20FlashBorrowerInstance.getAddress();

      const tx1 = mint(contractInstance, owner, address2, borrowerInitialBalance);
      await expect(tx1).to.emit(contractInstance, "Transfer").withArgs(ZeroAddress, address2, borrowerInitialBalance);

      const balanceOf = await contractInstance.balanceOf(address2);
      expect(balanceOf).to.equal(borrowerInitialBalance);

      await contractInstance.setFlashFee(customFlashFee);
      const flashFee = await contractInstance.flashFee(address1, amount);
      expect(flashFee).to.equal(customFlashFee);

      const feeReceiver = await contractInstance.flashFeeReceiver();
      expect(feeReceiver).to.equal(ZeroAddress);

      const tx2 = await contractInstance.flashLoan(address2, address1, amount, "0x");
      await expect(tx2).to.emit(contractInstance, "Transfer").withArgs(ZeroAddress, address2, amount);
      await expect(tx2)
        .to.emit(contractInstance, "Transfer")
        .withArgs(address2, ZeroAddress, amount + customFlashFee);
      await expect(tx2)
        .to.emit(erc20FlashBorrowerInstance, "BalanceOf")
        .withArgs(address1, address2, borrowerInitialBalance + amount);
      await expect(tx2)
        .to.emit(erc20FlashBorrowerInstance, "TotalSupply")
        .withArgs(address1, borrowerInitialBalance + amount + amount);

      const totalSupply = await contractInstance.totalSupply();
      expect(totalSupply).to.equal(amount + borrowerInitialBalance - customFlashFee);

      const balanceOf1 = await contractInstance.balanceOf(address2);
      expect(balanceOf1).to.equal(borrowerInitialBalance - customFlashFee);

      const balanceOf2 = await contractInstance.balanceOf(feeReceiver);
      expect(balanceOf2).to.equal(0);

      const allowance = await contractInstance.allowance(address2, address1);
      expect(allowance).to.equal(0);
    });

    it("custom flash fee receiver", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();
      const address1 = await contractInstance.getAddress();

      await mint(contractInstance, owner, owner.address, amount);

      const erc20FlashBorrowerInstance = await deployErc20Borrower();
      const address2 = await erc20FlashBorrowerInstance.getAddress();

      const tx1 = mint(contractInstance, owner, address2, borrowerInitialBalance);
      await expect(tx1).to.emit(contractInstance, "Transfer").withArgs(ZeroAddress, address2, borrowerInitialBalance);

      const balanceOf1 = await contractInstance.balanceOf(address2);
      expect(balanceOf1).to.equal(borrowerInitialBalance);

      await contractInstance.setFlashFee(customFlashFee);
      const flashFee = await contractInstance.flashFee(address1, amount);
      expect(flashFee).to.equal(customFlashFee);

      await contractInstance.setFlashFeeReceiver(receiver.address);
      const feeReceiver = await contractInstance.flashFeeReceiver();
      expect(feeReceiver).to.equal(receiver.address);

      const balanceOf2 = await contractInstance.balanceOf(receiver.address);
      expect(balanceOf2).to.equal(0);

      const tx2 = await contractInstance.flashLoan(address2, address1, amount, "0x");

      await expect(tx2).to.emit(contractInstance, "Transfer").withArgs(ZeroAddress, address2, amount);
      await expect(tx2).to.emit(contractInstance, "Transfer").withArgs(address2, ZeroAddress, amount);
      await expect(tx2).to.emit(contractInstance, "Transfer").withArgs(address2, receiver.address, customFlashFee);
      await expect(tx2)
        .to.emit(erc20FlashBorrowerInstance, "BalanceOf")
        .withArgs(address1, address2, borrowerInitialBalance + amount);
      await expect(tx2)
        .to.emit(erc20FlashBorrowerInstance, "TotalSupply")
        .withArgs(address1, borrowerInitialBalance + amount + amount);

      const totalSupply = await contractInstance.totalSupply();
      expect(totalSupply).to.equal(amount + borrowerInitialBalance);

      const balanceOf3 = await contractInstance.balanceOf(address2);
      expect(balanceOf3).to.equal(borrowerInitialBalance - customFlashFee);

      const balanceOf4 = await contractInstance.balanceOf(feeReceiver);
      expect(balanceOf4).to.equal(customFlashFee);

      const allowance = await contractInstance.allowance(address2, address1);
      expect(allowance).to.equal(0);
    });
  });
}

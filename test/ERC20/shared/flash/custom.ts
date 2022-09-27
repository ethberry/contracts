import { expect } from "chai";
import { ethers } from "hardhat";

import { amount } from "../../../constants";

export function shouldFlashCustom() {
  describe("custom flash fee & custom fee receiver", function () {
    const borrowerInitialBalance = amount * 2;
    const customFlashFee = amount / 2;

    beforeEach("init receiver balance & set flash fee", async function () {
      await this.erc20Instance.mint(this.owner.address, amount);

      const erc20FlashBorrower = await ethers.getContractFactory("ERC3156FlashBorrowerMock");
      this.erc20FlashBorrowerInstance = await erc20FlashBorrower.deploy(true, true);

      const tx = await this.erc20Instance.mint(this.erc20FlashBorrowerInstance.address, borrowerInitialBalance);
      await expect(tx)
        .to.emit(this.erc20Instance, "Transfer")
        .withArgs(ethers.constants.AddressZero, this.erc20FlashBorrowerInstance.address, borrowerInitialBalance);

      const balanceOf = await this.erc20Instance.balanceOf(this.erc20FlashBorrowerInstance.address);
      expect(balanceOf).to.equal(borrowerInitialBalance);

      await this.erc20Instance.setFlashFee(customFlashFee);
      const flashFee = await this.erc20Instance.flashFee(this.erc20Instance.address, amount);
      expect(flashFee).to.equal(customFlashFee);
    });

    it("default flash fee receiver", async function () {
      const feeReceiver = await this.erc20Instance.flashFeeReceiver();
      expect(feeReceiver).to.equal(ethers.constants.AddressZero);

      const tx = await this.erc20Instance.flashLoan(
        this.erc20FlashBorrowerInstance.address,
        this.erc20Instance.address,
        amount,
        "0x",
      );
      await expect(tx)
        .to.emit(this.erc20Instance, "Transfer")
        .withArgs(ethers.constants.AddressZero, this.erc20FlashBorrowerInstance.address, amount);
      await expect(tx)
        .to.emit(this.erc20Instance, "Transfer")
        .withArgs(this.erc20FlashBorrowerInstance.address, ethers.constants.AddressZero, amount + customFlashFee);
      await expect(tx)
        .to.emit(this.erc20FlashBorrowerInstance, "BalanceOf")
        .withArgs(this.erc20Instance.address, this.erc20FlashBorrowerInstance.address, borrowerInitialBalance + amount);
      await expect(tx)
        .to.emit(this.erc20FlashBorrowerInstance, "TotalSupply")
        .withArgs(this.erc20Instance.address, borrowerInitialBalance + amount + amount);

      const totalSupply = await this.erc20Instance.totalSupply();
      expect(totalSupply).to.equal(amount + borrowerInitialBalance - customFlashFee);

      const balanceOf1 = await this.erc20Instance.balanceOf(this.erc20FlashBorrowerInstance.address);
      expect(balanceOf1).to.equal(borrowerInitialBalance - customFlashFee);

      const balanceOf2 = await this.erc20Instance.balanceOf(feeReceiver);
      expect(balanceOf2).to.equal(0);

      const allowance = await this.erc20Instance.allowance(
        this.erc20FlashBorrowerInstance.address,
        this.erc20Instance.address,
      );
      expect(allowance).to.equal(0);
    });

    it("custom flash fee receiver", async function () {
      await this.erc20Instance.setFlashFeeReceiver(this.receiver.address);
      const feeReceiver = await this.erc20Instance.flashFeeReceiver();
      expect(feeReceiver).to.equal(this.receiver.address);

      const balanceOf = await this.erc20Instance.balanceOf(this.receiver.address);
      expect(balanceOf).to.equal(0);

      const tx = await this.erc20Instance.flashLoan(
        this.erc20FlashBorrowerInstance.address,
        this.erc20Instance.address,
        amount,
        "0x",
      );

      await expect(tx)
        .to.emit(this.erc20Instance, "Transfer")
        .withArgs(ethers.constants.AddressZero, this.erc20FlashBorrowerInstance.address, amount);
      await expect(tx)
        .to.emit(this.erc20Instance, "Transfer")
        .withArgs(this.erc20FlashBorrowerInstance.address, ethers.constants.AddressZero, amount);
      await expect(tx)
        .to.emit(this.erc20Instance, "Transfer")
        .withArgs(this.erc20FlashBorrowerInstance.address, this.receiver.address, customFlashFee);
      await expect(tx)
        .to.emit(this.erc20FlashBorrowerInstance, "BalanceOf")
        .withArgs(this.erc20Instance.address, this.erc20FlashBorrowerInstance.address, borrowerInitialBalance + amount);
      await expect(tx)
        .to.emit(this.erc20FlashBorrowerInstance, "TotalSupply")
        .withArgs(this.erc20Instance.address, borrowerInitialBalance + amount + amount);

      const totalSupply = await this.erc20Instance.totalSupply();
      expect(totalSupply).to.equal(amount + borrowerInitialBalance);

      const balanceOf1 = await this.erc20Instance.balanceOf(this.erc20FlashBorrowerInstance.address);
      expect(balanceOf1).to.equal(borrowerInitialBalance - customFlashFee);

      const balanceOf2 = await this.erc20Instance.balanceOf(feeReceiver);
      expect(balanceOf2).to.equal(customFlashFee);

      const allowance = await this.erc20Instance.allowance(
        this.erc20FlashBorrowerInstance.address,
        this.erc20Instance.address,
      );
      expect(allowance).to.equal(0);
    });
  });
}

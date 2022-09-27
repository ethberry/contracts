import { expect } from "chai";
import { ethers } from "hardhat";

import { amount } from "../../../constants";

export function shouldFlashLoan() {
  describe("flashLoan", function () {
    it("success", async function () {
      await this.erc20Instance.mint(this.owner.address, amount);

      const erc20FlashBorrower = await ethers.getContractFactory("ERC3156FlashBorrowerMock");
      this.erc20FlashBorrowerInstance = await erc20FlashBorrower.deploy(true, true);

      const tx = this.erc20Instance.flashLoan(
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
        .to.emit(this.erc20FlashBorrowerInstance, "BalanceOf")
        .withArgs(this.erc20Instance.address, this.erc20FlashBorrowerInstance.address, amount);
      await expect(tx)
        .to.emit(this.erc20FlashBorrowerInstance, "TotalSupply")
        .withArgs(this.erc20Instance.address, amount * 2);

      const totalSupply = await this.erc20Instance.totalSupply();
      expect(totalSupply).to.equal(amount);

      const balanceOf = await this.erc20Instance.balanceOf(this.erc20FlashBorrowerInstance.address);
      expect(balanceOf).to.equal(0);

      const allowance = await this.erc20Instance.allowance(
        this.erc20FlashBorrowerInstance.address,
        this.erc20Instance.address,
      );
      expect(allowance).to.equal(0);
    });

    it("missing return value", async function () {
      await this.erc20Instance.mint(this.owner.address, amount);

      const erc20FlashBorrower = await ethers.getContractFactory("ERC3156FlashBorrowerMock");
      const erc20FlashBorrowerInstance = await erc20FlashBorrower.deploy(false, true);

      const tx = this.erc20Instance.flashLoan(
        erc20FlashBorrowerInstance.address,
        this.erc20Instance.address,
        amount,
        "0x",
      );
      await expect(tx).to.be.revertedWith("ERC20FlashMint: invalid return value");
    });

    it("missing approval", async function () {
      await this.erc20Instance.mint(this.owner.address, amount);

      const erc20FlashBorrower = await ethers.getContractFactory("ERC3156FlashBorrowerMock");
      const erc20FlashBorrowerInstance = await erc20FlashBorrower.deploy(true, false);

      const tx = this.erc20Instance.flashLoan(
        erc20FlashBorrowerInstance.address,
        this.erc20Instance.address,
        amount,
        "0x",
      );
      await expect(tx).to.be.revertedWith("ERC20: insufficient allowance");
    });

    it("unavailable funds", async function () {
      await this.erc20Instance.mint(this.owner.address, amount);

      const erc20FlashBorrower = await ethers.getContractFactory("ERC3156FlashBorrowerMock");
      const erc20FlashBorrowerInstance = await erc20FlashBorrower.deploy(true, true);

      const data = this.erc20Instance.interface.encodeFunctionData("transfer", [this.receiver.address, 10]);

      const tx = this.erc20Instance.flashLoan(
        erc20FlashBorrowerInstance.address,
        this.erc20Instance.address,
        amount,
        data,
      );
      await expect(tx).to.be.revertedWith("ERC20: burn amount exceeds balance");
    });

    it("more than maxFlashLoan", async function () {
      await this.erc20Instance.mint(this.owner.address, amount);

      const erc20FlashBorrower = await ethers.getContractFactory("ERC3156FlashBorrowerMock");
      const erc20FlashBorrowerInstance = await erc20FlashBorrower.deploy(true, true);

      const data = this.erc20Instance.interface.encodeFunctionData("transfer", [this.receiver.address, 10]);

      // _mint overflow reverts using a panic code. No reason string.
      const tx = this.erc20Instance.flashLoan(
        erc20FlashBorrowerInstance.address,
        this.erc20Instance.address,
        ethers.constants.MaxUint256,
        data,
      );
      await expect(tx).to.be.revertedWith("ERC20FlashMint: amount exceeds maxFlashLoan");
    });
  });
}

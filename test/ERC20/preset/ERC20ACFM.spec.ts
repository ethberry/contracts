import { expect, use } from "chai";
import { solidity } from "ethereum-waffle";
import { ethers } from "hardhat";
import { amount, DEFAULT_ADMIN_ROLE, MINTER_ROLE, tokenName, tokenSymbol } from "../../constants";

import { shouldHaveRole } from "../../shared/accessControl/hasRoles";
import { shouldGetRoleAdmin } from "../../shared/accessControl/getRoleAdmin";
import { shouldGrantRole } from "../../shared/accessControl/grantRole";
import { shouldRevokeRole } from "../../shared/accessControl/revokeRole";
import { shouldRenounceRole } from "../../shared/accessControl/renounceRole";
import { shouldMint } from "../shared/mint";
import { shouldBalanceOf } from "../shared/balanceOf";
import { shouldTransfer } from "../shared/transfer";
import { shouldTransferFrom } from "../shared/transferFrom";
import { shouldApprove } from "../shared/approve";

use(solidity);

describe("ERC20ACFM", function () {
  beforeEach(async function () {
    [this.owner, this.receiver] = await ethers.getSigners();

    const erc20Factory = await ethers.getContractFactory("ERC20ACFM");
    this.erc20Instance = await erc20Factory.deploy(tokenName, tokenSymbol);

    const erc20NonReceiverFactory = await ethers.getContractFactory("ERC20NonReceiverMock");
    this.erc20NonReceiverInstance = await erc20NonReceiverFactory.deploy();

    this.contractInstance = this.erc20Instance;
  });

  shouldHaveRole(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldGetRoleAdmin(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldGrantRole();
  shouldRevokeRole();
  shouldRenounceRole();
  shouldMint(true);
  shouldBalanceOf();
  shouldTransfer();
  shouldTransferFrom();
  shouldApprove();

  describe("maxFlashLoan", function () {
    it("token match (zero)", async function () {
      const maxFlashLoan = await this.erc20Instance.maxFlashLoan(this.erc20Instance.address);
      expect(maxFlashLoan).to.equal(ethers.constants.MaxUint256);
    });

    it("token match (amount)", async function () {
      await this.erc20Instance.mint(this.owner.address, amount);
      const maxFlashLoan = await this.erc20Instance.maxFlashLoan(this.erc20Instance.address);
      expect(maxFlashLoan).to.equal(ethers.constants.MaxUint256.sub(amount));
    });

    it("token mismatch", async function () {
      await this.erc20Instance.mint(this.owner.address, amount);
      const maxFlashLoan = await this.erc20Instance.maxFlashLoan(ethers.constants.AddressZero);
      expect(maxFlashLoan).to.equal(0);
    });
  });

  describe("flashFee", function () {
    it("token match", async function () {
      const flashFee = await this.erc20Instance.flashFee(this.erc20Instance.address, amount);
      expect(flashFee).to.equal(0);
    });

    it("token mismatch", async function () {
      const tx = this.erc20Instance.flashFee(ethers.constants.AddressZero, amount);
      await expect(tx).to.be.revertedWith("ERC20FlashMint: wrong token");
    });
  });

  describe("flashFeeReceiver", function () {
    it("default receiver", async function () {
      const flashFeeReceiver = await this.erc20Instance.flashFeeReceiver();
      expect(flashFeeReceiver).to.equal(ethers.constants.AddressZero);
    });
  });

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

  describe("supportsInterface", function () {
    it("should support all interfaces", async function () {
      const supportsIERC20 = await this.erc20Instance.supportsInterface("0x36372b07");
      expect(supportsIERC20).to.equal(true);
      const supportsIERC20Metadata = await this.erc20Instance.supportsInterface("0xa219a025");
      expect(supportsIERC20Metadata).to.equal(true);
      const supportsIERC165 = await this.erc20Instance.supportsInterface("0x01ffc9a7");
      expect(supportsIERC165).to.equal(true);
      const supportsIAccessControl = await this.erc20Instance.supportsInterface("0x7965db0b");
      expect(supportsIAccessControl).to.equal(true);
      const supportsInvalidInterface = await this.erc20Instance.supportsInterface("0xffffffff");
      expect(supportsInvalidInterface).to.equal(false);
    });
  });
});

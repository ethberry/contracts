import { expect } from "chai";
import { ethers } from "hardhat";
import { MaxUint256, ZeroAddress } from "ethers";

import { amount } from "@gemunion/contracts-constants";

import type { IERC20Options } from "../shared/defaultMint";
import { defaultMintERC20 } from "../shared/defaultMint";
import { deployErc20Borrower } from "./fixtures";

export function shouldFlashLoan(factory: () => Promise<any>, options: IERC20Options = {}) {
  const { mint = defaultMintERC20 } = options;

  describe("flashLoan", function () {
    it("success", async function () {
      const [owner] = await ethers.getSigners();

      const contractInstance = await factory();
      const address1 = await contractInstance.getAddress();

      await mint(contractInstance, owner, owner.address, amount);

      const erc20FlashBorrowerInstance = await deployErc20Borrower();
      const address2 = await erc20FlashBorrowerInstance.getAddress();

      const tx = contractInstance.flashLoan(address2, address1, amount, "0x");

      await expect(tx).to.emit(contractInstance, "Transfer").withArgs(ZeroAddress, address2, amount);
      await expect(tx).to.emit(contractInstance, "Transfer").withArgs(address2, ZeroAddress, amount);
      await expect(tx).to.emit(erc20FlashBorrowerInstance, "BalanceOf").withArgs(address1, address2, amount);
      await expect(tx)
        .to.emit(erc20FlashBorrowerInstance, "TotalSupply")
        .withArgs(address1, amount * 2n);

      const totalSupply = await contractInstance.totalSupply();
      expect(totalSupply).to.equal(amount);

      const balanceOf = await contractInstance.balanceOf(address2);
      expect(balanceOf).to.equal(0);

      const allowance = await contractInstance.allowance(address2, address1);
      expect(allowance).to.equal(0);
    });

    it("missing return value", async function () {
      const [owner] = await ethers.getSigners();

      const contractInstance = await factory();
      const address1 = await contractInstance.getAddress();

      await mint(contractInstance, owner, owner.address, amount);

      const erc20FlashBorrower = await ethers.getContractFactory("ERC3156FlashBorrowerMock");
      const erc20FlashBorrowerInstance = await erc20FlashBorrower.deploy(false, true);
      const address2 = await erc20FlashBorrowerInstance.getAddress();

      const tx = contractInstance.flashLoan(address2, address1, amount, "0x");
      await expect(tx).to.be.revertedWith("ERC20FlashMint: invalid return value");
    });

    it("missing approval", async function () {
      const [owner] = await ethers.getSigners();

      const contractInstance = await factory();
      const address1 = await contractInstance.getAddress();

      await mint(contractInstance, owner, owner.address, amount);

      const erc20FlashBorrower = await ethers.getContractFactory("ERC3156FlashBorrowerMock");
      const erc20FlashBorrowerInstance = await erc20FlashBorrower.deploy(true, false);
      const address2 = await erc20FlashBorrowerInstance.getAddress();

      const tx = contractInstance.flashLoan(address2, address1, amount, "0x");
      await expect(tx).to.be.revertedWith("ERC20: insufficient allowance");
    });

    it("unavailable funds", async function () {
      const [owner, receiver] = await ethers.getSigners();

      const contractInstance = await factory();
      const address1 = await contractInstance.getAddress();

      await mint(contractInstance, owner, owner.address, amount);

      const erc20FlashBorrower = await ethers.getContractFactory("ERC3156FlashBorrowerMock");
      const erc20FlashBorrowerInstance = await erc20FlashBorrower.deploy(true, true);
      const address2 = await erc20FlashBorrowerInstance.getAddress();

      const data = contractInstance.interface.encodeFunctionData("transfer", [receiver.address, 10]);

      const tx = contractInstance.flashLoan(address2, address1, amount, data);
      await expect(tx).to.be.revertedWith("ERC20: burn amount exceeds balance");
    });

    it("more than maxFlashLoan", async function () {
      const [owner, receiver] = await ethers.getSigners();

      const contractInstance = await factory();
      const address1 = await contractInstance.getAddress();

      await mint(contractInstance, owner, owner.address, amount);

      const erc20FlashBorrower = await ethers.getContractFactory("ERC3156FlashBorrowerMock");
      const erc20FlashBorrowerInstance = await erc20FlashBorrower.deploy(true, true);
      const address2 = await erc20FlashBorrowerInstance.getAddress();

      const data = contractInstance.interface.encodeFunctionData("transfer", [receiver.address, 10]);

      // _mint overflow reverts using a panic code. No reason string.
      const tx = contractInstance.flashLoan(address2, address1, MaxUint256, data);
      await expect(tx).to.be.revertedWith("ERC20FlashMint: amount exceeds maxFlashLoan");
    });
  });
}

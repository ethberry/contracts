import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { ERC20ACBCSP, ERC20GemunionNonReceiverTest } from "../../../typechain-types";
import {
  amount,
  DEFAULT_ADMIN_ROLE,
  MINTER_ROLE,
  PAUSER_ROLE,
  SNAPSHOT_ROLE,
  tokenName,
  tokenSymbol,
} from "../../constants";

describe("ERC20ACBCSP", function () {
  let erc20: ContractFactory;
  let erc20Instance: ERC20ACBCSP;
  let coinNonReceiver: ContractFactory;
  let coinNonReceiverInstance: ERC20GemunionNonReceiverTest;
  let owner: SignerWithAddress;
  let receiver: SignerWithAddress;

  beforeEach(async function () {
    erc20 = await ethers.getContractFactory("ERC20ACBCSP");
    coinNonReceiver = await ethers.getContractFactory("ERC20GemunionNonReceiverTest");
    [owner, receiver] = await ethers.getSigners();

    erc20Instance = (await erc20.deploy(tokenName, tokenSymbol, amount)) as ERC20ACBCSP;
    coinNonReceiverInstance = (await coinNonReceiver.deploy()) as ERC20GemunionNonReceiverTest;
  });

  describe("constructor", function () {
    it("should set the right roles to deployer", async function () {
      const isAdmin = await erc20Instance.hasRole(DEFAULT_ADMIN_ROLE, owner.address);
      expect(isAdmin).to.equal(true);
      const isMinter = await erc20Instance.hasRole(MINTER_ROLE, owner.address);
      expect(isMinter).to.equal(true);
      const isPauser = await erc20Instance.hasRole(PAUSER_ROLE, owner.address);
      expect(isPauser).to.equal(true);
      const isSnapshoter = await erc20Instance.hasRole(SNAPSHOT_ROLE, owner.address);
      expect(isSnapshoter).to.equal(true);
    });
  });

  describe("mint", function () {
    it("should fail: must have minter role to mint", async function () {
      const tx = erc20Instance.connect(receiver).mint(receiver.address, amount);
      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${MINTER_ROLE}`,
      );
    });

    it("should mint", async function () {
      const tx = erc20Instance.mint(owner.address, amount);
      await expect(tx).to.emit(erc20Instance, "Transfer").withArgs(ethers.constants.AddressZero, owner.address, amount);

      const balance = await erc20Instance.balanceOf(owner.address);
      expect(balance).to.equal(amount);

      const totalSupply = await erc20Instance.totalSupply();
      expect(totalSupply).to.equal(amount);
    });
  });

  describe("balanceOf", function () {
    it("should not fail for zero addr", async function () {
      await erc20Instance.mint(owner.address, amount);

      const tx = erc20Instance.burn(amount);
      await expect(tx).to.emit(erc20Instance, "Transfer").withArgs(owner.address, ethers.constants.AddressZero, amount);

      const balance = await erc20Instance.balanceOf(ethers.constants.AddressZero);
      expect(balance).to.equal(0);
    });

    it("should get balance of owner", async function () {
      await erc20Instance.mint(owner.address, amount);

      const balance = await erc20Instance.balanceOf(owner.address);
      expect(balance).to.equal(amount);
    });

    it("should get balance of not owner", async function () {
      const balance = await erc20Instance.balanceOf(receiver.address);
      expect(balance).to.equal(0);
    });
  });

  describe("transfer", function () {
    it("should fail: transfer amount exceeds balance", async function () {
      const tx = erc20Instance.connect(receiver).transfer(owner.address, amount);
      await expect(tx).to.be.revertedWith("ERC20: transfer amount exceeds balance");
    });

    it("should transfer", async function () {
      await erc20Instance.mint(owner.address, amount);

      const tx = erc20Instance.transfer(receiver.address, amount);
      await expect(tx).to.emit(erc20Instance, "Transfer").withArgs(owner.address, receiver.address, amount);

      const receiverBalance = await erc20Instance.balanceOf(receiver.address);
      expect(receiverBalance).to.equal(amount);

      const balanceOfOwner = await erc20Instance.balanceOf(owner.address);
      expect(balanceOfOwner).to.equal(0);
    });

    it("should transfer to contract", async function () {
      await erc20Instance.mint(owner.address, amount);

      const tx = erc20Instance.transfer(coinNonReceiverInstance.address, amount);
      await expect(tx)
        .to.emit(erc20Instance, "Transfer")
        .withArgs(owner.address, coinNonReceiverInstance.address, amount);

      const nonReceiverBalance = await erc20Instance.balanceOf(coinNonReceiverInstance.address);
      expect(nonReceiverBalance).to.equal(amount);

      const balanceOfOwner = await erc20Instance.balanceOf(owner.address);
      expect(balanceOfOwner).to.equal(0);
    });
  });

  describe("snapshot", function () {
    it("should fail: nonexistent id", async function () {
      const tx = erc20Instance.snapshot();
      await expect(tx).to.emit(erc20Instance, "Snapshot").withArgs("1");

      const tx2 = erc20Instance.balanceOfAt(receiver.address, "2");
      await expect(tx2).to.be.revertedWith("ERC20Snapshot: nonexistent id");
    });

    it("should make snapshot", async function () {
      await erc20Instance.mint(owner.address, amount);

      const tx = erc20Instance.snapshot();
      await expect(tx).to.emit(erc20Instance, "Snapshot").withArgs("1");

      const balanceOfReceiver = await erc20Instance.balanceOfAt(receiver.address, "1");
      expect(balanceOfReceiver).to.equal(0);

      const balanceOfOwner = await erc20Instance.balanceOfAt(owner.address, "1");
      expect(balanceOfOwner).to.equal(amount);

      const totalSupply = await erc20Instance.totalSupplyAt("1");
      expect(totalSupply).to.equal(amount);
    });
  });

  describe("approve", function () {
    it("should fail: approve to zero address", async function () {
      const tx = erc20Instance.approve(ethers.constants.AddressZero, amount);
      await expect(tx).to.be.revertedWith("ERC20: approve to the zero address");
    });

    it("should approve with zero balance", async function () {
      const tx = erc20Instance.connect(receiver).approve(owner.address, amount);
      await expect(tx).to.emit(erc20Instance, "Approval").withArgs(receiver.address, owner.address, amount);
    });

    it("should approve to self", async function () {
      const tx = erc20Instance.approve(owner.address, amount);
      await expect(tx).to.emit(erc20Instance, "Approval").withArgs(owner.address, owner.address, amount);
    });

    it("should approve", async function () {
      const tx = erc20Instance.approve(receiver.address, amount);
      await expect(tx).to.emit(erc20Instance, "Approval").withArgs(owner.address, receiver.address, amount);

      const approved = await erc20Instance.allowance(owner.address, receiver.address);
      expect(approved).to.equal(amount);
    });
  });

  describe("burn", function () {
    it("should fail: burn amount exceeds balance", async function () {
      const tx = erc20Instance.burn(amount);
      await expect(tx).to.be.revertedWith("ERC20: burn amount exceeds balance");
    });

    it("should burn zero", async function () {
      const tx = erc20Instance.burn(0);
      await expect(tx).to.emit(erc20Instance, "Transfer").withArgs(owner.address, ethers.constants.AddressZero, 0);
    });

    it("should burn tokens", async function () {
      await erc20Instance.mint(owner.address, amount);

      const tx = erc20Instance.burn(amount);
      await expect(tx).to.emit(erc20Instance, "Transfer").withArgs(owner.address, ethers.constants.AddressZero, amount);

      const balance = await erc20Instance.balanceOf(owner.address);
      expect(balance).to.equal(0);

      const totalSupply = await erc20Instance.totalSupply();
      expect(totalSupply).to.equal(0);
    });
  });

  describe("burnFrom", function () {
    it("should fail: burn from zero account", async function () {
      const tx = erc20Instance.burnFrom(ethers.constants.AddressZero, amount);
      await expect(tx).to.be.revertedWith("ERC20: burn amount exceeds allowance");
    });

    it("should fail: burn from other account", async function () {
      await erc20Instance.mint(owner.address, amount);

      await erc20Instance.approve(receiver.address, amount);
      const tx = erc20Instance.connect(receiver).burnFrom(owner.address, amount);
      await expect(tx).to.emit(erc20Instance, "Transfer").withArgs(owner.address, ethers.constants.AddressZero, amount);
    });
  });

  describe("pause", function () {
    it("should fail: not an owner", async function () {
      const tx = erc20Instance.connect(receiver).pause();
      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${PAUSER_ROLE}`,
      );

      const tx2 = erc20Instance.connect(receiver).unpause();
      await expect(tx2).to.be.revertedWith(
        `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${PAUSER_ROLE}`,
      );
    });

    it("should pause/unpause", async function () {
      await erc20Instance.mint(owner.address, amount);

      const tx1 = erc20Instance.pause();
      await expect(tx1).to.emit(erc20Instance, "Paused").withArgs(owner.address);

      const tx2 = erc20Instance.transfer(receiver.address, amount);
      await expect(tx2).to.be.revertedWith(`ERC20Pausable: token transfer while paused`);

      const tx4 = erc20Instance.unpause();
      await expect(tx4).to.emit(erc20Instance, "Unpaused").withArgs(owner.address);

      const tx5 = erc20Instance.transfer(receiver.address, amount);
      await expect(tx5).to.not.be.reverted;

      const balanceOfOwner = await erc20Instance.balanceOf(owner.address);
      expect(balanceOfOwner).to.equal(0);
    });
  });

  describe("cap", function () {
    it("should fail: cap exceeded", async function () {
      const tx = erc20Instance.mint(owner.address, amount + 1);
      await expect(tx).to.be.revertedWith("ERC20Capped: cap exceeded");
    });
  });

  describe("supportsInterface", function () {
    it("should support all interfaces", async function () {
      const supportsIERC20 = await erc20Instance.supportsInterface("0x36372b07");
      expect(supportsIERC20).to.equal(true);
      const supportsIERC20Metadata = await erc20Instance.supportsInterface("0xa219a025");
      expect(supportsIERC20Metadata).to.equal(true);

      const supportsIERC165 = await erc20Instance.supportsInterface("0x01ffc9a7");
      expect(supportsIERC165).to.equal(true);

      const supportsIAccessControl = await erc20Instance.supportsInterface("0x7965db0b");
      expect(supportsIAccessControl).to.equal(true);

      const supportsInvalidInterface = await erc20Instance.supportsInterface("0xffffffff");
      expect(supportsInvalidInterface).to.equal(false);
    });
  });
});

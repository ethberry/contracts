import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { MindCoin } from "../../typechain";
import {
  amount,
  decimals,
  DEFAULT_ADMIN_ROLE,
  initialTokenAmountInWei,
  MINTER_ROLE,
  PAUSER_ROLE,
  SNAPSHOT_ROLE,
} from "../constants";

describe("ERC20", function () {
  let coin: ContractFactory;
  let coinInstance: MindCoin;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;

  beforeEach(async function () {
    coin = await ethers.getContractFactory("MindCoin");
    [owner, addr1, addr2] = await ethers.getSigners();

    coinInstance = (await upgrades.deployProxy(
      coin,
      ["memoryOS COIN token", "MIND", initialTokenAmountInWei, initialTokenAmountInWei.add(amount)],
      { initializer: "initialize(string name, string symbol, uint256 initialSupply, uint256 cap)" },
    )) as MindCoin;
  });

  describe("Deployment", function () {
    it("Should set the right roles to deployer", async function () {
      const isAdmin = await coinInstance.hasRole(DEFAULT_ADMIN_ROLE, owner.address);
      expect(isAdmin).to.equal(true);
      const isMinter = await coinInstance.hasRole(MINTER_ROLE, owner.address);
      expect(isMinter).to.equal(true);
      const isPauser = await coinInstance.hasRole(PAUSER_ROLE, owner.address);
      expect(isPauser).to.equal(true);
      const isSnapshoter = await coinInstance.hasRole(SNAPSHOT_ROLE, owner.address);
      expect(isSnapshoter).to.equal(true);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const totalSupply = await coinInstance.totalSupply();
      expect(totalSupply).to.equal(initialTokenAmountInWei);
      const ownerBalance = await coinInstance.balanceOf(owner.address);
      expect(ownerBalance).to.equal(initialTokenAmountInWei);
    });
  });

  describe("Snapshot", function () {
    it("Should fail with unexisting snapshot", async function () {
      await coinInstance.transfer(addr1.address, amount);
      const addr1Balance = await coinInstance.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(amount);

      const tx = coinInstance.snapshot();
      await expect(tx).to.emit(coinInstance, "Snapshot").withArgs("1");

      const tx2 = coinInstance.balanceOfAt(addr1.address, "2");
      await expect(tx2).to.be.revertedWith("ERC20Snapshot: nonexistent id");
    });

    it("Should make snapshot", async function () {
      await coinInstance.transfer(addr1.address, amount);
      const addr1Balance = await coinInstance.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(amount);

      const tx = coinInstance.snapshot();

      await expect(tx).to.emit(coinInstance, "Snapshot").withArgs("1");

      const balance1 = await coinInstance.balanceOfAt(addr1.address, "1");
      expect(balance1).to.equal(amount);

      const balance2 = await coinInstance.balanceOfAt(addr2.address, "1");
      expect(balance2).to.equal(0);

      const totalSupply = await coinInstance.totalSupplyAt("1");
      expect(totalSupply).to.equal(decimals.mul(amount));
    });
  });

  describe("Mint", function () {
    it("should fail for wrong role", async function () {
      const tx = coinInstance.connect(addr1).mint(addr1.address, amount);
      await expect(tx).to.be.revertedWith("ERC20PresetMinterPauser: must have minter role to mint");
    });

    it("should mint more tokens", async function () {
      await coinInstance.mint(owner.address, amount);
      const balance = await coinInstance.balanceOf(owner.address);
      expect(balance).to.equal(initialTokenAmountInWei.add(amount));
    });
  });
});

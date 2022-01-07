import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { ERC20GemunionPolygonChild } from "../../../typechain-types";
import { amount, DEFAULT_ADMIN_ROLE, DEPOSITOR_ROLE, tokenName, tokenSymbol } from "../../constants";

describe("ERC20GemunionPolygonChild", function () {
  let erc20: ContractFactory;
  let erc20Instance: ERC20GemunionPolygonChild;
  let owner: SignerWithAddress;
  let receiver: SignerWithAddress;

  beforeEach(async function () {
    erc20 = await ethers.getContractFactory("ERC20GemunionPolygonChild");
    [owner, receiver] = await ethers.getSigners();

    erc20Instance = (await erc20.deploy(tokenName, tokenSymbol)) as ERC20GemunionPolygonChild;
  });

  describe("Deployment", function () {
    it("should set the right roles to deployer", async function () {
      const isAdmin = await erc20Instance.hasRole(DEFAULT_ADMIN_ROLE, owner.address);
      expect(isAdmin).to.equal(true);
      const isDepositor = await erc20Instance.hasRole(DEPOSITOR_ROLE, owner.address);
      expect(isDepositor).to.equal(true);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const totalSupply = await erc20Instance.totalSupply();
      expect(totalSupply).to.equal(0);
      const ownerBalance = await erc20Instance.balanceOf(owner.address);
      expect(ownerBalance).to.equal(0);
    });
  });

  describe("Mint", function () {
    it("should fail: account is missing role", async function () {
      const tx = erc20Instance.connect(receiver).mint(receiver.address, amount);
      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${DEFAULT_ADMIN_ROLE}`,
      );
    });

    it("should mint tokens", async function () {
      await erc20Instance.mint(owner.address, amount);
      const balance = await erc20Instance.balanceOf(owner.address);
      expect(balance).to.equal(amount);
      const totalSupply = await erc20Instance.totalSupply();
      expect(totalSupply).to.equal(amount);
    });
  });

  describe("Deposit", function () {
    it("should fail: account is missing role", async function () {
      const tx = erc20Instance
        .connect(receiver)
        .deposit(receiver.address, "0x0000000000000000000000000000000000000000000000000000000000000064");
      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${DEPOSITOR_ROLE}`,
      );
    });

    it("should mint tokens", async function () {
      await erc20Instance.mint(owner.address, amount);
      const tx = erc20Instance.deposit(
        receiver.address,
        "0x0000000000000000000000000000000000000000000000000000000000000064",
      );
      await expect(tx).to.not.be.reverted;
    });
  });
});

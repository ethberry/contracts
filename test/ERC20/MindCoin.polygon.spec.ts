import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { MindCoinPolygon } from "../../typechain";
import { addr, DEPOSITOR_ROLE, tokenName, tokenSymbol } from "../constants";

describe("MindToken (Polygon)", function () {
  let coin: ContractFactory;
  let coinInstance: MindCoinPolygon;
  let owner: SignerWithAddress;

  beforeEach(async function () {
    coin = await ethers.getContractFactory("MindCoinPolygon");
    [owner] = await ethers.getSigners();

    coinInstance = (await upgrades.deployProxy(coin, [tokenName, tokenSymbol])) as MindCoinPolygon;
  });

  describe("Deployment", function () {
    it("should set the right roles to deployer", async function () {
      const isDepositor = await coinInstance.hasRole(DEPOSITOR_ROLE, owner.address);
      expect(isDepositor).to.equal(false);
    });
  });

  describe("Bridge", function () {
    it("should set the right roles to deployer", async function () {
      await coinInstance.grantRole(DEPOSITOR_ROLE, addr.mumbai.childProxyManager);
      const isDepositor = await coinInstance.hasRole(DEPOSITOR_ROLE, addr.mumbai.childProxyManager);
      expect(isDepositor).to.equal(true);
    });
  });
});

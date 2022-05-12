import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";

import { ERC20FactoryTest } from "../../typechain-types";
import { amount, DEFAULT_ADMIN_ROLE, PAUSER_ROLE, tokenName, tokenSymbol } from "../constants";

import { shouldHaveRole } from "../shared/accessControl/hasRoles";
import { shouldGetRoleAdmin } from "../shared/accessControl/getRoleAdmin";
import { shouldGrantRole } from "../shared/accessControl/grantRole";
import { shouldRevokeRole } from "../shared/accessControl/revokeRole";
import { shouldRenounceRole } from "../shared/accessControl/renounceRole";

describe("ERC20Factory", function () {
  let erc20: ContractFactory;
  let factory: ContractFactory;
  let factoryInstance: ERC20FactoryTest;

  beforeEach(async function () {
    erc20 = await ethers.getContractFactory("ERC20ACBCS");
    factory = await ethers.getContractFactory("ERC20FactoryTest");
    [this.owner, this.receiver, this.stranger] = await ethers.getSigners();

    factoryInstance = (await factory.deploy()) as ERC20FactoryTest;

    this.contractInstance = factoryInstance;
  });

  shouldHaveRole(DEFAULT_ADMIN_ROLE);
  shouldGetRoleAdmin(DEFAULT_ADMIN_ROLE, PAUSER_ROLE);
  shouldGrantRole();
  shouldRevokeRole();
  shouldRenounceRole();

  describe("deployERC20Token", function () {
    it("should deploy contract SIMPLE", async function () {
      const tx = await factoryInstance.deployERC20Token("SIMPLE", tokenName, tokenSymbol, amount);

      const [token] = await factoryInstance.allERC20Tokens();

      await expect(tx)
        .to.emit(factoryInstance, "ERC20Deployed")
        .withArgs(token, "SIMPLE", tokenName, tokenSymbol, amount);

      const erc20Instance = erc20.attach(token);

      const hasRole1 = await erc20Instance.hasRole(DEFAULT_ADMIN_ROLE, factoryInstance.address);
      expect(hasRole1).to.equal(false);

      const hasRole2 = await erc20Instance.hasRole(DEFAULT_ADMIN_ROLE, this.owner.address);
      expect(hasRole2).to.equal(true);
    });

    it("should deploy contract PERMIT", async function () {
      const tx = await factoryInstance.deployERC20Token("PERMIT", tokenName, tokenSymbol, amount);

      const [token] = await factoryInstance.allERC20Tokens();

      await expect(tx)
        .to.emit(factoryInstance, "ERC20Deployed")
        .withArgs(token, "PERMIT", tokenName, tokenSymbol, amount);
    });

    it("should fail: cap is 0", async function () {
      const tx = factoryInstance.deployERC20Token("SIMPLE", tokenName, tokenSymbol, amount);

      await expect(tx).to.be.revertedWith("ERC20Capped: cap is 0");
    });

    it("should fail: unknown template", async function () {
      const tx = factoryInstance.deployERC20Token("UNKNOWN", tokenName, tokenSymbol, amount);

      await expect(tx).to.be.revertedWith("ERC20Factory: unknown template");
    });
  });
});

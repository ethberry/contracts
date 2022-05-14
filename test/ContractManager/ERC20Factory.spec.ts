import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";

import { ERC20Factory } from "../../typechain-types";
import { amount, DEFAULT_ADMIN_ROLE, PAUSER_ROLE, tokenName, tokenSymbol } from "../constants";

import { shouldHaveRole } from "../shared/accessControl/hasRoles";
import { shouldGetRoleAdmin } from "../shared/accessControl/getRoleAdmin";
import { shouldGrantRole } from "../shared/accessControl/grantRole";
import { shouldRevokeRole } from "../shared/accessControl/revokeRole";
import { shouldRenounceRole } from "../shared/accessControl/renounceRole";

describe("ERC20Factory", function () {
  let erc20: ContractFactory;
  let factory: ContractFactory;
  let factoryInstance: ERC20Factory;

  beforeEach(async function () {
    erc20 = await ethers.getContractFactory("ERC20ACBCS");
    factory = await ethers.getContractFactory("ERC20Factory");
    [this.owner, this.receiver, this.stranger] = await ethers.getSigners();

    factoryInstance = (await factory.deploy()) as ERC20Factory;

    this.contractInstance = factoryInstance;
  });

  shouldHaveRole(DEFAULT_ADMIN_ROLE);
  shouldGetRoleAdmin(DEFAULT_ADMIN_ROLE, PAUSER_ROLE);
  shouldGrantRole();
  shouldRevokeRole();
  shouldRenounceRole();

  describe("deployERC20Token", function () {
    it("should deploy contract", async function () {
      const tx = await factoryInstance.deployERC20Token(erc20.bytecode, tokenName, tokenSymbol, amount);

      const [addr] = await factoryInstance.allERC20Tokens();

      await expect(tx).to.emit(factoryInstance, "ERC20Deployed").withArgs(addr, tokenName, tokenSymbol, amount);

      const erc20Instance = erc20.attach(addr);

      const hasRole1 = await erc20Instance.hasRole(DEFAULT_ADMIN_ROLE, factoryInstance.address);
      expect(hasRole1).to.equal(false);

      const hasRole2 = await erc20Instance.hasRole(DEFAULT_ADMIN_ROLE, this.owner.address);
      expect(hasRole2).to.equal(true);

      const tx2 = erc20Instance.mint(this.receiver.address, amount);
      await expect(tx2)
        .to.emit(erc20Instance, "Transfer")
        .withArgs(ethers.constants.AddressZero, this.receiver.address, amount);

      const balance = await erc20Instance.balanceOf(this.receiver.address);
      expect(balance).to.equal(amount);
    });
  });
});

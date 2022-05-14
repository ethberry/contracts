import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";
import { time } from "@openzeppelin/test-helpers";

import { ERC20ACB, VestingFactory } from "../../typechain-types";
import { amount, DEFAULT_ADMIN_ROLE, PAUSER_ROLE, tokenName, tokenSymbol } from "../constants";

import { shouldHaveRole } from "../shared/accessControl/hasRoles";
import { shouldGetRoleAdmin } from "../shared/accessControl/getRoleAdmin";
import { shouldGrantRole } from "../shared/accessControl/grantRole";
import { shouldRevokeRole } from "../shared/accessControl/revokeRole";
import { shouldRenounceRole } from "../shared/accessControl/renounceRole";

describe("VestingFactory", function () {
  let vesting: ContractFactory;
  let factory: ContractFactory;
  let factoryInstance: VestingFactory;
  let erc20: ContractFactory;
  let erc20Instance: ERC20ACB;

  beforeEach(async function () {
    vesting = await ethers.getContractFactory("FlatVesting");
    factory = await ethers.getContractFactory("VestingFactory");
    erc20 = await ethers.getContractFactory("ERC20ACB");
    [this.owner, this.receiver, this.stranger] = await ethers.getSigners();

    factoryInstance = (await factory.deploy()) as VestingFactory;
    erc20Instance = (await erc20.deploy(tokenName, tokenSymbol)) as ERC20ACB;

    await erc20Instance.mint(this.owner.address, amount);
    await erc20Instance.approve(factoryInstance.address, amount);

    this.contractInstance = factoryInstance;
  });

  shouldHaveRole(DEFAULT_ADMIN_ROLE);
  shouldGetRoleAdmin(DEFAULT_ADMIN_ROLE, PAUSER_ROLE);
  shouldGrantRole();
  shouldRevokeRole();
  shouldRenounceRole();

  describe("deployVesting", function () {
    it("should deploy contract", async function () {
      const span = 300;
      const timestamp: number = (await time.latest()).toNumber();

      const tx = await factoryInstance.deployVesting(vesting.bytecode, this.receiver.address, timestamp, span);

      const [addr] = await factoryInstance.allVesting();

      await expect(tx)
        .to.emit(factoryInstance, "VestingDeployed")
        .withArgs(addr, this.receiver.address, timestamp, span);
    });
  });
});

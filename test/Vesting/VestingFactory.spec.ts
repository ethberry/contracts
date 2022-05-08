import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";
import { time } from "@openzeppelin/test-helpers";

import { VestingFactory, ERC20ACB } from "../../typechain-types";
import { amount, DEFAULT_ADMIN_ROLE, PAUSER_ROLE, tokenName, tokenSymbol } from "../constants";

import { shouldHaveRole } from "../shared/accessControl/hasRoles";
import { shouldGetRoleAdmin } from "../shared/accessControl/getRoleAdmin";
import { shouldGrantRole } from "../shared/accessControl/grantRole";
import { shouldRevokeRole } from "../shared/accessControl/revokeRole";
import { shouldRenounceRole } from "../shared/accessControl/renounceRole";
import { shouldPause } from "../shared/pausable";

describe("AuctionFactory", function () {
  let factory: ContractFactory;
  let factoryInstance: VestingFactory;
  let erc20: ContractFactory;
  let erc20Instance: ERC20ACB;

  beforeEach(async function () {
    factory = await ethers.getContractFactory("VestingFactory");
    erc20 = await ethers.getContractFactory("ERC20ACB");
    [this.owner, this.receiver, this.stranger] = await ethers.getSigners();

    factoryInstance = (await factory.deploy()) as VestingFactory;
    erc20Instance = (await erc20.deploy(tokenName, tokenSymbol)) as ERC20ACB;

    await erc20Instance.mint(this.owner.address, amount);
    await erc20Instance.approve(factoryInstance.address, amount);

    this.contractInstance = factoryInstance;
  });

  shouldHaveRole(DEFAULT_ADMIN_ROLE, PAUSER_ROLE);
  shouldGetRoleAdmin(DEFAULT_ADMIN_ROLE, PAUSER_ROLE);
  shouldGrantRole();
  shouldRevokeRole();
  shouldRenounceRole();
  shouldPause(true);

  describe("createVesting", function () {
    it("should create auction", async function () {
      const span = 300;
      const timestamp: number = (await time.latest()).toNumber();

      const tx = factoryInstance.createFlatVesting(
        erc20Instance.address,
        amount,
        this.receiver.address,
        timestamp,
        span,
      );

      const [vesting] = await factoryInstance.allVesting();

      await expect(tx)
        .to.emit(factoryInstance, "FlatVestingCreated")
        .withArgs(vesting, this.owner.address, erc20Instance.address, amount, this.receiver.address, timestamp, span);

      const ownerOf = await erc20Instance.balanceOf(vesting);
      expect(ownerOf).to.equal(amount);
    });
  });
});

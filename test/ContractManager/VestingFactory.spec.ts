import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";
import { time } from "@openzeppelin/test-helpers";
import { Network } from "@ethersproject/networks";

import { VestingFactory } from "../../typechain-types";
import { DEFAULT_ADMIN_ROLE, nonce, PAUSER_ROLE, templateId } from "../constants";

import { shouldHaveRole } from "../shared/accessControl/hasRoles";
import { shouldGetRoleAdmin } from "../shared/accessControl/getRoleAdmin";
import { shouldGrantRole } from "../shared/accessControl/grantRole";
import { shouldRevokeRole } from "../shared/accessControl/revokeRole";
import { shouldRenounceRole } from "../shared/accessControl/renounceRole";

describe("VestingFactory", function () {
  let vesting: ContractFactory;
  let factory: ContractFactory;
  let factoryInstance: VestingFactory;
  let network: Network;

  beforeEach(async function () {
    vesting = await ethers.getContractFactory("CliffVesting");
    factory = await ethers.getContractFactory("VestingFactory");
    [this.owner, this.receiver, this.stranger] = await ethers.getSigners();

    factoryInstance = (await factory.deploy()) as VestingFactory;

    network = await ethers.provider.getNetwork();

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

      const signature = await this.owner._signTypedData(
        // Domain
        {
          name: "ContractManager",
          version: "1.0.0",
          chainId: network.chainId,
          verifyingContract: factoryInstance.address,
        },
        // Types
        {
          EIP712: [
            { name: "nonce", type: "bytes32" },
            { name: "bytecode", type: "bytes" },
            { name: "account", type: "address" },
            { name: "startTimestamp", type: "uint64" },
            { name: "duration", type: "uint64" },
            { name: "templateId", type: "uint256" },
          ],
        },
        // Value
        {
          nonce,
          bytecode: vesting.bytecode,
          account: this.receiver.address,
          startTimestamp: timestamp,
          duration: span,
          templateId,
        },
      );

      const tx = await factoryInstance.deployVesting(
        nonce,
        vesting.bytecode,
        this.receiver.address,
        timestamp,
        span,
        templateId,
        this.owner.address,
        signature,
      );

      const [address] = await factoryInstance.allVesting();

      await expect(tx)
        .to.emit(factoryInstance, "VestingDeployed")
        .withArgs(address, this.receiver.address, timestamp, span, templateId);
    });
  });
});

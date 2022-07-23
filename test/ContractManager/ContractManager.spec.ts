import { use } from "chai";
import { solidity } from "ethereum-waffle";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";

import { ContractManager } from "../../typechain-types";
import { DEFAULT_ADMIN_ROLE } from "../constants";
import { shouldHaveRole } from "../shared/accessControl/hasRoles";
import { shouldGetRoleAdmin } from "../shared/accessControl/getRoleAdmin";
import { shouldGrantRole } from "../shared/accessControl/grantRole";
import { shouldRevokeRole } from "../shared/accessControl/revokeRole";
import { shouldRenounceRole } from "../shared/accessControl/renounceRole";

use(solidity);

describe("ContractManager", function () {
  let manager: ContractFactory;
  let managerInstance: ContractManager;

  beforeEach(async function () {
    manager = await ethers.getContractFactory("ContractManager");
    [this.owner, this.receiver] = await ethers.getSigners();

    managerInstance = (await manager.deploy()) as ContractManager;

    this.contractInstance = managerInstance;
  });

  shouldHaveRole(DEFAULT_ADMIN_ROLE);
  shouldGetRoleAdmin(DEFAULT_ADMIN_ROLE);
  shouldGrantRole();
  shouldRevokeRole();
  shouldRenounceRole();
});

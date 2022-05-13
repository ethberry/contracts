import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";

import { ERC1155Factory } from "../../typechain-types";
import { baseTokenURI, DEFAULT_ADMIN_ROLE, PAUSER_ROLE } from "../constants";

import { shouldHaveRole } from "../shared/accessControl/hasRoles";
import { shouldGetRoleAdmin } from "../shared/accessControl/getRoleAdmin";
import { shouldGrantRole } from "../shared/accessControl/grantRole";
import { shouldRevokeRole } from "../shared/accessControl/revokeRole";
import { shouldRenounceRole } from "../shared/accessControl/renounceRole";

describe("ERC1155Factory", function () {
  let erc1155: ContractFactory;
  let factory: ContractFactory;
  let factoryInstance: ERC1155Factory;

  beforeEach(async function () {
    erc1155 = await ethers.getContractFactory("ERC1155ACBS");
    factory = await ethers.getContractFactory("ERC1155Factory");
    [this.owner, this.receiver, this.stranger] = await ethers.getSigners();

    factoryInstance = (await factory.deploy()) as ERC1155Factory;

    this.contractInstance = factoryInstance;
  });

  shouldHaveRole(DEFAULT_ADMIN_ROLE);
  shouldGetRoleAdmin(DEFAULT_ADMIN_ROLE, PAUSER_ROLE);
  shouldGrantRole();
  shouldRevokeRole();
  shouldRenounceRole();

  describe("deployERC1155Token", function () {
    it("should deploy contract SIMPLE", async function () {
      const tx = await factoryInstance.deployERC1155Token("SIMPLE", baseTokenURI);

      const [token] = await factoryInstance.allERC1155Tokens();

      await expect(tx).to.emit(factoryInstance, "ERC1155Deployed").withArgs(token, "SIMPLE", baseTokenURI);

      const erc1155Instance = erc1155.attach(token);

      const hasRole1 = await erc1155Instance.hasRole(DEFAULT_ADMIN_ROLE, factoryInstance.address);
      expect(hasRole1).to.equal(false);

      const hasRole2 = await erc1155Instance.hasRole(DEFAULT_ADMIN_ROLE, this.owner.address);
      expect(hasRole2).to.equal(true);
    });

    it("should fail: unknown template", async function () {
      const tx = factoryInstance.deployERC1155Token("UNKNOWN", baseTokenURI);

      await expect(tx).to.be.revertedWith("ERC1155Factory: unknown template");
    });
  });
});

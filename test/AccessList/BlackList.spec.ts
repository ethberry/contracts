import { expect, use } from "chai";
import { solidity } from "ethereum-waffle";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";

import { BlackListTest } from "../../typechain-types";
import { DEFAULT_ADMIN_ROLE } from "../constants";
import { shouldHaveRole } from "../shared/accessControl/hasRoles";
import { shouldGetRoleAdmin } from "../shared/accessControl/getRoleAdmin";
import { shouldGrantRole } from "../shared/accessControl/grantRole";
import { shouldRevokeRole } from "../shared/accessControl/revokeRole";
import { shouldRenounceRole } from "../shared/accessControl/renounceRole";

use(solidity);

describe("BlackList", function () {
  let contract: ContractFactory;

  beforeEach(async function () {
    contract = await ethers.getContractFactory("BlackListTest");
    [this.owner, this.receiver] = await ethers.getSigners();

    this.contractInstance = (await contract.deploy()) as BlackListTest;
  });

  shouldHaveRole(DEFAULT_ADMIN_ROLE);
  shouldGetRoleAdmin(DEFAULT_ADMIN_ROLE);
  shouldGrantRole();
  shouldRevokeRole();
  shouldRenounceRole();

  describe("Black list", function () {
    it("should fail: no admin role", async function () {
      const tx = this.contractInstance.connect(this.receiver).blacklist(this.receiver.address);
      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${this.receiver.address.toLowerCase()} is missing role ${DEFAULT_ADMIN_ROLE}`,
      );
    });

    it("should check black list", async function () {
      const isBlackListed = await this.contractInstance.isBlacklisted(this.receiver.address);
      expect(isBlackListed).to.equal(false);
    });

    it("should add to black list", async function () {
      const tx = this.contractInstance.blacklist(this.receiver.address);
      await expect(tx).to.emit(this.contractInstance, "Blacklisted").withArgs(this.receiver.address);
      const isBlackListed = await this.contractInstance.isBlacklisted(this.receiver.address);
      expect(isBlackListed).to.equal(true);
    });

    it("should delete from black list", async function () {
      await this.contractInstance.blacklist(this.receiver.address);
      const tx = this.contractInstance.unBlacklist(this.receiver.address);
      await expect(tx).to.emit(this.contractInstance, "UnBlacklisted").withArgs(this.receiver.address);
      const isBlackListed = await this.contractInstance.isBlacklisted(this.receiver.address);
      expect(isBlackListed).to.equal(false);
    });

    it("should fail: blacklisted", async function () {
      await this.contractInstance.blacklist(this.receiver.address);
      const tx = this.contractInstance.connect(this.receiver).testMe();
      await expect(tx).to.be.revertedWith(`BlackListError`).withArgs(this.receiver.address);
    });

    it("should pass", async function () {
      const result = await this.contractInstance.connect(this.receiver).testMe();
      expect(result).to.equal(true);
    });
  });
});

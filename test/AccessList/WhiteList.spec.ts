import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";

import { WhiteListTest } from "../../typechain-types";
import { DEFAULT_ADMIN_ROLE } from "../constants";

import { shouldHaveRole } from "../shared/accessControl/hasRoles";
import { shouldGetRoleAdmin } from "../shared/accessControl/getRoleAdmin";
import { shouldGrantRole } from "../shared/accessControl/grantRole";
import { shouldRevokeRole } from "../shared/accessControl/revokeRole";
import { shouldRenounceRole } from "../shared/accessControl/renounceRole";

describe("WhiteList", function () {
  let contract: ContractFactory;

  beforeEach(async function () {
    contract = await ethers.getContractFactory("WhiteListTest");
    [this.owner, this.receiver] = await ethers.getSigners();

    this.contractInstance = (await contract.deploy()) as WhiteListTest;
  });

  shouldHaveRole(DEFAULT_ADMIN_ROLE);
  shouldGetRoleAdmin(DEFAULT_ADMIN_ROLE);
  shouldGrantRole();
  shouldRevokeRole();
  shouldRenounceRole();

  describe("White list", function () {
    it("should fail: no admin role", async function () {
      const tx = this.contractInstance.connect(this.receiver).whitelist(this.receiver.address);
      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${this.receiver.address.toLowerCase()} is missing role ${DEFAULT_ADMIN_ROLE}`,
      );
    });

    it("should check white list", async function () {
      const isWhitelisted = await this.contractInstance.isWhitelisted(this.receiver.address);
      expect(isWhitelisted).to.equal(false);
    });

    it("should add to white list", async function () {
      const tx = this.contractInstance.whitelist(this.receiver.address);
      await expect(tx).to.emit(this.contractInstance, "Whitelisted").withArgs(this.receiver.address);
      const isWhitelisted = await this.contractInstance.isWhitelisted(this.receiver.address);
      expect(isWhitelisted).to.equal(true);
    });

    it("should delete from black list", async function () {
      await this.contractInstance.whitelist(this.receiver.address);
      const tx = this.contractInstance.unWhitelist(this.receiver.address);
      await expect(tx).to.emit(this.contractInstance, "UnWhitelisted").withArgs(this.receiver.address);
      const isWhiteListed = await this.contractInstance.isWhitelisted(this.receiver.address);
      expect(isWhiteListed).to.equal(false);
    });

    it("should fail: tests method", async function () {
      const tx = this.contractInstance.connect(this.receiver).testMe();
      await expect(tx).to.be.revertedWith(`WhiteListError`).withArgs(this.receiver.address);
    });

    it("should pass", async function () {
      await this.contractInstance.whitelist(this.receiver.address);
      const result = await this.contractInstance.connect(this.receiver).testMe();
      expect(result).to.equal(true);
    });
  });
});

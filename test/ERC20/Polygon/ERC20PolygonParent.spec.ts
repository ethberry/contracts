import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";

import { ERC20PolygonParentMock } from "../../../typechain-types";
import { amount, DEFAULT_ADMIN_ROLE, PREDICATE_ROLE, tokenName, tokenSymbol } from "../../constants";
import { shouldHaveRole } from "../../shared/accessControl/hasRoles";
import { shouldGetRoleAdmin } from "../../shared/accessControl/getRoleAdmin";
import { shouldGrantRole } from "../../shared/accessControl/grantRole";
import { shouldRevokeRole } from "../../shared/accessControl/revokeRole";
import { shouldRenounceRole } from "../../shared/accessControl/renounceRole";

describe("ERC20PolygonParentMock", function () {
  let erc20: ContractFactory;
  let erc20Instance: ERC20PolygonParentMock;

  beforeEach(async function () {
    erc20 = await ethers.getContractFactory("ERC20PolygonParentMock");
    [this.owner, this.receiver] = await ethers.getSigners();

    erc20Instance = (await erc20.deploy(tokenName, tokenSymbol)) as ERC20PolygonParentMock;

    this.contractInstance = erc20Instance;
  });

  shouldHaveRole(DEFAULT_ADMIN_ROLE, PREDICATE_ROLE);
  shouldGetRoleAdmin(DEFAULT_ADMIN_ROLE, PREDICATE_ROLE);
  shouldGrantRole();
  shouldRevokeRole();
  shouldRenounceRole();

  describe("Deployment", function () {
    it("Should assign the total supply of tokens to the owner", async function () {
      const totalSupply = await erc20Instance.totalSupply();
      expect(totalSupply).to.equal(0);
      const ownerBalance = await erc20Instance.balanceOf(this.owner.address);
      expect(ownerBalance).to.equal(0);
    });
  });

  describe("Mint", function () {
    it("should fail: account is missing role", async function () {
      const tx = erc20Instance.connect(this.receiver).mint(this.receiver.address, amount);
      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${this.receiver.address.toLowerCase()} is missing role ${PREDICATE_ROLE}`,
      );
    });

    it("should mint more tokens", async function () {
      await erc20Instance.mint(this.owner.address, amount);
      const balance = await erc20Instance.balanceOf(this.owner.address);
      expect(balance).to.equal(amount);
      const totalSupply = await erc20Instance.totalSupply();
      expect(totalSupply).to.equal(amount);
    });
  });
});

import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";

import { ERC721Factory } from "../../typechain-types";
import { baseTokenURI, DEFAULT_ADMIN_ROLE, PAUSER_ROLE, royaltyNumerator, tokenName, tokenSymbol } from "../constants";

import { shouldHaveRole } from "../shared/accessControl/hasRoles";
import { shouldGetRoleAdmin } from "../shared/accessControl/getRoleAdmin";
import { shouldGrantRole } from "../shared/accessControl/grantRole";
import { shouldRevokeRole } from "../shared/accessControl/revokeRole";
import { shouldRenounceRole } from "../shared/accessControl/renounceRole";

describe("ERC721Factory", function () {
  let erc721: ContractFactory;
  let factory: ContractFactory;
  let factoryInstance: ERC721Factory;

  beforeEach(async function () {
    erc721 = await ethers.getContractFactory("ERC721ACBER");
    factory = await ethers.getContractFactory("ERC721Factory");
    [this.owner, this.receiver, this.stranger] = await ethers.getSigners();

    factoryInstance = (await factory.deploy()) as ERC721Factory;

    this.contractInstance = factoryInstance;
  });

  shouldHaveRole(DEFAULT_ADMIN_ROLE);
  shouldGetRoleAdmin(DEFAULT_ADMIN_ROLE, PAUSER_ROLE);
  shouldGrantRole();
  shouldRevokeRole();
  shouldRenounceRole();

  describe("deployERC721Token", function () {
    it("should deploy contract SIMPLE", async function () {
      const tx = await factoryInstance.deployERC721Token(
        "SIMPLE",
        tokenName,
        tokenSymbol,
        baseTokenURI,
        royaltyNumerator,
      );

      const [token] = await factoryInstance.allERC721Tokens();

      await expect(tx)
        .to.emit(factoryInstance, "ERC721Deployed")
        .withArgs(token, "SIMPLE", tokenName, tokenSymbol, baseTokenURI, royaltyNumerator);

      const erc721Instance = erc721.attach(token);

      const hasRole1 = await erc721Instance.hasRole(DEFAULT_ADMIN_ROLE, factoryInstance.address);
      expect(hasRole1).to.equal(false);

      const hasRole2 = await erc721Instance.hasRole(DEFAULT_ADMIN_ROLE, this.owner.address);
      expect(hasRole2).to.equal(true);
    });

    it("should deploy contract RANDOM", async function () {
      const tx = await factoryInstance.deployERC721Token(
        "RANDOM",
        tokenName,
        tokenSymbol,
        baseTokenURI,
        royaltyNumerator,
      );

      const [token] = await factoryInstance.allERC721Tokens();

      await expect(tx)
        .to.emit(factoryInstance, "ERC721Deployed")
        .withArgs(token, "RANDOM", tokenName, tokenSymbol, baseTokenURI, royaltyNumerator);
    });

    it("should fail: unknown template", async function () {
      const tx = factoryInstance.deployERC721Token("UNKNOWN", tokenName, tokenSymbol, baseTokenURI, royaltyNumerator);

      await expect(tx).to.be.revertedWith("ERC721Factory: unknown template");
    });
  });
});

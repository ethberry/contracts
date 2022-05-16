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
    it("should deploy contract", async function () {
      const tx = await factoryInstance.deployERC721Token(
        erc721.bytecode,
        tokenName,
        tokenSymbol,
        baseTokenURI,
        royaltyNumerator,
      );

      const [address] = await factoryInstance.allERC721Tokens();

      await expect(tx)
        .to.emit(factoryInstance, "ERC721Deployed")
        .withArgs(address, tokenName, tokenSymbol, baseTokenURI, royaltyNumerator);

      const erc721Instance = erc721.attach(address);

      const hasRole1 = await erc721Instance.hasRole(DEFAULT_ADMIN_ROLE, factoryInstance.address);
      expect(hasRole1).to.equal(false);

      const hasRole2 = await erc721Instance.hasRole(DEFAULT_ADMIN_ROLE, this.owner.address);
      expect(hasRole2).to.equal(true);

      const tx2 = erc721Instance.safeMint(this.receiver.address);
      await expect(tx2)
        .to.emit(erc721Instance, "Transfer")
        .withArgs(ethers.constants.AddressZero, this.receiver.address, 0);

      const balance = await erc721Instance.balanceOf(this.receiver.address);
      expect(balance).to.equal(1);

      const uri = await erc721Instance.tokenURI(0);
      expect(uri).to.equal(`${baseTokenURI}0`);
    });
  });
});

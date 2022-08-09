import { expect, use } from "chai";
import { solidity } from "ethereum-waffle";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";
import { Network } from "@ethersproject/networks";

import { ERC998Factory } from "../../typechain-types";
import {
  baseTokenURI,
  DEFAULT_ADMIN_ROLE,
  nonce,
  PAUSER_ROLE,
  royalty,
  featureIds,
  tokenId,
  tokenName,
  tokenSymbol,
} from "../constants";

import { shouldHaveRole } from "../shared/accessControl/hasRoles";
import { shouldGetRoleAdmin } from "../shared/accessControl/getRoleAdmin";
import { shouldGrantRole } from "../shared/accessControl/grantRole";
import { shouldRevokeRole } from "../shared/accessControl/revokeRole";
import { shouldRenounceRole } from "../shared/accessControl/renounceRole";

use(solidity);

describe("ERC998Factory", function () {
  let erc998: ContractFactory;
  let factory: ContractFactory;
  let factoryInstance: ERC998Factory;
  let network: Network;

  beforeEach(async function () {
    erc998 = await ethers.getContractFactory("ERC721BaseUrlTest");
    factory = await ethers.getContractFactory("ERC998Factory");
    [this.owner, this.receiver, this.stranger] = await ethers.getSigners();

    factoryInstance = (await factory.deploy()) as ERC998Factory;

    network = await ethers.provider.getNetwork();

    this.contractInstance = factoryInstance;
  });

  shouldHaveRole(DEFAULT_ADMIN_ROLE);
  shouldGetRoleAdmin(DEFAULT_ADMIN_ROLE, PAUSER_ROLE);
  shouldGrantRole();
  shouldRevokeRole();
  shouldRenounceRole();

  describe("deployERC998Token", function () {
    it("should deploy contract", async function () {
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
            { name: "name", type: "string" },
            { name: "symbol", type: "string" },
            { name: "royalty", type: "uint96" },
            { name: "baseTokenURI", type: "string" },
            { name: "featureIds", type: "uint8[]" },
          ],
        },
        // Value
        {
          nonce,
          bytecode: erc998.bytecode,
          name: tokenName,
          symbol: tokenSymbol,
          royalty,
          baseTokenURI,
          featureIds,
        },
      );

      const tx = await factoryInstance.deployERC998Token(
        nonce,
        erc998.bytecode,
        tokenName,
        tokenSymbol,
        royalty,
        baseTokenURI,
        featureIds,
        this.owner.address,
        signature,
      );

      const [address] = await factoryInstance.allERC998Tokens();

      await expect(tx)
        .to.emit(factoryInstance, "ERC998TokenDeployed")
        .withArgs(address, tokenName, tokenSymbol, royalty, baseTokenURI, featureIds);

      const erc998Instance = erc998.attach(address);

      const hasRole1 = await erc998Instance.hasRole(DEFAULT_ADMIN_ROLE, factoryInstance.address);
      expect(hasRole1).to.equal(false);

      const hasRole2 = await erc998Instance.hasRole(DEFAULT_ADMIN_ROLE, this.owner.address);
      expect(hasRole2).to.equal(true);

      const tx2 = erc998Instance.safeMint(this.receiver.address, tokenId);
      await expect(tx2)
        .to.emit(erc998Instance, "Transfer")
        .withArgs(ethers.constants.AddressZero, this.receiver.address, tokenId);

      const balance = await erc998Instance.balanceOf(this.receiver.address);
      expect(balance).to.equal(1);

      const uri = await erc998Instance.tokenURI(tokenId);
      expect(uri).to.equal(`${baseTokenURI}/${erc998Instance.address.toLowerCase()}/${tokenId}`);
    });
  });
});

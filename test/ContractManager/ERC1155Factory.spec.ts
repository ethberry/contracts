import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";
import { Network } from "@ethersproject/networks";

import { ERC1155Factory } from "../../typechain-types";
import { amount, baseTokenURI, DEFAULT_ADMIN_ROLE, nonce, PAUSER_ROLE, templateId, tokenId } from "../constants";

import { shouldHaveRole } from "../shared/accessControl/hasRoles";
import { shouldGetRoleAdmin } from "../shared/accessControl/getRoleAdmin";
import { shouldGrantRole } from "../shared/accessControl/grantRole";
import { shouldRevokeRole } from "../shared/accessControl/revokeRole";
import { shouldRenounceRole } from "../shared/accessControl/renounceRole";

describe("ERC1155Factory", function () {
  let erc1155: ContractFactory;
  let factory: ContractFactory;
  let factoryInstance: ERC1155Factory;
  let network: Network;

  beforeEach(async function () {
    erc1155 = await ethers.getContractFactory("ERC1155ACBS");
    factory = await ethers.getContractFactory("ERC1155Factory");
    [this.owner, this.receiver, this.stranger] = await ethers.getSigners();

    factoryInstance = (await factory.deploy()) as ERC1155Factory;

    network = await ethers.provider.getNetwork();

    this.contractInstance = factoryInstance;
  });

  shouldHaveRole(DEFAULT_ADMIN_ROLE);
  shouldGetRoleAdmin(DEFAULT_ADMIN_ROLE, PAUSER_ROLE);
  shouldGrantRole();
  shouldRevokeRole();
  shouldRenounceRole();

  describe("deployERC1155Token", function () {
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
            { name: "baseTokenURI", type: "string" },
            { name: "templateId", type: "uint256" },
          ],
        },
        // Value
        {
          nonce,
          bytecode: erc1155.bytecode,
          baseTokenURI,
          templateId,
        },
      );

      const tx = await factoryInstance.deployERC1155Token(
        nonce,
        erc1155.bytecode,
        baseTokenURI,
        templateId,
        this.owner.address,
        signature,
      );

      const [address] = await factoryInstance.allERC1155Tokens();

      await expect(tx).to.emit(factoryInstance, "ERC1155TokenDeployed").withArgs(address, baseTokenURI, templateId);

      const erc1155Instance = erc1155.attach(address);

      const hasRole1 = await erc1155Instance.hasRole(DEFAULT_ADMIN_ROLE, factoryInstance.address);
      expect(hasRole1).to.equal(false);

      const hasRole2 = await erc1155Instance.hasRole(DEFAULT_ADMIN_ROLE, this.owner.address);
      expect(hasRole2).to.equal(true);

      const tx2 = erc1155Instance.mint(this.receiver.address, tokenId, amount, "0x");
      await expect(tx2)
        .to.emit(erc1155Instance, "TransferSingle")
        .withArgs(this.owner.address, ethers.constants.AddressZero, this.receiver.address, tokenId, amount);

      const balance = await erc1155Instance.balanceOf(this.receiver.address, tokenId);
      expect(balance).to.equal(amount);

      const uri = await erc1155Instance.uri(0);
      expect(uri).to.equal(baseTokenURI);
    });
  });
});

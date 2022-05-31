import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";

import { ERC20TokenFactory } from "../../typechain-types";
import { amount, DEFAULT_ADMIN_ROLE, nonce, PAUSER_ROLE, templateId, tokenName, tokenSymbol } from "../constants";

import { shouldHaveRole } from "../shared/accessControl/hasRoles";
import { shouldGetRoleAdmin } from "../shared/accessControl/getRoleAdmin";
import { shouldGrantRole } from "../shared/accessControl/grantRole";
import { shouldRevokeRole } from "../shared/accessControl/revokeRole";
import { shouldRenounceRole } from "../shared/accessControl/renounceRole";
import { Network } from "@ethersproject/networks";

describe("ERC20TokenFactory", function () {
  let erc20: ContractFactory;
  let factory: ContractFactory;
  let factoryInstance: ERC20TokenFactory;
  let network: Network;

  beforeEach(async function () {
    erc20 = await ethers.getContractFactory("ERC20ACBCS");
    factory = await ethers.getContractFactory("ERC20TokenFactory");
    [this.owner, this.receiver, this.stranger] = await ethers.getSigners();

    factoryInstance = (await factory.deploy()) as ERC20TokenFactory;

    network = await ethers.provider.getNetwork();

    this.contractInstance = factoryInstance;
  });

  shouldHaveRole(DEFAULT_ADMIN_ROLE);
  shouldGetRoleAdmin(DEFAULT_ADMIN_ROLE, PAUSER_ROLE);
  shouldGrantRole();
  shouldRevokeRole();
  shouldRenounceRole();

  describe("deployERC20Token", function () {
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
            { name: "cap", type: "uint256" },
            { name: "templateId", type: "uint256" },
          ],
        },
        // Value
        {
          nonce,
          bytecode: erc20.bytecode,
          name: tokenName,
          symbol: tokenSymbol,
          cap: amount,
          templateId,
        },
      );

      const tx = await factoryInstance.deployERC20Token(
        nonce,
        erc20.bytecode,
        tokenName,
        tokenSymbol,
        amount,
        templateId,
        this.owner.address,
        signature,
      );

      const [address] = await factoryInstance.allERC20Tokens();

      await expect(tx)
        .to.emit(factoryInstance, "ERC20TokenDeployed")
        .withArgs(address, tokenName, tokenSymbol, amount, templateId);

      const erc20Instance = erc20.attach(address);

      const hasRole1 = await erc20Instance.hasRole(DEFAULT_ADMIN_ROLE, factoryInstance.address);
      expect(hasRole1).to.equal(false);

      const hasRole2 = await erc20Instance.hasRole(DEFAULT_ADMIN_ROLE, this.owner.address);
      expect(hasRole2).to.equal(true);

      const tx2 = erc20Instance.mint(this.receiver.address, amount);
      await expect(tx2)
        .to.emit(erc20Instance, "Transfer")
        .withArgs(ethers.constants.AddressZero, this.receiver.address, amount);

      const balance = await erc20Instance.balanceOf(this.receiver.address);
      expect(balance).to.equal(amount);
    });
  });
});

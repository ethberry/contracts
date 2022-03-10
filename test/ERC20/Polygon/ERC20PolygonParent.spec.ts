import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { ERC20PolygonParentMock } from "../../../typechain-types";
import { amount, DEFAULT_ADMIN_ROLE, PREDICATE_ROLE, tokenName, tokenSymbol } from "../../constants";

describe("ERC20PolygonParentMock", function () {
  let erc20: ContractFactory;
  let erc20Instance: ERC20PolygonParentMock;
  let owner: SignerWithAddress;
  let receiver: SignerWithAddress;

  beforeEach(async function () {
    erc20 = await ethers.getContractFactory("ERC20PolygonParentMock");
    [owner, receiver] = await ethers.getSigners();

    erc20Instance = (await erc20.deploy(tokenName, tokenSymbol)) as ERC20PolygonParentMock;
  });

  describe("Deployment", function () {
    it("should set the right roles to deployer", async function () {
      const isAdmin = await erc20Instance.hasRole(DEFAULT_ADMIN_ROLE, owner.address);
      expect(isAdmin).to.equal(true);
      const isPredictor = await erc20Instance.hasRole(PREDICATE_ROLE, owner.address);
      expect(isPredictor).to.equal(true);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const totalSupply = await erc20Instance.totalSupply();
      expect(totalSupply).to.equal(0);
      const ownerBalance = await erc20Instance.balanceOf(owner.address);
      expect(ownerBalance).to.equal(0);
    });
  });

  describe("Mint", function () {
    it("should fail: account is missing role", async function () {
      const tx = erc20Instance.connect(receiver).mint(receiver.address, amount);
      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${PREDICATE_ROLE}`,
      );
    });

    it("should mint more tokens", async function () {
      await erc20Instance.mint(owner.address, amount);
      const balance = await erc20Instance.balanceOf(owner.address);
      expect(balance).to.equal(amount);
      const totalSupply = await erc20Instance.totalSupply();
      expect(totalSupply).to.equal(amount);
    });
  });
});

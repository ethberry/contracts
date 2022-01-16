import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { ERC20GemunionPausableTest } from "../../typechain-types";
import { amount, PAUSER_ROLE, tokenName, tokenSymbol } from "../constants";

describe("ERC20GemunionPausable", function () {
  let erc20: ContractFactory;
  let erc20Instance: ERC20GemunionPausableTest;
  let owner: SignerWithAddress;
  let receiver: SignerWithAddress;

  beforeEach(async function () {
    erc20 = await ethers.getContractFactory("ERC20GemunionPausableTest");
    [owner, receiver] = await ethers.getSigners();

    erc20Instance = (await erc20.deploy(tokenName, tokenSymbol)) as ERC20GemunionPausableTest;
  });

  describe("constructor", function () {
    it("should set the right roles to deployer", async function () {
      const isPauser = await erc20Instance.hasRole(PAUSER_ROLE, owner.address);
      expect(isPauser).to.equal(true);
    });
  });

  describe("pause", function () {
    it("should fail: not an owner", async function () {
      const tx = erc20Instance.connect(receiver).pause();
      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${PAUSER_ROLE}`,
      );

      const tx2 = erc20Instance.connect(receiver).unpause();
      await expect(tx2).to.be.revertedWith(
        `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${PAUSER_ROLE}`,
      );
    });

    it("should pause/unpause", async function () {
      await erc20Instance.mint(owner.address, amount);

      const tx1 = erc20Instance.pause();
      await expect(tx1).to.emit(erc20Instance, "Paused").withArgs(owner.address);

      const tx2 = erc20Instance.transfer(receiver.address, amount);
      await expect(tx2).to.be.revertedWith(`ERC20Pausable: token transfer while paused`);

      const tx4 = erc20Instance.unpause();
      await expect(tx4).to.emit(erc20Instance, "Unpaused").withArgs(owner.address);

      const tx5 = erc20Instance.transfer(receiver.address, amount);
      await expect(tx5).to.not.be.reverted;

      const balanceOfOwner = await erc20Instance.balanceOf(owner.address);
      expect(balanceOfOwner).to.equal(0);
    });
  });
});

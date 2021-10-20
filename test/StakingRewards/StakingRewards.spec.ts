import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { StakingRewards, StakingRewardsErc20 } from "../../typechain";
import { initialTokenAmountInWei } from "../constants";

describe("Staking Reward", function () {
  let token: ContractFactory;
  let stakingRewards: ContractFactory;
  let tokenInstance: StakingRewardsErc20;
  let stakingRewardsInstance: StakingRewards;
  let owner: SignerWithAddress;

  beforeEach(async function () {
    token = await ethers.getContractFactory("StakingRewardsErc20");
    stakingRewards = await ethers.getContractFactory("StakingRewards");
    [owner] = await ethers.getSigners();

    tokenInstance = (await token.deploy()) as StakingRewardsErc20;
    stakingRewardsInstance = (await stakingRewards.deploy(
      tokenInstance.address,
      tokenInstance.address,
    )) as StakingRewards;

    await tokenInstance.mint(owner.address, initialTokenAmountInWei);
  });

  describe("Deployment", function () {
    it("StakingRewards should has zero balance", async function () {
      const balanceOfOwner = await tokenInstance.balanceOf(owner.address);
      expect(balanceOfOwner).to.equal(initialTokenAmountInWei);
      const balanceOfPool = await tokenInstance.balanceOf(stakingRewardsInstance.address);
      expect(balanceOfPool).to.equal(0);
      const totalSupplyOfToken = await tokenInstance.totalSupply();
      expect(totalSupplyOfToken).to.equal(initialTokenAmountInWei);
      const totalSupplyOfPool = await stakingRewardsInstance.totalSupply();
      expect(totalSupplyOfPool).to.equal(0);
    });
  });
});

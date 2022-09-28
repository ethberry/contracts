import { expect } from "chai";
import { ethers, web3 } from "hardhat";
import { time } from "@openzeppelin/test-helpers";

import { deployERC20Fixture, deployVestingFixture } from "./shared/fixture";
import { shouldHaveOwner } from "./shared/owner";
import { shouldRenounceOwnership } from "./shared/renounceOwnership";
import { shouldTransferOwnership } from "./shared/transferOwnership";
import { amount } from "../constants";

describe("CliffVesting", function () {
  const span = 2500;

  shouldHaveOwner("CliffVesting");
  shouldRenounceOwnership("CliffVesting");
  shouldTransferOwnership("CliffVesting");

  it("should release", async function () {
    const [_owner, receiver] = await ethers.getSigners();
    const { contractInstance: vestingInstance } = await deployVestingFixture("CliffVesting");

    const expectedAmounts = [0, 0, 0, 0, amount * 100, 0];

    for (const expectedAmount of expectedAmounts) {
      const releaseable = await vestingInstance["releaseable()"]();
      expect(releaseable).to.be.equal(expectedAmount);

      const tx = await vestingInstance["release()"]();
      await expect(tx).changeEtherBalances([vestingInstance, receiver], [releaseable.mul(-1), releaseable]);

      const current = await time.latest();
      await time.increaseTo(current.add(web3.utils.toBN(span)));
    }
  });

  it("should release ERC20", async function () {
    const [_owner, receiver] = await ethers.getSigners();
    const { contractInstance: vestingInstance } = await deployVestingFixture("CliffVesting");
    const { contractInstance: erc20Instance } = await deployERC20Fixture(vestingInstance);

    const expectedAmounts = [0, 0, 0, 0, amount * 100, 0];

    for (const expectedAmount of expectedAmounts) {
      const releaseable = await vestingInstance["releaseable(address)"](erc20Instance.address);
      expect(releaseable).to.be.equal(expectedAmount);

      const tx = await vestingInstance["release(address)"](erc20Instance.address);
      await expect(tx).changeTokenBalances(
        erc20Instance,
        [vestingInstance.address, receiver.address],
        [releaseable.mul(-1), releaseable],
      );

      const current = await time.latest();
      await time.increaseTo(current.add(web3.utils.toBN(span)));
    }
  });
});

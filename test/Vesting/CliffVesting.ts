import { expect } from "chai";
import { web3, ethers } from "hardhat";
import { constants } from "ethers";
import { time } from "@openzeppelin/test-helpers";

import { deployVestingFixture } from "./shared/fixture";

describe("CliffVesting", function () {
  const span = 2500;

  it("should release", async function () {
    const [_owner, receiver] = await ethers.getSigners();
    const { contractInstance } = await deployVestingFixture("CliffVesting");

    const tx1 = await contractInstance["release()"]();
    await expect(tx1).to.changeEtherBalances([contractInstance, receiver], [0, 0]);

    const current1 = await time.latest();
    await time.increaseTo(current1.add(web3.utils.toBN(span)));

    const tx2 = await contractInstance["release()"]();
    await expect(tx2).to.changeEtherBalances([contractInstance, receiver], [0, 0]);

    const current2 = await time.latest();
    await time.increaseTo(current2.add(web3.utils.toBN(span)));

    const tx3 = await contractInstance["release()"]();
    await expect(tx3).to.changeEtherBalances([contractInstance, receiver], [0, 0]);

    const current3 = await time.latest();
    await time.increaseTo(current3.add(web3.utils.toBN(span)));

    const tx4 = await contractInstance["release()"]();
    await expect(tx4).to.changeEtherBalances([contractInstance, receiver], [0, 0]);

    const current4 = await time.latest();
    await time.increaseTo(current4.add(web3.utils.toBN(span)));

    const tx5 = await contractInstance["release()"]();
    await expect(tx5).to.changeEtherBalances(
      [contractInstance, receiver],
      [constants.WeiPerEther.mul(-1), constants.WeiPerEther],
    );
  });
});

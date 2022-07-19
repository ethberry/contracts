import { expect } from "chai";
import { ethers, web3 } from "hardhat";
import { constants } from "ethers";
import { time } from "@openzeppelin/test-helpers";

import { LinearVesting } from "../../typechain-types";

describe("LinearVesting", function () {
  const span = 2500;
  let vestingInstance: LinearVesting;

  beforeEach(async function () {
    [this.owner, this.receiver] = await ethers.getSigners();

    const current = await time.latest();
    const vestingFactory = await ethers.getContractFactory("LinearVesting");
    vestingInstance = await vestingFactory.deploy(this.receiver.address, current.toNumber(), 10000);

    await this.owner.sendTransaction({
      to: vestingInstance.address,
      value: constants.WeiPerEther,
    });
  });

  it("should release", async function () {
    const tx1 = await vestingInstance["release()"]();
    await expect(tx1).to.changeEtherBalances([vestingInstance, this.receiver], [0, 0]);

    const current1 = await time.latest();
    await time.increaseTo(current1.add(web3.utils.toBN(span)));

    const tx2 = await vestingInstance["release()"]();
    await expect(tx2).to.changeEtherBalances(
      [vestingInstance, this.receiver],
      [constants.WeiPerEther.div(100).mul(25).mul(-1), constants.WeiPerEther.div(100).mul(25)],
    );

    const current2 = await time.latest();
    await time.increaseTo(current2.add(web3.utils.toBN(span)));

    const tx3 = await vestingInstance["release()"]();
    await expect(tx3).to.changeEtherBalances(
      [vestingInstance, this.receiver],
      [constants.WeiPerEther.div(100).mul(25).mul(-1), constants.WeiPerEther.div(100).mul(25)],
    );

    const current3 = await time.latest();
    await time.increaseTo(current3.add(web3.utils.toBN(span)));

    const tx4 = await vestingInstance["release()"]();
    await expect(tx4).to.changeEtherBalances(
      [vestingInstance, this.receiver],
      [constants.WeiPerEther.div(100).mul(25).mul(-1), constants.WeiPerEther.div(100).mul(25)],
    );

    const current4 = await time.latest();
    await time.increaseTo(current4.add(web3.utils.toBN(span)));

    const tx5 = await vestingInstance["release()"]();
    await expect(tx5).to.changeEtherBalances(
      [vestingInstance, this.receiver],
      [constants.WeiPerEther.div(100).mul(25).mul(-1), constants.WeiPerEther.div(100).mul(25)],
    );
  });
});

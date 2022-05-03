import { ethers, upgrades } from "hardhat";
import { expect } from "chai";

import { Dummy1, Dummy2 } from "../../typechain-types";

describe("PriceOracle", function () {
  describe("Initializable", function () {
    it("should redeploy", async function () {
      const dummy1 = await ethers.getContractFactory("Dummy1");
      const dummy2 = await ethers.getContractFactory("Dummy2");

      const dummy1Instance = (await upgrades.deployProxy(dummy1)) as Dummy1;

      const tx1 = dummy1Instance.getDummy();
      await expect(tx1).to.emit(dummy1Instance, "Dummy").withArgs(false);

      const dummy2Instance = (await upgrades.upgradeProxy(dummy1Instance.address, dummy2)) as Dummy2;

      const tx2 = dummy2Instance.getDummy();
      await expect(tx2).to.emit(dummy2Instance, "Dummy").withArgs(true);
    });
  });
});

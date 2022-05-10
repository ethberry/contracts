import { ethers, upgrades } from "hardhat";
import { expect } from "chai";

import {
  DummyBeacon1,
  DummyBeacon2,
  DummyTransparent1,
  DummyTransparent2,
  DummyUUPS1,
  DummyUUPS2,
} from "../../typechain-types";

describe("Upgradeable", function () {
  it("should redeploy (transparent)", async function () {
    const dummy1 = await ethers.getContractFactory("DummyTransparent1");
    const dummy2 = await ethers.getContractFactory("DummyTransparent2");

    const dummy1Instance = (await upgrades.deployProxy(dummy1, { kind: "transparent" })) as DummyTransparent1;

    const tx1 = dummy1Instance.getDummy();
    await expect(tx1).to.emit(dummy1Instance, "Dummy").withArgs(false);

    const dummy2Instance = (await upgrades.upgradeProxy(dummy1Instance.address, dummy2, {
      kind: "transparent",
    })) as DummyTransparent2;

    const tx2 = dummy2Instance.getDummy();
    await expect(tx2).to.emit(dummy2Instance, "Dummy").withArgs(true);
  });

  it("should redeploy (uups)", async function () {
    const dummy1 = await ethers.getContractFactory("DummyUUPS1");
    const dummy2 = await ethers.getContractFactory("DummyUUPS2");

    const dummy1Instance = (await upgrades.deployProxy(dummy1, { kind: "uups" })) as DummyUUPS1;

    const tx1 = dummy1Instance.getDummy();
    await expect(tx1).to.emit(dummy1Instance, "Dummy").withArgs(false);

    const dummy2Instance = (await upgrades.upgradeProxy(dummy1Instance.address, dummy2, {
      kind: "uups",
    })) as DummyUUPS2;

    const tx2 = dummy2Instance.getDummy();
    await expect(tx2).to.emit(dummy2Instance, "Dummy").withArgs(true);
  });

  it("should redeploy (beacon)", async function () {
    const dummy1 = await ethers.getContractFactory("DummyBeacon1");
    const dummy2 = await ethers.getContractFactory("DummyBeacon2");

    const dummyBeacon = (await upgrades.deployBeacon(dummy1)) as DummyBeacon1;
    await dummyBeacon.deployed();

    const dummy1Instance = await upgrades.deployBeaconProxy(dummyBeacon, dummy1);
    await dummy1Instance.deployed();

    const tx1 = dummy1Instance.getDummy();
    await expect(tx1).to.emit(dummy1Instance, "Dummy").withArgs(false);

    await upgrades.upgradeBeacon(dummyBeacon, dummy2);
    // eslint-disable-next-line
    const dummy2Instance = dummy2.attach(dummy1Instance.address) as DummyBeacon2;

    const tx2 = dummy2Instance.getDummy();
    await expect(tx2).to.emit(dummy2Instance, "Dummy").withArgs(true);
  });
});

import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { MindCoin, MindCoin2 } from "../../typechain";
import { DEFAULT_ADMIN_ROLE, MINTER_ROLE, PAUSER_ROLE } from "../constants";

describe("ERC20 upgrade", function () {
  let instance: MindCoin2;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    const tmpToken = await ethers.getContractFactory("MindCoin");
    const tmpInstance = (await upgrades.deployProxy(tmpToken, ["memoryOS COIN token", "MIND"])) as MindCoin;
    await tmpInstance.transfer(addr1.address, 50);
    const token = await ethers.getContractFactory("MindCoin2");
    instance = (await upgrades.upgradeProxy(tmpInstance.address, token)) as MindCoin2;
  });

  describe("Upgrade", function () {
    it("Should preserve roles", async function () {
      expect(await instance.hasRole(DEFAULT_ADMIN_ROLE, owner.address)).to.equal(true);
      expect(await instance.hasRole(MINTER_ROLE, owner.address)).to.equal(true);
      expect(await instance.hasRole(PAUSER_ROLE, owner.address)).to.equal(true);
    });

    it("Should preserve token balance", async function () {
      const totalSupply = await instance.totalSupply();
      const ownerBalance = await instance.balanceOf(owner.address);
      expect(ownerBalance).to.equal(totalSupply.sub(50));
    });
  });
});

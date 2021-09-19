import { expect } from "chai";
import { ethers, upgrades } from "hardhat";

describe("ERC20 Token contract upgradable", function () {
  describe("Upgrade", function () {
    it("works before and after upgrading", async function () {
      const [owner, addr1] = await ethers.getSigners();
      const token = await ethers.getContractFactory("MindToken");
      const instance = await upgrades.deployProxy(token, ["memoryOS main token", "MIND"]);

      const totalSupply = await instance.totalSupply();
      const ownerBalance1 = await instance.balanceOf(owner.address);
      expect(ownerBalance1).to.equal(totalSupply);

      await instance.transfer(addr1.address, 50);
      const ownerBalance2 = await instance.balanceOf(owner.address);
      expect(ownerBalance2).to.equal(totalSupply.sub(50));

      const token2 = await ethers.getContractFactory("MindToken2");
      await upgrades.upgradeProxy(instance.address, token2);
      const ownerBalance3 = await instance.balanceOf(owner.address);
      expect(ownerBalance3).to.equal(totalSupply.sub(50));
    });
  });
});

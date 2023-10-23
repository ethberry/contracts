import { expect } from "chai";
import { ethers } from "hardhat";
import { WeiPerEther } from "ethers";

import { amount } from "@gemunion/contracts-constants";

import { deployERC1363 } from "../fixture";

export function shouldGetReleasable(factory: () => Promise<any>) {
  describe("releasable ETH ", function () {
    it("should get releasable (1 eth)", async function () {
      const [owner] = await ethers.getSigners();

      const contractInstance = await factory();

      const tx1 = owner.sendTransaction({
        to: await contractInstance.getAddress(),
        value: WeiPerEther,
      });
      await expect(tx1).to.emit(contractInstance, "PaymentReceived").withArgs(owner.address, WeiPerEther);

      const releasable = await contractInstance.releasable(owner);
      expect(releasable).to.equal(WeiPerEther);
    });

    it("should get releasable (0)", async function () {
      const [owner] = await ethers.getSigners();

      const contractInstance = await factory();

      const releasable = await contractInstance.releasable(owner);
      expect(releasable).to.equal(0);
    });

    it("should get releasable (0, receiver)", async function () {
      const [_owner, receiver] = await ethers.getSigners();

      const contractInstance = await factory();

      const releasable = await contractInstance.releasable(receiver);
      expect(releasable).to.equal(0);
    });
  });

  describe("releasable ERC20 ", function () {
    it("should get releasable", async function () {
      const [owner] = await ethers.getSigners();

      const contractInstance = await factory();

      const erc20Instance = await deployERC1363("ERC1363Mock");
      const tx1 = await erc20Instance.mint(contractInstance, amount);
      await expect(tx1).to.not.be.reverted;

      const releasable = await contractInstance["releasable(address,address)"](erc20Instance, owner);
      expect(releasable).to.equal(amount);
    });

    it("should get releasable (0)", async function () {
      const [owner] = await ethers.getSigners();

      const contractInstance = await factory();

      const erc20Instance = await deployERC1363("ERC1363Mock");

      const releasable = await contractInstance["releasable(address,address)"](erc20Instance, owner);
      expect(releasable).to.equal(0);
    });

    it("should get releasable (0, receiver)", async function () {
      const [_owner, receiver] = await ethers.getSigners();

      const contractInstance = await factory();

      const erc20Instance = await deployERC1363("ERC1363Mock");
      const tx1 = await erc20Instance.mint(contractInstance, amount);
      await expect(tx1).to.not.be.reverted;

      const releasable = await contractInstance["releasable(address,address)"](erc20Instance, receiver);
      expect(releasable).to.equal(0);
    });
  });
}

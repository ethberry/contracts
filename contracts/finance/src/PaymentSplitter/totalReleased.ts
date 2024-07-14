import { expect } from "chai";
import { ethers } from "hardhat";

import { amount } from "@gemunion/contracts-constants";

import { deployERC1363 } from "../fixture";

export function shouldGetTotalReleased(factory: () => Promise<any>) {
  describe("totalReleased (ETH)", function () {
    it("should get total released (0)", async function () {
      const contractInstance = await factory();

      const totalShares = await contractInstance.totalReleased();
      expect(totalShares).to.equal(0);
    });

    it("should get total released (1 eth)", async function () {
      const [owner] = await ethers.getSigners();

      const contractInstance = await factory();

      const tx1 = owner.sendTransaction({
        to: await contractInstance.getAddress(),
        value: amount,
      });
      await expect(tx1).to.emit(contractInstance, "PaymentReceived").withArgs(owner.address, amount);

      const tx2 = contractInstance.release(owner);
      await expect(tx2)
        .to.emit(contractInstance, "PaymentReleased")
        .withArgs(owner.address, amount / 2n);

      const totalShares = await contractInstance.totalReleased();
      expect(totalShares).to.equal(amount / 2n);
    });
  });

  describe("totalReleased (ERC20)", function () {
    it("should get total released (0)", async function () {
      const contractInstance = await factory();

      const erc20Instance = await deployERC1363("ERC1363Mock");
      const tx1 = await erc20Instance.mint(contractInstance, amount);
      await expect(tx1).to.not.be.reverted;

      const totalShares = await contractInstance["totalReleased(address)"](erc20Instance);
      expect(totalShares).to.equal(0);
    });

    it("should get total released (1 eth)", async function () {
      const [owner] = await ethers.getSigners();

      const contractInstance = await factory();

      const erc20Instance = await deployERC1363("ERC1363Mock");
      const tx1 = await erc20Instance.mint(contractInstance, amount);
      await expect(tx1).to.not.be.reverted;

      const tx2 = contractInstance["release(address,address)"](erc20Instance, owner);
      await expect(tx2)
        .to.emit(contractInstance, "ERC20PaymentReleased")
        .withArgs(await erc20Instance.getAddress(), owner.address, amount / 2n);

      const totalShares = await contractInstance["totalReleased(address)"](erc20Instance);
      expect(totalShares).to.equal(amount / 2n);
    });
  });
}

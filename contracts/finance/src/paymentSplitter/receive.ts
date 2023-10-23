import { expect } from "chai";
import { ethers } from "hardhat";
import { WeiPerEther } from "ethers";

import { amount } from "@gemunion/contracts-constants";

import { deployERC1363 } from "../fixture";

export function shouldReceive(factory: () => Promise<any>) {
  describe("receive ETH", function () {
    it("should receive (0)", async function () {
      const [owner] = await ethers.getSigners();

      const contractInstance = await factory();

      const tx1 = owner.sendTransaction({
        to: await contractInstance.getAddress(),
        value: 0,
      });
      await expect(tx1).to.emit(contractInstance, "PaymentReceived").withArgs(owner.address, 0);
    });

    it("should receive (1 eth)", async function () {
      const [owner] = await ethers.getSigners();

      const contractInstance = await factory();

      const tx1 = owner.sendTransaction({
        to: await contractInstance.getAddress(),
        value: WeiPerEther,
      });
      await expect(tx1).to.emit(contractInstance, "PaymentReceived").withArgs(owner.address, WeiPerEther);
    });
  });

  describe("receive ERC20", function () {
    it("should receive", async function () {
      // const [owner] = await ethers.getSigners();

      const contractInstance = await factory();

      const erc20Instance = await deployERC1363("ERC1363Mock");
      const tx1 = await erc20Instance.mint(contractInstance, amount);

      // await expect(tx1).to.emit(contractInstance, "TransferReceived").withArgs(owner.address, amount);
      await expect(tx1).to.not.be.reverted;
    });
  });
}

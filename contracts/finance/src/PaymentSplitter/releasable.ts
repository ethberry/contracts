import { expect } from "chai";
import { ethers } from "hardhat";

import { amount } from "@gemunion/contracts-constants";

import { deployERC1363 } from "../fixture";

export function shouldGetReleasable(factory: () => Promise<any>) {
  describe("releasable ETH ", function () {
    it("should get releasable (1 eth)", async function () {
      const [owner, receiver, stranger] = await ethers.getSigners();

      const contractInstance = await factory();

      const releasable1 = await contractInstance.releasable(owner);
      expect(releasable1).to.equal(0);
      const releasable2 = await contractInstance.releasable(receiver);
      expect(releasable2).to.equal(0);
      const releasable3 = await contractInstance.releasable(stranger);
      expect(releasable3).to.equal(0);

      const tx1 = owner.sendTransaction({
        to: await contractInstance.getAddress(),
        value: amount,
      });
      await expect(tx1).to.emit(contractInstance, "PaymentReceived").withArgs(owner.address, amount);

      const releasable4 = await contractInstance.releasable(owner);
      expect(releasable4).to.equal(amount / 2n);
      const releasable5 = await contractInstance.releasable(receiver);
      expect(releasable5).to.equal(amount / 2n);
      const releasable6 = await contractInstance.releasable(stranger);
      expect(releasable6).to.equal(0);
    });
  });

  describe("releasable ERC20 ", function () {
    it("should get releasable", async function () {
      const [owner, receiver, stranger] = await ethers.getSigners();

      const contractInstance = await factory();
      const erc20Instance = await deployERC1363("ERC1363Mock");

      const releasable1 = await contractInstance["releasable(address,address)"](erc20Instance, owner);
      expect(releasable1).to.equal(0);
      const releasable2 = await contractInstance["releasable(address,address)"](erc20Instance, receiver);
      expect(releasable2).to.equal(0);
      const releasable3 = await contractInstance["releasable(address,address)"](erc20Instance, stranger);
      expect(releasable3).to.equal(0);

      const tx1 = await erc20Instance.mint(contractInstance, amount);
      await expect(tx1).to.not.be.reverted;

      const releasable4 = await contractInstance["releasable(address,address)"](erc20Instance, owner);
      expect(releasable4).to.equal(amount / 2n);
      const releasable5 = await contractInstance["releasable(address,address)"](erc20Instance, receiver);
      expect(releasable5).to.equal(amount / 2n);
      const releasable6 = await contractInstance["releasable(address,address)"](erc20Instance, stranger);
      expect(releasable6).to.equal(0);
    });
  });
}

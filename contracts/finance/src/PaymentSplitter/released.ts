import { expect } from "chai";
import { ethers } from "hardhat";

import { amount } from "@gemunion/contracts-constants";
import { deployERC1363Mock } from "@gemunion/contracts-mocks";

export function shouldGetReleased(factory: () => Promise<any>) {
  describe("released ETH ", function () {
    it("should get released (1eth)", async function () {
      const [owner] = await ethers.getSigners();

      const contractInstance = await factory();

      const tx1 = owner.sendTransaction({
        to: await contractInstance.getAddress(),
        value: amount,
      });
      await expect(tx1).to.emit(contractInstance, "PaymentReceived").withArgs(owner.address, amount);

      const released1 = await contractInstance.released(owner);
      expect(released1).to.equal(0);

      const tx2 = contractInstance.release(owner);
      await expect(tx2)
        .to.emit(contractInstance, "PaymentReleased")
        .withArgs(owner.address, amount / 2n);

      const released2 = await contractInstance.released(owner);
      expect(released2).to.equal(amount / 2n);
    });

    it("should get released (0)", async function () {
      const [_owner, receiver] = await ethers.getSigners();

      const contractInstance = await factory();

      const released = await contractInstance.released(receiver);
      expect(released).to.equal(0);
    });
  });

  describe("release ERC20 ", function () {
    it("should get released (1eth)", async function () {
      const [owner] = await ethers.getSigners();

      const contractInstance = await factory();

      const erc20Instance = await deployERC1363Mock();
      const tx1 = await erc20Instance.mint(contractInstance, amount);
      await expect(tx1).to.not.be.reverted;

      const released1 = await contractInstance.released(owner);
      expect(released1).to.equal(0);

      const tx2 = contractInstance["release(address,address)"](erc20Instance, owner);
      await expect(tx2)
        .to.emit(contractInstance, "ERC20PaymentReleased")
        .withArgs(await erc20Instance.getAddress(), owner.address, amount / 2n);

      const released2 = await contractInstance["released(address,address)"](erc20Instance, owner);
      expect(released2).to.equal(amount / 2n);
    });

    it("should get released (0)", async function () {
      const [_owner, receiver] = await ethers.getSigners();

      const contractInstance = await factory();

      const erc20Instance = await deployERC1363Mock();

      const released = await contractInstance["released(address,address)"](erc20Instance, receiver);
      expect(released).to.equal(0);
    });
  });
}

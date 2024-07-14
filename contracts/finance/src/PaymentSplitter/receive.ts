import { expect } from "chai";
import { ethers } from "hardhat";
import { WeiPerEther, ZeroAddress } from "ethers";

import { amount } from "@gemunion/contracts-constants";
import { deployERC1363 } from "@gemunion/contracts-mocks";

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

  describe("receive ERC1363", function () {
    it("should receive", async function () {
      const [owner] = await ethers.getSigners();

      const contractInstance = await factory();

      const erc20Instance = await deployERC1363();
      const tx1 = await erc20Instance.mint(owner, amount);
      await expect(tx1).to.emit(erc20Instance, "Transfer").withArgs(ZeroAddress, owner.address, amount);

      const tx2 = erc20Instance.transfer(contractInstance, amount);
      await expect(tx2)
        .to.emit(erc20Instance, "Transfer")
        .withArgs(owner.address, await contractInstance.getAddress(), amount)
        .to.not.emit(contractInstance, "TransferReceived");
    });
  });
}

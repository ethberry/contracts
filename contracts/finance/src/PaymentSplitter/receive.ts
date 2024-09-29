import { expect } from "chai";
import { ethers } from "hardhat";
import { WeiPerEther, ZeroAddress } from "ethers";

import { amount } from "@ethberry/contracts-constants";
import { deployERC1363Mock } from "@ethberry/contracts-mocks";

export function shouldReceive(factory: () => Promise<any>) {
  describe("receive ETH", function () {
    it("should receive (0)", async function () {
      const [owner] = await ethers.getSigners();

      const contractInstance = await factory();

      const tx1 = owner.sendTransaction({
        to: contractInstance,
        value: 0,
      });
      await expect(tx1).to.emit(contractInstance, "PaymentReceived").withArgs(owner, 0);
    });

    it("should receive (1 eth)", async function () {
      const [owner] = await ethers.getSigners();

      const contractInstance = await factory();

      const tx1 = owner.sendTransaction({
        to: contractInstance,
        value: WeiPerEther,
      });
      await expect(tx1).to.emit(contractInstance, "PaymentReceived").withArgs(owner, WeiPerEther);
    });
  });

  describe("receive ERC1363", function () {
    it("should receive", async function () {
      const [owner] = await ethers.getSigners();

      const contractInstance = await factory();

      const erc20Instance = await deployERC1363Mock();
      const tx1 = await erc20Instance.mint(owner, amount);
      await expect(tx1).to.emit(erc20Instance, "Transfer").withArgs(ZeroAddress, owner, amount);

      const tx2 = erc20Instance.transfer(contractInstance, amount);
      await expect(tx2)
        .to.emit(erc20Instance, "Transfer")
        .withArgs(owner, contractInstance, amount)
        .to.not.emit(contractInstance, "TransferReceived");
    });
  });
}

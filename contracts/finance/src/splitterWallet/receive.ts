import { expect } from "chai";
import { ethers } from "hardhat";
import { ZeroAddress } from "ethers";

import { deployContract } from "@gemunion/contracts-mocks";
import { amount } from "@gemunion/contracts-constants";

import { deployERC1363, deployERC20 } from "../fixture";

export function shouldReceive(factory: () => Promise<any>) {
  describe("receive ERC20", function () {
    it("should receive", async function () {
      const [owner] = await ethers.getSigners();

      const contractInstance = await factory();
      const exchangeInstance = await deployContract("ExchangeMock");

      const erc20Instance = await deployERC20("ERC20Mock");
      const tx1 = await erc20Instance.mint(owner, amount);
      await expect(tx1).to.emit(erc20Instance, "Transfer").withArgs(ZeroAddress, owner.address, amount);

      const tx2 = erc20Instance.approve(exchangeInstance, amount);
      await expect(tx2)
        .to.emit(erc20Instance, "Approval")
        .withArgs(owner.address, await exchangeInstance.getAddress(), amount);

      const tx3 = exchangeInstance.spendFrom(contractInstance, erc20Instance, amount);
      await expect(tx3)
        .to.emit(erc20Instance, "Transfer")
        .withArgs(owner.address, await contractInstance.getAddress(), amount);
      await expect(tx3).to.not.emit(contractInstance, "TransferReceived");
    });
  });

  describe("receive ERC1363", function () {
    it("should receive", async function () {
      const [owner] = await ethers.getSigners();

      const contractInstance = await factory();
      const exchangeInstance = await deployContract("ExchangeMock");

      const erc20Instance = await deployERC1363("ERC1363Mock");
      const tx1 = await erc20Instance.mint(owner, amount);
      await expect(tx1).to.emit(erc20Instance, "Transfer").withArgs(ZeroAddress, owner.address, amount);

      const tx2 = erc20Instance.approve(exchangeInstance, amount);
      await expect(tx2)
        .to.emit(erc20Instance, "Approval")
        .withArgs(owner.address, await exchangeInstance.getAddress(), amount);

      const tx3 = exchangeInstance.spendFrom(contractInstance, erc20Instance, amount);
      await expect(tx3)
        .to.emit(erc20Instance, "Transfer")
        .withArgs(owner.address, await contractInstance.getAddress(), amount);
      await expect(tx3)
        .to.emit(contractInstance, "TransferReceived")
        .withArgs(await exchangeInstance.getAddress(), owner.address, amount, "0x");
    });
  });
}

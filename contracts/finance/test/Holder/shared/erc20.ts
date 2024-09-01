import { expect } from "chai";
import { ethers } from "hardhat";
import { ZeroAddress } from "ethers";

import { amount } from "@gemunion/contracts-constants";
import { deployERC20Mock } from "@gemunion/contracts-mocks";

export function shouldReceiveErc20(factory: () => Promise<any>) {
  describe("ERC20", function () {
    it("accept ERC20 token", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      const erc20Instance = await deployERC20Mock();

      const tx1 = await erc20Instance.mint(owner, amount);
      await expect(tx1).to.emit(erc20Instance, "Transfer").withArgs(ZeroAddress, owner, amount);

      const tx3 = erc20Instance.transfer(contractInstance, amount);
      await expect(tx3)
        .to.emit(erc20Instance, "Transfer")
        .withArgs(owner, contractInstance, amount)
        .to.not.emit(contractInstance, "TransferReceived");
    });
  });
}

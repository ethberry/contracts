import { expect } from "chai";
import { ethers } from "hardhat";
import { ZeroAddress } from "ethers";

import { amount } from "@gemunion/contracts-constants";
import { deployERC1363Mock } from "@gemunion/contracts-mocks";

export function shouldReceiveErc1363(factory: () => Promise<any>) {
  describe("ERC1363", function () {
    it("accept ERC1363 token", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      const erc1363Instance = await deployERC1363Mock();

      const tx1 = await erc1363Instance.mint(owner, amount);
      await expect(tx1).to.emit(erc1363Instance, "Transfer").withArgs(ZeroAddress, owner, amount);

      const tx3 = erc1363Instance.transferAndCall(contractInstance, amount);
      await expect(tx3)
        .to.emit(erc1363Instance, "Transfer")
        .withArgs(owner, contractInstance, amount)
        .to.emit(contractInstance, "TransferReceived")
        .withArgs(owner, owner, amount, "0x");
    });
  });
}

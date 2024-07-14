import { expect } from "chai";
import { ethers } from "hardhat";

import { deployContract } from "@gemunion/contracts-utils";
import { amount } from "@gemunion/contracts-constants";

describe("NativeReceiver", function () {
  const factory = () => deployContract(this.title);

  it("accept native token", async function () {
    const [owner] = await ethers.getSigners();
    const contractInstance = await factory();

    const tx = owner.sendTransaction({
      to: await contractInstance.getAddress(),
      value: amount,
      // gasLimit: 21000 + 61, // + revert
    });

    await expect(tx).to.emit(contractInstance, "PaymentReceived").withArgs(owner.address, amount);
    await expect(tx).to.changeEtherBalances([owner, contractInstance], [-amount, amount]);
  });
});

import { expect } from "chai";
import { ethers } from "hardhat";

import { deployContract } from "@ethberry/contracts-utils";
import { amount } from "@ethberry/contracts-constants";

describe("NativeRejectorMock", function () {
  const factory = () => deployContract(this.title);

  it("reject native token", async function () {
    const [owner] = await ethers.getSigners();
    const contractInstance = await factory();

    const tx = owner.sendTransaction({
      to: contractInstance,
      value: amount,
      // gasLimit: 21000 + 61, // + revert
    });

    await expect(tx).to.revertedWithCustomError(contractInstance, "PaymentRejected").withArgs(owner, amount);
  });
});

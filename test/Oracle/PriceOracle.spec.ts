import { expect, use } from "chai";
import { solidity } from "ethereum-waffle";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";

import { PriceOracle } from "../../typechain-types";

import { shouldHaveOwner } from "../shared/ownable/owner";
import { shouldTransferOwnership } from "../shared/ownable/transferOwnership";
import { shouldRenounceOwnership } from "../shared/ownable/renounceOwnership";

use(solidity);

describe("PriceOracle", function () {
  let oracle: ContractFactory;

  beforeEach(async function () {
    oracle = await ethers.getContractFactory("PriceOracle");
    [this.owner, this.receiver] = await ethers.getSigners();

    this.contractInstance = (await oracle.deploy()) as PriceOracle;
  });

  shouldHaveOwner();
  shouldTransferOwnership();
  shouldRenounceOwnership();

  describe("updatePrice", function () {
    const price = 10 ** 10;

    it("should update price", async function () {
      const tx = this.contractInstance.updatePrice(price);
      await expect(tx).to.emit(this.contractInstance, "PriceChanged").withArgs(price);
    });

    it("should fail: not an owner", async function () {
      const tx = this.contractInstance.connect(this.receiver).updatePrice(price);
      await expect(tx).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
});

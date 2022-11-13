import { expect, use } from "chai";
import { solidity } from "ethereum-waffle";
import { ethers } from "hardhat";

import { amount, DEFAULT_ADMIN_ROLE, DEPOSITOR_ROLE } from "@gemunion/contracts-test-constants";

import { shouldERC20Accessible } from "../shared/accessible";
import { deployErc20Base } from "../shared/fixtures";

use(solidity);

describe("ERC20PolygonChildMock", function () {
  const name = "ERC20PolygonChildMock";

  shouldERC20Accessible(name)(DEFAULT_ADMIN_ROLE, DEPOSITOR_ROLE);

  describe("Deposit", function () {
    it("should fail: account is missing role", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const { contractInstance } = await deployErc20Base(name);

      const tx = contractInstance
        .connect(receiver)
        .deposit(receiver.address, "0x0000000000000000000000000000000000000000000000000000000000000064");
      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${DEPOSITOR_ROLE}`,
      );
    });

    it("should mint tokens", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const { contractInstance } = await deployErc20Base(name);

      await contractInstance.mint(owner.address, amount);
      const tx = contractInstance.deposit(
        receiver.address,
        "0x0000000000000000000000000000000000000000000000000000000000000064",
      );
      await expect(tx).to.not.be.reverted;
    });
  });
});

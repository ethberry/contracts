import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

import { amount } from "@gemunion/contracts-constants";
import { deployErc20Base } from "@gemunion/contracts-erc20";

export function shouldBalanceOfERC20(factory: () => Promise<Contract>) {
  describe("balanceOfERC20", function () {
    it("should get balance of erc20 tokens", async function () {
      const [owner] = await ethers.getSigners();
      const erc721Instance = await factory();
      const erc20Instance = await deployErc20Base("ERC20ABCS");

      await erc20Instance.mint(owner.address, amount);
      await erc20Instance.approve(erc721Instance.address, amount);
      await erc721Instance.mint(owner.address); // this is edge case
      await erc721Instance.mint(owner.address);

      await erc721Instance.getERC20(owner.address, 1, erc20Instance.address, amount);

      const balance = await erc721Instance.balanceOfERC20(1, erc20Instance.address);
      expect(balance).to.equal(amount);
    });
  });
}

import { expect } from "chai";
import { ethers } from "hardhat";

import { amount } from "../../../../constants";
import { deployErc721Base } from "../../../../ERC721/shared/fixtures";
import { deployErc20Base } from "../../../../ERC20/shared/fixtures";

export function shouldBalanceOfERC20(name: string) {
  describe("balanceOfERC20", function () {
    it("should get balance of erc20 tokens", async function () {
      const [owner] = await ethers.getSigners();
      const { contractInstance: erc721Instance } = await deployErc721Base(name);
      const { contractInstance: erc20Instance } = await deployErc20Base("ERC20ABCS");

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

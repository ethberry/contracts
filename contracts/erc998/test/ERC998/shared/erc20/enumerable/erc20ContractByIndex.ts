import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

import { amount } from "@gemunion/contracts-constants";

import { deployErc20Base } from "../../../../ERC20/shared/fixtures";

export function shouldErc20ContractByIndex(factory: () => Promise<Contract>) {
  describe("erc20ContractByIndex", function () {
    it("should get erc20 contract by index", async function () {
      const [owner] = await ethers.getSigners();
      const erc721Instance = await factory();
      const erc20Instance = await deployErc20Base("ERC20ABCS");

      await erc20Instance.mint(owner.address, amount);
      await erc20Instance.approve(erc721Instance.address, amount);
      await erc721Instance.mint(owner.address); // this is edge case
      await erc721Instance.mint(owner.address);

      await erc721Instance.getERC20(owner.address, 1, erc20Instance.address, amount);

      const address = await erc721Instance.erc20ContractByIndex(1, 0);
      expect(address).to.equal(erc20Instance.address);
    });
  });
}

import { expect } from "chai";
import { amount } from "../../../../constants";
import { ethers } from "hardhat";
import { deployErc721Base } from "../../../../ERC721/shared/fixtures";
import { deployErc20Base } from "../../../../ERC20/shared/fixtures";

export function shouldErc20ContractByIndex(name: string) {
  describe("erc20ContractByIndex", function () {
    it("should get erc20 contract by index", async function () {
      const [owner] = await ethers.getSigners();
      const { contractInstance: erc721Instance } = await deployErc721Base(name);
      const { contractInstance: erc20Instance } = await deployErc20Base("ERC20ABCS");

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

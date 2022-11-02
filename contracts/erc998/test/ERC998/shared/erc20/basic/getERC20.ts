import { expect } from "chai";
import { amount } from "../../../../constants";
import { ethers } from "hardhat";
import { deployErc998Base } from "../../../../ERC721/shared/fixtures";
import { deployErc20Base } from "../../../../ERC20/shared/fixtures";

export function shouldGetERC20(name: string) {
  describe("getERC20", function () {
    it("should get erc20 tokens", async function () {
      const [owner] = await ethers.getSigners();
      const { contractInstance } = await deployErc998Base(name);
      const { contractInstance: erc20Instance } = await deployErc20Base("ERC20ABCS");

      await erc20Instance.mint(owner.address, amount);
      await erc20Instance.approve(contractInstance.address, amount);
      await contractInstance.mint(owner.address); // this is edge case
      await contractInstance.mint(owner.address);

      const tx1 = contractInstance.getERC20(owner.address, 1, erc20Instance.address, amount);
      await expect(tx1)
        .to.emit(contractInstance, "ReceivedChild")
        .withArgs(owner.address, 1, erc20Instance.address, 0, amount);
      await expect(tx1).to.emit(erc20Instance, "Transfer").withArgs(owner.address, contractInstance.address, amount);
    });
  });
}

import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

import { deployErc998Base } from "../../../test/fixtures";

export function shouldTotalChildContracts(factory: () => Promise<Contract>) {
  describe("totalChildContracts", function () {
    it("should count child contracts", async function () {
      const [owner] = await ethers.getSigners();
      const erc721Instance = await factory();
      const erc721InstanceMock = await deployErc998Base("ERC721ABCE");

      await erc721InstanceMock.mint(owner.address);
      await erc721Instance.mint(owner.address); // this is edge case
      await erc721Instance.mint(owner.address);

      const tx1 = erc721InstanceMock["safeTransferFrom(address,address,uint256,bytes)"](
        owner.address,
        erc721Instance.address,
        0, // erc721 tokenId
        "0x0000000000000000000000000000000000000000000000000000000000000001", // erc998 tokenId
      );
      await expect(tx1).to.not.be.reverted;

      const total = await erc721Instance.totalChildContracts(1);
      expect(total).to.equal(1);
    });
  });
}

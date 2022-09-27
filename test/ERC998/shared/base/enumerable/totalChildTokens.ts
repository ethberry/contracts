import { expect } from "chai";
import { ethers } from "hardhat";
import { deployErc721Base } from "../../../../ERC721/shared/fixtures";

export function shouldTotalChildTokens(name: string) {
  describe("totalChildTokens", function () {
    it("should get child contract tokens count", async function () {
      const [owner] = await ethers.getSigners();
      const { contractInstance: erc721Instance } = await deployErc721Base(name);
      const { contractInstance: erc721InstanceMock } = await deployErc721Base("ERC721ABCE");

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

      const total = await erc721Instance.totalChildTokens(1, erc721InstanceMock.address);
      expect(total).to.equal(1);
    });
  });
}

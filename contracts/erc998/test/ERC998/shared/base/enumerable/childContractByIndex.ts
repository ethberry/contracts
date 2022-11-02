import { expect } from "chai";
import { ethers } from "hardhat";
import { deployErc998Base } from "../../../../ERC721/shared/fixtures";

export function shouldChildContractByIndex(name: string) {
  describe("childContractByIndex", function () {
    it("should get child contract by index", async function () {
      const [owner] = await ethers.getSigners();
      const { contractInstance: erc721Instance } = await deployErc998Base(name);
      const { contractInstance: erc721InstanceMock } = await deployErc998Base("ERC721ABCE");

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

      const address = await erc721Instance.childContractByIndex(1, 0);
      expect(address).to.equal(erc721InstanceMock.address);
    });
  });
}

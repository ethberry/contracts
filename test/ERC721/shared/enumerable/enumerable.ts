import { expect } from "chai";
import { ethers } from "hardhat";

import { deployErc721Base, deployErc721Receiver } from "../fixtures";

export function shouldERC721Enumerable(name: string) {
  describe("tokenOfOwnerByIndex", function () {
    it("should match the token number of the owner", async function () {
      const [owner] = await ethers.getSigners();
      const { contractInstance } = await deployErc721Base(name);

      const { contractInstance: erc721ReceiverInstance } = await deployErc721Receiver();

      await contractInstance.mint(owner.address);
      const tx = contractInstance["safeTransferFrom(address,address,uint256)"](
        owner.address,
        erc721ReceiverInstance.address,
        0,
      );

      await expect(tx).to.emit(contractInstance, "Transfer").withArgs(owner.address, erc721ReceiverInstance.address, 0);

      const balanceOfOwner = await contractInstance.balanceOf(owner.address);
      expect(balanceOfOwner).to.equal(0);

      const balanceOfReceiver = await contractInstance.balanceOf(erc721ReceiverInstance.address);
      expect(balanceOfReceiver).to.equal(1);

      const item = await contractInstance.tokenOfOwnerByIndex(erc721ReceiverInstance.address, 0);
      expect(item).to.equal(0); // 0 is nft index
    });
  });
}

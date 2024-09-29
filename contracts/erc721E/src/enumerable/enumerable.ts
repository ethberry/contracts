import { expect } from "chai";
import { ethers } from "hardhat";

import { deployHolder } from "@ethberry/contracts-finance";

import type { IERC721EnumOptions } from "../shared/defaultMint";
import { defaultMintERC721 } from "../shared/defaultMint";

export function shouldBehaveLikeERC721Enumerable(factory: () => Promise<any>, options: IERC721EnumOptions = {}) {
  const { mint = defaultMintERC721 } = options;

  describe("tokenOfOwnerByIndex", function () {
    it("should match the token number of the owner", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      const erc721ReceiverInstance = await deployHolder();

      await mint(contractInstance, owner, owner);
      const tx = contractInstance.safeTransferFrom(owner, erc721ReceiverInstance, 0);

      await expect(tx).to.emit(contractInstance, "Transfer").withArgs(owner, erc721ReceiverInstance, 0);

      const balanceOfOwner = await contractInstance.balanceOf(owner);
      expect(balanceOfOwner).to.equal(0);

      const balanceOfReceiver = await contractInstance.balanceOf(erc721ReceiverInstance);
      expect(balanceOfReceiver).to.equal(1);

      const item = await contractInstance.tokenOfOwnerByIndex(erc721ReceiverInstance, 0);
      expect(item).to.equal(0); // 0 is nft index
    });
  });
}

import { expect } from "chai";
import { ethers } from "hardhat";

import { deployWallet } from "@gemunion/contracts-mocks";

import type { IERC721EnumOptions } from "../shared/defaultMint";
import { defaultMintERC721 } from "../shared/defaultMint";

export function shouldBehaveLikeERC721Enumerable(factory: () => Promise<any>, options: IERC721EnumOptions = {}) {
  const { mint = defaultMintERC721 } = options;

  describe("tokenOfOwnerByIndex", function () {
    it("should match the token number of the owner", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      const erc721ReceiverInstance = await deployWallet();
      const address = await erc721ReceiverInstance.getAddress();

      await mint(contractInstance, owner, owner.address);
      const tx = contractInstance.safeTransferFrom(owner.address, address, 0);

      await expect(tx).to.emit(contractInstance, "Transfer").withArgs(owner.address, address, 0);

      const balanceOfOwner = await contractInstance.balanceOf(owner.address);
      expect(balanceOfOwner).to.equal(0);

      const balanceOfReceiver = await contractInstance.balanceOf(address);
      expect(balanceOfReceiver).to.equal(1);

      const item = await contractInstance.tokenOfOwnerByIndex(address, 0);
      expect(item).to.equal(0); // 0 is nft index
    });
  });
}

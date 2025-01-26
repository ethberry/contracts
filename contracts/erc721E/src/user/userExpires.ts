import { expect } from "chai";
import { ethers } from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";

import type { IERC721EnumOptions } from "../shared/defaultMint";
import { defaultMintERC721 } from "../shared/defaultMint";

export function shouldUserExprires(factory: () => Promise<any>, options: IERC721EnumOptions = {}) {
  const { mint = defaultMintERC721, tokenId: defaultTokenId = 0n } = options;

  describe("userExprires", function () {
    it("should return expiration time of user", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner);

      const current = await time.latest();
      const deadline = current + 1000;
      // await time.increaseTo(current.add(web3.utils.toBN(2000)));

      await contractInstance.setUser(defaultTokenId, receiver, deadline.toString());
      const userExpires = await contractInstance.userExpires(defaultTokenId);
      expect(userExpires).to.equal(deadline.toString());
    });
  });
}

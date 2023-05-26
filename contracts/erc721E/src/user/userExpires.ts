import { expect } from "chai";
import { ethers, web3 } from "hardhat";
import { Contract } from "ethers";
import { time } from "@openzeppelin/test-helpers";

import type { IERC721EnumOptions } from "../shared/defaultMint";
import { defaultMintERC721 } from "../shared/defaultMint";

export function shouldUserExprires(factory: () => Promise<Contract>, options: IERC721EnumOptions = {}) {
  const { mint = defaultMintERC721, tokenId: defaultTokenId = 0 } = options;

  describe("userExprires", function () {
    it("should return expiration time of user", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address);

      const current = await time.latest();
      const deadline = current.add(web3.utils.toBN(1000));
      // await time.increaseTo(current.add(web3.utils.toBN(2000)));

      await contractInstance.setUser(defaultTokenId, receiver.address, deadline.toString());
      const userExpires = await contractInstance.userExpires(defaultTokenId);
      expect(userExpires).to.be.equal(deadline.toString());
    });
  });
}

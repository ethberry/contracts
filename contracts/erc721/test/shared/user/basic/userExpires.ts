import { expect } from "chai";
import { web3, ethers } from "hardhat";
import { time } from "@openzeppelin/test-helpers";

import { tokenId } from "../../../constants";
import { deployErc721Base } from "../../fixtures";

export function shouldUserExprires(name: string) {
  describe("userExprires", function () {
    it("should return expiration time of user", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const { contractInstance } = await deployErc721Base(name);

      await contractInstance.mint(owner.address, tokenId);

      const current = await time.latest();
      const deadline = current.add(web3.utils.toBN(1000));
      // await time.increaseTo(current.add(web3.utils.toBN(2000)));

      await contractInstance.setUser(tokenId, receiver.address, deadline.toString());
      const userExpires = await contractInstance.userExpires(tokenId);
      expect(userExpires).to.be.equal(deadline.toString());
    });
  });
}

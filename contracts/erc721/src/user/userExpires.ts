import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, BigNumber } from "ethers";
import { time } from "@openzeppelin/test-helpers";

import { tokenId } from "@gemunion/contracts-constants";

export function shouldUserExprires(factory: () => Promise<Contract>) {
  describe("userExprires", function () {
    it("should return expiration time of user", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await contractInstance.mint(owner.address, tokenId);

      const current = await time.latest();
      const deadline = current.add(BigNumber.from(1000));
      // await time.increaseTo(current.add(web3.utils.toBN(2000)));

      await contractInstance.setUser(tokenId, receiver.address, deadline.toString());
      const userExpires = await contractInstance.userExpires(tokenId);
      expect(userExpires).to.be.equal(deadline.toString());
    });
  });
}

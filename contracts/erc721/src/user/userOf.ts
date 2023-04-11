import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber, constants, Contract } from "ethers";
import { time } from "@openzeppelin/test-helpers";

import { tokenId } from "@gemunion/contracts-constants";

export function shouldUserOf(factory: () => Promise<Contract>) {
  describe("userOf", function () {
    it("should return 0", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await contractInstance.mint(owner.address, tokenId);

      const current = await time.latest();
      const deadline = current.sub(BigNumber.from(1));

      await contractInstance.setUser(tokenId, receiver.address, deadline.toString());
      const userOf = await contractInstance.userOf(tokenId);

      expect(userOf).to.be.equal(constants.AddressZero);
    });

    it("should return 0, when time is expired", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await contractInstance.mint(owner.address, tokenId);

      const current = await time.latest();
      const deadline = current.add(BigNumber.from(100));

      await contractInstance.setUser(tokenId, receiver.address, deadline.toString());

      const current1 = await time.latest();
      await time.increaseTo(current1.add(BigNumber.from(50)));

      const userOf1 = await contractInstance.userOf(tokenId);
      expect(userOf1).to.be.equal(receiver.address);

      const current2 = await time.latest();
      await time.increaseTo(current2.add(BigNumber.from(50)));

      const userOf2 = await contractInstance.userOf(tokenId);
      expect(userOf2).to.be.equal(constants.AddressZero);
    });

    it("Owner is still the owner of NFT", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await contractInstance.mint(owner.address, tokenId);

      const current = await time.latest();
      const deadline = current.add(BigNumber.from(100));

      await contractInstance.setUser(tokenId, receiver.address, deadline.toString());

      const ownerOfToken = await contractInstance.ownerOf(tokenId);

      expect(ownerOfToken).to.be.equal(owner.address);
    });
  });
}

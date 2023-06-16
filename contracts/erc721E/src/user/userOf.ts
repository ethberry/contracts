import { expect } from "chai";
import { ethers, web3 } from "hardhat";
import { ZeroAddress } from "ethers";
import { time } from "@openzeppelin/test-helpers";

import type { IERC721EnumOptions } from "../shared/defaultMint";
import { defaultMintERC721 } from "../shared/defaultMint";

export function shouldUserOf(factory: () => Promise<any>, options: IERC721EnumOptions = {}) {
  const { mint = defaultMintERC721, tokenId: defaultTokenId = 0n } = options;

  describe("userOf", function () {
    it("should return 0", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address);

      const current = await time.latest();
      const deadline = current.sub(web3.utils.toBN(1));

      await contractInstance.setUser(defaultTokenId, receiver.address, deadline.toString());
      const userOf = await contractInstance.userOf(defaultTokenId);

      expect(userOf).to.be.equal(ZeroAddress);
    });

    it("should return 0, when time is expired", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address);

      const current = await time.latest();
      const deadline = current.add(web3.utils.toBN(100));

      await contractInstance.setUser(defaultTokenId, receiver.address, deadline.toString());

      const current1 = await time.latest();
      await time.increaseTo(current1.add(web3.utils.toBN(50)));

      const userOf1 = await contractInstance.userOf(defaultTokenId);
      expect(userOf1).to.be.equal(receiver.address);

      const current2 = await time.latest();
      await time.increaseTo(current2.add(web3.utils.toBN(50)));

      const userOf2 = await contractInstance.userOf(defaultTokenId);
      expect(userOf2).to.be.equal(ZeroAddress);
    });

    it("Owner is still the owner of NFT", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address);

      const current = await time.latest();
      const deadline = current.add(web3.utils.toBN(100));

      await contractInstance.setUser(defaultTokenId, receiver.address, deadline.toString());

      const ownerOfToken = await contractInstance.ownerOf(defaultTokenId);

      expect(ownerOfToken).to.be.equal(owner.address);
    });
  });
}

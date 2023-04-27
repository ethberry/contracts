import { expect } from "chai";
import { ethers, web3 } from "hardhat";
import { constants, Contract } from "ethers";
import { time } from "@openzeppelin/test-helpers";
import { TMintERC721EnumFn } from "../shared/interfaces/IMintERC721EnumFn";
import { defaultMintERC721Enum } from "../shared/defaultMintERC721Enum";

export function shouldUserOf(factory: () => Promise<Contract>, mint: TMintERC721EnumFn = defaultMintERC721Enum) {
  describe("userOf", function () {
    it("should return 0", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address);

      const current = await time.latest();
      const deadline = current.sub(web3.utils.toBN(1));

      await contractInstance.setUser(0, receiver.address, deadline.toString());
      const userOf = await contractInstance.userOf(0);

      expect(userOf).to.be.equal(constants.AddressZero);
    });

    it("should return 0, when time is expired", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address);

      const current = await time.latest();
      const deadline = current.add(web3.utils.toBN(100));

      await contractInstance.setUser(0, receiver.address, deadline.toString());

      const current1 = await time.latest();
      await time.increaseTo(current1.add(web3.utils.toBN(50)));

      const userOf1 = await contractInstance.userOf(0);
      expect(userOf1).to.be.equal(receiver.address);

      const current2 = await time.latest();
      await time.increaseTo(current2.add(web3.utils.toBN(50)));

      const userOf2 = await contractInstance.userOf(0);
      expect(userOf2).to.be.equal(constants.AddressZero);
    });

    it("Owner is still the owner of NFT", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address);

      const current = await time.latest();
      const deadline = current.add(web3.utils.toBN(100));

      await contractInstance.setUser(0, receiver.address, deadline.toString());

      const ownerOfToken = await contractInstance.ownerOf(0);

      expect(ownerOfToken).to.be.equal(owner.address);
    });
  });
}

import { expect } from "chai";
import { ethers } from "hardhat";
import { ZeroAddress } from "ethers";

import type { IERC721EnumOptions } from "../shared/defaultMint";
import { defaultMintERC721 } from "../shared/defaultMint";

export function shouldBehaveLikeERC721Burnable(factory: () => Promise<any>, options: IERC721EnumOptions = {}) {
  const { mint = defaultMintERC721, tokenId: defaultTokenId = 0n, batchSize: defaultBatchSize = 0n } = options;

  describe("burn", function () {
    it("should fail: not an owner", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address);
      const tx = contractInstance.connect(receiver).burn(defaultTokenId);

      await expect(tx).to.be.revertedWith(`ERC721: caller is not token owner or approved`);
    });

    it("should burn own token", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address);
      const tx = await contractInstance.burn(defaultTokenId);

      await expect(tx).to.emit(contractInstance, "Transfer").withArgs(owner.address, ZeroAddress, defaultTokenId);

      const balanceOfOwner = await contractInstance.balanceOf(owner.address);
      expect(balanceOfOwner).to.equal(defaultBatchSize);
    });

    it("should burn approved token", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address);
      await contractInstance.approve(receiver.address, defaultTokenId);

      const tx = await contractInstance.burn(defaultTokenId);

      await expect(tx).to.emit(contractInstance, "Transfer").withArgs(owner.address, ZeroAddress, defaultTokenId);

      const balanceOfOwner = await contractInstance.balanceOf(owner.address);
      expect(balanceOfOwner).to.equal(defaultBatchSize);
    });
  });
}

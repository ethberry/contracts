import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

import type { IERC721EnumOptions } from "../shared/defaultMint";
import { defaultMintERC721 } from "../shared/defaultMint";

export function shouldBehaveLikeERC721UriStorage(factory: () => Promise<Contract>, options: IERC721EnumOptions = {}) {
  const { mint = defaultMintERC721 } = options;

  describe("tokenURI", function () {
    it("should get default token URI", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address);
      const uri = await contractInstance.tokenURI(0);
      expect(uri).to.equal("");
    });

    it("should override token URI", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      const newURI = "newURI";
      await mint(contractInstance, owner, owner.address);
      await contractInstance.setTokenURI(0, newURI);
      const uri = await contractInstance.tokenURI(0);
      expect(uri).to.equal(newURI);
    });
  });
}

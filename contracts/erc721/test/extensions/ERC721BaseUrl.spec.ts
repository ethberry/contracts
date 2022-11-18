import { expect, use } from "chai";
import { solidity } from "ethereum-waffle";
import { ethers } from "hardhat";

import { baseTokenURI, DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE, tokenId } from "@gemunion/contracts-constants";
import { shouldBeAccessible, shouldSupportsInterface } from "@gemunion/contracts-mocha";

import { deployErc721Base } from "../../src/fixtures";
import { shouldERC721Base } from "../../src/basic/base";

import { shouldERC721Burnable } from "../../src/basic/burnable/burn";
import { shouldERC721Royalty } from "../../src/basic/royalty";

use(solidity);

describe("ERC721BaseUrlTest", function () {
  const factory = () => deployErc721Base(this.title);

  shouldBeAccessible(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);

  shouldERC721Base(factory);
  shouldERC721Burnable(factory);
  shouldERC721Royalty(factory);

  describe("tokenURI", function () {
    it("should get token uri", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      await contractInstance.mint(owner.address, tokenId);
      const uri = await contractInstance.tokenURI(tokenId);
      expect(uri).to.equal(`${baseTokenURI}/${contractInstance.address.toLowerCase()}/${tokenId}`);
    });

    // setTokenURI is not supported

    it("should fail: URI query for nonexistent token", async function () {
      const contractInstance = await factory();

      const uri = contractInstance.tokenURI(tokenId);
      await expect(uri).to.be.revertedWith("ERC721: invalid token ID");
    });
  });

  describe("setBaseURI", function () {
    it("should set token uri", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      const newURI = "http://example.com/";
      await contractInstance.mint(owner.address, tokenId);
      await contractInstance.setBaseURI(newURI);
      const uri = await contractInstance.tokenURI(tokenId);
      expect(uri).to.equal(`${newURI}/${contractInstance.address.toLowerCase()}/${tokenId}`);
    });
  });

  shouldSupportsInterface(factory)(
    InterfaceId.IERC165,
    InterfaceId.IAccessControl,
    InterfaceId.IERC721,
    InterfaceId.IERC721Metadata,
    InterfaceId.IRoyalty,
  );
});

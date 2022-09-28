import { expect, use } from "chai";
import { solidity } from "ethereum-waffle";
import { ethers } from "hardhat";

import { baseTokenURI, DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE, tokenId } from "../constants";
import { shouldSupportsInterface } from "../shared/supportInterface";
import { deployErc721Base } from "./shared/fixtures";
import { shouldERC721Base } from "./shared/base/basic";
import { shouldERC721Accessible } from "./shared/accessible";
import { shouldERC721Burnable } from "./shared/burnable/basic/burn";
import { shouldERC721Royalty } from "./shared/royalty/basic";

use(solidity);

describe("ERC721BaseUrl", function () {
  const name = "ERC721BaseUrlTest";

  shouldERC721Base(name);
  shouldERC721Accessible(name)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldERC721Burnable(name);
  shouldERC721Royalty(name);

  describe("tokenURI", function () {
    it("should get token uri", async function () {
      const [owner] = await ethers.getSigners();
      const { contractInstance } = await deployErc721Base(name);

      await contractInstance.mint(owner.address, tokenId);
      const uri = await contractInstance.tokenURI(tokenId);
      expect(uri).to.equal(`${baseTokenURI}/${contractInstance.address.toLowerCase()}/${tokenId}`);
    });

    // setTokenURI is not supported

    it("should fail: URI query for nonexistent token", async function () {
      const { contractInstance } = await deployErc721Base(name);

      const uri = contractInstance.tokenURI(tokenId);
      await expect(uri).to.be.revertedWith("ERC721: invalid token ID");
    });
  });

  describe("setBaseURI", function () {
    it("should set token uri", async function () {
      const [owner] = await ethers.getSigners();
      const { contractInstance } = await deployErc721Base(name);

      const newURI = "http://example.com/";
      await contractInstance.mint(owner.address, tokenId);
      await contractInstance.setBaseURI(newURI);
      const uri = await contractInstance.tokenURI(tokenId);
      expect(uri).to.equal(`${newURI}/${contractInstance.address.toLowerCase()}/${tokenId}`);
    });
  });

  shouldSupportsInterface(name)(
    InterfaceId.IERC165,
    InterfaceId.IAccessControl,
    InterfaceId.IERC721,
    InterfaceId.IERC721Metadata,
    InterfaceId.IRoyalty,
  );
});

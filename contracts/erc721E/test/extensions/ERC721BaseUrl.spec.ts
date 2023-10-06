import { expect } from "chai";
import { ethers } from "hardhat";

import { baseTokenURI, DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE, tokenId } from "@gemunion/contracts-constants";
import { shouldBehaveLikeAccessControl } from "@gemunion/contracts-access";
import { shouldSupportsInterface } from "@gemunion/contracts-utils";

import { shouldBehaveLikeERC721, shouldBehaveLikeERC721Burnable, shouldBehaveLikeERC721Royalty } from "../../src";
import { deployERC721 } from "../../src/fixtures";

describe("ERC721BaseUrlTest", function () {
  const factory = () => deployERC721(this.title);

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);

  shouldBehaveLikeERC721(factory);
  shouldBehaveLikeERC721Burnable(factory);
  shouldBehaveLikeERC721Royalty(factory);

  describe("tokenURI", function () {
    it("should get token uri", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();
      const address = await contractInstance.getAddress();

      await contractInstance.mint(owner.address);
      const uri = await contractInstance.tokenURI(0);
      expect(uri).to.equal(`${baseTokenURI}/${address.toLowerCase()}/${0}`);
    });

    // setTokenURI is not supported

    it("should fail: URI query for nonexistent token", async function () {
      const contractInstance = await factory();

      const uri = contractInstance.tokenURI(tokenId);
      await expect(uri).to.be.revertedWithCustomError(contractInstance, "ERC721NonexistentToken").withArgs(tokenId);
    });
  });

  describe("setBaseURI", function () {
    it("should set token uri", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();
      const address = await contractInstance.getAddress();

      const newURI = "http://example.com/";
      await contractInstance.mint(owner.address);
      await contractInstance.setBaseURI(newURI);
      const uri = await contractInstance.tokenURI(0);
      expect(uri).to.equal(`${newURI}/${address.toLowerCase()}/${0}`);
    });
  });

  shouldSupportsInterface(factory)([
    InterfaceId.IERC165,
    InterfaceId.IAccessControl,
    InterfaceId.IERC721,
    InterfaceId.IERC721Metadata,
    InterfaceId.IRoyalty,
  ]);
});

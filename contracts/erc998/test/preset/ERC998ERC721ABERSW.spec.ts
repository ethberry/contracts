import { expect, use } from "chai";
import { solidity } from "ethereum-waffle";
import { ethers } from "hardhat";

import { DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE } from "@gemunion/contracts-constants";
import { shouldBeAccessible, shouldSupportsInterface } from "@gemunion/contracts-mocha";

import {
  shouldERC721Base,
  shouldERC721Burnable,
  shouldERC721Enumerable,
  shouldERC721Royalty,
  shouldERC721Storage,
} from "@gemunion/contracts-erc721";

import { shouldERC998Base, shouldWhiteListChild } from "../../src/basic";
import { deployErc998Base } from "../../src/fixtures";

use(solidity);

describe("ERC998ERC721ABERSW", function () {
  const factory = () => deployErc998Base(this.title);

  shouldBeAccessible(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);

  shouldERC721Base(factory);
  shouldERC721Burnable(factory);
  shouldERC721Enumerable(factory);
  shouldERC721Royalty(factory);
  shouldERC721Storage(factory);

  shouldERC998Base(factory);
  shouldWhiteListChild(factory);

  describe("getChild", function () {
    it("should get child", async function () {
      const [owner] = await ethers.getSigners();
      const erc721Instance = await deployErc998Base("ERC998ERC721ABERSW");
      const erc721InstanceMock = await deployErc998Base("ERC721ABCE");

      await erc721Instance.whiteListChild(erc721InstanceMock.address, 0);
      await erc721Instance.setDefaultMaxChild(0);
      await erc721InstanceMock.mint(owner.address);
      await erc721InstanceMock.approve(erc721Instance.address, 0);
      await erc721Instance.mint(owner.address); // this is edge case
      await erc721Instance.mint(owner.address);

      const tx1 = erc721Instance.getChild(owner.address, 1, erc721InstanceMock.address, 0);

      await expect(tx1).to.be.revertedWith(`CTD: this method is not supported`);
    });
  });

  shouldSupportsInterface(factory)(
    InterfaceId.IERC165,
    InterfaceId.IAccessControl,
    InterfaceId.IERC721,
    InterfaceId.IERC721Metadata,
    InterfaceId.IERC721Enumerable,
    InterfaceId.IERC998TD,
    InterfaceId.IERC998WL,
    InterfaceId.IRoyalty,
  );
});

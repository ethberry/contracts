import { expect, use } from "chai";
import { solidity } from "ethereum-waffle";
import { ethers } from "hardhat";

import { DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE } from "@gemunion/contracts-constants";
import { shouldBeAccessible, shouldSupportsInterface } from "@gemunion/contracts-mocha";

import { shouldWhiteListChild } from "../shared/whitelist/whiteListChild";
import { shouldERC721Base } from "../../ERC721/shared/base/enumerable";
import { shouldERC721Burnable } from "../../ERC721/shared/burnable/enumerable/burn";
import { shouldERC721Enumerable } from "../../ERC721/shared/enumerable";
import { shouldERC721Royalty } from "../../ERC721/shared/royalty/enumerable";
import { shouldERC721Storage } from "../../ERC721/shared/storage/enumerable/storage";
import { shouldERC998Base } from "../shared/base/basic";
import { deployErc998Base } from "../../ERC721/shared/fixtures";

use(solidity);

describe("ERC998ERC721ABERSW", function () {
  const factory = () => deployErc998Base(this.title);

  shouldERC721Base(factory);
  shouldBeAccessible(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
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

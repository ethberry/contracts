import { expect, use } from "chai";
import { solidity } from "ethereum-waffle";
import { ethers } from "hardhat";

import { DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE } from "@gemunion/contracts-constants";
import { shouldBehaveLikeAccessControl, shouldSupportsInterface } from "@gemunion/contracts-mocha";

import { shouldBehaveLikeERC998, shouldBehaveLikeERC998WhiteListChild } from "../../src/basic";
import { deployERC998 } from "../../src/fixtures";

use(solidity);

describe("ERC998ERC721ABERSW", function () {
  const factory = () => deployERC998(this.title);

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);

  shouldBehaveLikeERC998(factory);
  shouldBehaveLikeERC998WhiteListChild(factory);

  describe("getChild", function () {
    it("should get child", async function () {
      const [owner] = await ethers.getSigners();
      const erc721Instance = await deployERC998("ERC998ERC721ABERSW");
      const erc721InstanceMock = await deployERC998("ERC721ABCE");

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

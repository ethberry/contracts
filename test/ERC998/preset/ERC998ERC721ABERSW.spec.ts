import { expect, use } from "chai";
import { solidity } from "ethereum-waffle";
import { ethers } from "hardhat";

import { DEFAULT_ADMIN_ROLE, MINTER_ROLE } from "../../constants";
import { shouldWhiteListChild } from "../shared/whitelist/whiteListChild";
import { shouldERC721Base } from "../../ERC721/shared/enumerable/base";
import { shouldERC721Accessible } from "../../ERC721/shared/accessible";
import { shouldERC721Burnable } from "../../ERC721/shared/enumerable/burn";
import { shouldERC721Enumerable } from "../../ERC721/shared/enumerable/enumerable";
import { shouldERC721Royalty } from "../../ERC721/shared/enumerable/royalty";
import { shouldERC721Storage } from "../../ERC721/shared/enumerable/storage";
import { shouldERC998Base } from "../shared/base/basic";
import { deployErc721Base } from "../../ERC721/shared/fixtures";

use(solidity);

describe("ERC998ERC721ABERSW", function () {
  const name = "ERC998ERC721ABERSW";

  shouldERC721Base(name);
  shouldERC721Accessible(name)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldERC721Burnable(name);
  shouldERC721Enumerable(name);
  shouldERC721Royalty(name);
  shouldERC721Storage(name);

  shouldERC998Base(name);
  shouldWhiteListChild(name);

  describe("getChild", function () {
    it("should get child", async function () {
      const [owner] = await ethers.getSigners();
      const { contractInstance: erc721Instance } = await deployErc721Base(name);
      const { contractInstance: erc721InstanceMock } = await deployErc721Base("ERC721ABCE");

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
});
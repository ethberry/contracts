import { expect, use } from "chai";
import { solidity } from "ethereum-waffle";
import { ethers } from "hardhat";

import { DEFAULT_ADMIN_ROLE, MINTER_ROLE, tokenName, tokenSymbol } from "../constants";

import { shouldHaveRole } from "../shared/accessControl/hasRoles";
import { shouldGetRoleAdmin } from "../shared/accessControl/getRoleAdmin";
import { shouldGrantRole } from "../shared/accessControl/grantRole";
import { shouldRevokeRole } from "../shared/accessControl/revokeRole";
import { shouldRenounceRole } from "../shared/accessControl/renounceRole";
import { shouldMint } from "../ERC721/shared/enumerable/base/mint";
import { shouldSafeMint } from "../ERC721/shared/enumerable/base/safeMint";
import { shouldGetOwnerOf } from "../ERC721/shared/enumerable/base/ownerOf";
import { shouldApprove } from "../ERC721/shared/enumerable/base/approve";
import { shouldSetApprovalForAll } from "../ERC721/shared/enumerable/base/setApprovalForAll";
import { shouldGetBalanceOf } from "../ERC721/shared/enumerable/base/balanceOf";
import { shouldTransferFrom } from "../ERC721/shared/enumerable/base/transferFrom";
import { shouldSafeTransferFrom } from "../ERC721/shared/enumerable/base/safeTransferFrom";
import { shouldERC721Burnable } from "../ERC721/shared/enumerable/burn";
import { shouldERC721Storage } from "../ERC721/shared/enumerable/storage";
import { shouldGetTokenOfOwnerByIndex } from "../ERC721/shared/enumerable/base/tokenOfOwnerByIndex";
import { shouldERC721Capped } from "../ERC721/shared/enumerable/capped";

use(solidity);

describe("ERC998BottomUp", function () {
  beforeEach(async function () {
    [this.owner, this.receiver] = await ethers.getSigners();

    const erc721Factory = await ethers.getContractFactory("ERC998BottomUp");
    this.erc721Instance = await erc721Factory.deploy(tokenName, tokenSymbol, 2);

    const erc721ReceiverFactory = await ethers.getContractFactory("ERC721ReceiverMock");
    this.erc721ReceiverInstance = await erc721ReceiverFactory.deploy();

    const erc721NonReceiverFactory = await ethers.getContractFactory("ERC721NonReceiverMock");
    this.erc721NonReceiverInstance = await erc721NonReceiverFactory.deploy();

    this.contractInstance = this.erc721Instance;
  });

  shouldHaveRole(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldGetRoleAdmin(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldGrantRole();
  shouldRevokeRole();
  shouldRenounceRole();
  shouldMint();
  shouldSafeMint();
  shouldGetOwnerOf();
  shouldApprove();
  shouldSetApprovalForAll();
  shouldGetBalanceOf();
  shouldTransferFrom();
  shouldSafeTransferFrom();
  shouldERC721Burnable();
  shouldERC721Storage();
  shouldGetTokenOfOwnerByIndex();
  shouldERC721Capped();

  describe("supportsInterface", function () {
    it("should support all interfaces", async function () {
      const supportsIERC721 = await this.erc721Instance.supportsInterface("0x80ac58cd");
      expect(supportsIERC721).to.equal(true);
      const supportsIERC721Metadata = await this.erc721Instance.supportsInterface("0x5b5e139f");
      expect(supportsIERC721Metadata).to.equal(true);
      const supportsIERC721Enumerable = await this.erc721Instance.supportsInterface("0x780e9d63");
      expect(supportsIERC721Enumerable).to.equal(true);

      const supportsIERC165 = await this.erc721Instance.supportsInterface("0x01ffc9a7");
      expect(supportsIERC165).to.equal(true);

      const supportsIAccessControl = await this.erc721Instance.supportsInterface("0x7965db0b");
      expect(supportsIAccessControl).to.equal(true);

      const supportsERC998 = await this.erc721Instance.supportsInterface("0xa1b23002");
      expect(supportsERC998).to.equal(true);

      const supportsInvalidInterface = await this.erc721Instance.supportsInterface("0xffffffff");
      expect(supportsInvalidInterface).to.equal(false);
    });
  });
});

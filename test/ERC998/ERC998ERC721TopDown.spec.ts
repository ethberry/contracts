import { expect, use } from "chai";
import { solidity } from "ethereum-waffle";
import { ethers } from "hardhat";

import { DEFAULT_ADMIN_ROLE, MINTER_ROLE, tokenName, tokenSymbol } from "../constants";

import { shouldHaveRole } from "../shared/accessControl/hasRoles";
import { shouldGetRoleAdmin } from "../shared/accessControl/getRoleAdmin";
import { shouldGrantRole } from "../shared/accessControl/grantRole";
import { shouldRevokeRole } from "../shared/accessControl/revokeRole";
import { shouldRenounceRole } from "../shared/accessControl/renounceRole";
import { shouldMint } from "../ERC721/shared/enumerable/mint";
import { shouldSafeMint } from "../ERC721/shared/enumerable/safeMint";
import { shouldGetBalanceOf } from "../ERC721/shared/enumerable/balanceOf";
import { shouldGetOwnerOf } from "../ERC721/shared/enumerable/ownerOf";
import { shouldGetTokenURI } from "../ERC721/shared/enumerable/tokenURI";
import { shouldApprove } from "./shared/approve";
import { shouldSetApprovalForAll } from "../ERC721/shared/enumerable/setApprovalForAll";
import { shouldTransferFrom } from "../ERC721/shared/enumerable/transferFrom";
import { shouldSafeTransferFrom } from "./shared/safeTransferFrom";
import { shouldSafeTransferChild } from "./shared/safeTransferChild";
import { shouldTransferChild } from "./shared/transferChild";
import { shouldChildExists } from "./shared/childExists";
import { shouldTotalChildContracts } from "./shared/totalChildContracts";
import { shouldChildContractByIndex } from "./shared/childContractByIndex";
import { shouldTotalChildTokens } from "./shared/totalChildTokens";
import { shouldChildTokenByIndex } from "./shared/childTokenByIndex";

use(solidity);

describe("ERC998ERC721TopDown", function () {
  beforeEach(async function () {
    [this.owner, this.receiver] = await ethers.getSigners();

    const erc721Factory = await ethers.getContractFactory("ERC721ACBCE");
    this.erc721InstanceMock = await erc721Factory.deploy(tokenName, tokenSymbol, 2);

    const erc998Factory = await ethers.getContractFactory("ERC998ERC721TopDown");
    this.erc721Instance = await erc998Factory.deploy(tokenName, tokenSymbol, 1000);

    const erc721ReceiverFactory = await ethers.getContractFactory("ERC721ReceiverMock");
    this.erc721ReceiverInstance = await erc721ReceiverFactory.deploy();

    const erc721NonReceiver = await ethers.getContractFactory("ERC721NonReceiverMock");
    this.erc721NonReceiverInstance = await erc721NonReceiver.deploy();

    this.contractInstance = this.erc721Instance;
  });

  shouldHaveRole(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldGetRoleAdmin(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldGrantRole();
  shouldRevokeRole();
  shouldRenounceRole();
  shouldMint();
  shouldSafeMint();
  shouldGetBalanceOf();
  shouldGetOwnerOf();
  shouldGetTokenURI();
  shouldApprove();
  shouldSetApprovalForAll();
  shouldTransferFrom();
  shouldSafeTransferFrom();
  shouldSafeTransferChild();
  shouldTransferChild();
  shouldChildExists();
  shouldTotalChildContracts();
  shouldChildContractByIndex();
  shouldTotalChildTokens();
  shouldChildTokenByIndex();

  describe("getChild", function () {
    it("should get child", async function () {
      await this.erc721InstanceMock.mint(this.owner.address);
      await this.erc721InstanceMock.approve(this.erc721Instance.address, 0);
      await this.erc721Instance.mint(this.owner.address); // this is edge case
      await this.erc721Instance.mint(this.owner.address);

      const tx1 = this.erc721Instance.getChild(this.owner.address, 1, this.erc721InstanceMock.address, 0);
      await expect(tx1).to.be.revertedWith(`ERC998ERC721TopDown: this method is not supported`);
    });
  });
});

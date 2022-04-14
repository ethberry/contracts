import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";

import { ERC721NonReceiverMock, ERC721ReceiverMock, ERC721ACBCE, ERC998ERC721ACBERTD } from "../../typechain-types";
import { baseTokenURI, DEFAULT_ADMIN_ROLE, MINTER_ROLE, tokenName, tokenSymbol } from "../constants";

import { shouldHaveRole } from "../shared/accessControl/hasRoles";
import { shouldGetRoleAdmin } from "../shared/accessControl/getRoleAdmin";
import { shouldGrantRole } from "../shared/accessControl/grantRole";
import { shouldRevokeRole } from "../shared/accessControl/revokeRole";
import { shouldRenounceRole } from "../shared/accessControl/renounceRole";
import { shouldMint } from "../ERC721/shared/enumerable/mint";
import { shouldSafeMint } from "../ERC721/shared/enumerable/safeMint";
import { shouldGetBalanceOf } from "../ERC721/shared/enumerable/balanceOf";
import { shouldGetOwnerOf } from "../ERC721/shared/enumerable/ownerOf";
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
import { shouldSetTokenRoyalty } from "../ERC721/shared/royalty/setTokenRoyalty";
import { shouldSetDefaultRoyalty } from "../ERC721/shared/royalty/setDefaultRoyalty";
import { shouldGetRoyaltyInfo } from "../ERC721/shared/royalty/royaltyInfo";
import { shouldBurnBasic } from "../ERC721/shared/royalty/burnBasic";

describe("ERC998ERC721ACBERTD", function () {
  let erc721: ContractFactory;
  let erc998: ContractFactory;
  let erc721Receiver: ContractFactory;
  let erc721NonReceiver: ContractFactory;

  beforeEach(async function () {
    erc721 = await ethers.getContractFactory("ERC721ACBCE");
    erc998 = await ethers.getContractFactory("ERC998ERC721ACBERTD");
    erc721Receiver = await ethers.getContractFactory("ERC721ReceiverMock");
    erc721NonReceiver = await ethers.getContractFactory("ERC721NonReceiverMock");
    [this.owner, this.receiver] = await ethers.getSigners();

    this.erc721InstanceMock = (await erc721.deploy(tokenName, tokenSymbol, baseTokenURI, 2)) as ERC721ACBCE;
    this.erc721Instance = (await erc998.deploy(tokenName, tokenSymbol, baseTokenURI, 100)) as ERC998ERC721ACBERTD;
    this.erc721ReceiverInstance = (await erc721Receiver.deploy()) as ERC721ReceiverMock;
    this.erc721NonReceiverInstance = (await erc721NonReceiver.deploy()) as ERC721NonReceiverMock;

    this.contractInstance = this.erc721Instance;
  });

  shouldHaveRole(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldGetRoleAdmin(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldGrantRole();
  shouldRevokeRole();
  shouldRenounceRole();
  shouldMint(true);
  shouldSafeMint(true);
  shouldGetBalanceOf();
  shouldGetOwnerOf();
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
  shouldSetTokenRoyalty(true);
  shouldSetDefaultRoyalty(true);
  shouldGetRoyaltyInfo();
  shouldBurnBasic(true);

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

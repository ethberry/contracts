import { expect, use } from "chai";
import { solidity } from "ethereum-waffle";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";

import { ERC721ABCE, ERC721NonReceiverMock, ERC721ReceiverMock, ERC998ERC721ABERSWL } from "../../../typechain-types";
import { DEFAULT_ADMIN_ROLE, MINTER_ROLE, tokenName, tokenSymbol } from "../../constants";

import { shouldHaveRole } from "../../shared/accessControl/hasRoles";
import { shouldGetRoleAdmin } from "../../shared/accessControl/getRoleAdmin";
import { shouldGrantRole } from "../../shared/accessControl/grantRole";
import { shouldRevokeRole } from "../../shared/accessControl/revokeRole";
import { shouldRenounceRole } from "../../shared/accessControl/renounceRole";
import { shouldMint } from "../../ERC721/shared/enumerable/base/mint";
import { shouldSafeMint } from "../../ERC721/shared/enumerable/base/safeMint";
import { shouldGetBalanceOf } from "../../ERC721/shared/enumerable/base/balanceOf";
import { shouldGetOwnerOf } from "../../ERC721/shared/enumerable/base/ownerOf";
import { shouldERC721Storage } from "../../ERC721/shared/enumerable/storage";
import { shouldApprove } from "../shared/approve";
import { shouldSetApprovalForAll } from "../../ERC721/shared/enumerable/base/setApprovalForAll";
import { shouldTransferFrom } from "../../ERC721/shared/enumerable/base/transferFrom";
import { testsWhiteListChildTD } from "../shared/sharedWhiteListChild/testsWhiteListChildTD";
import { shouldWhiteListChild } from "../shared/sharedWhiteListChild/whiteListChild";

use(solidity);

describe("ERC998ERC721ABERSWL", function () {
  let erc721: ContractFactory;
  let erc998: ContractFactory;
  let erc721Receiver: ContractFactory;
  let erc721NonReceiver: ContractFactory;

  beforeEach(async function () {
    erc721 = await ethers.getContractFactory("ERC721ABCE");
    erc998 = await ethers.getContractFactory("ERC998ERC721ABERSWL");
    erc721Receiver = await ethers.getContractFactory("ERC721ReceiverMock");
    erc721NonReceiver = await ethers.getContractFactory("ERC721NonReceiverMock");
    [this.owner, this.receiver] = await ethers.getSigners();

    this.erc721InstanceMock = (await erc721.deploy(tokenName, tokenSymbol, 2)) as ERC721ABCE;
    this.erc721Instance = (await erc998.deploy(tokenName, tokenSymbol, 1000)) as ERC998ERC721ABERSWL;
    this.erc721ReceiverInstance = (await erc721Receiver.deploy()) as ERC721ReceiverMock;
    this.erc721NonReceiverInstance = (await erc721NonReceiver.deploy()) as ERC721NonReceiverMock;

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
  shouldERC721Storage();
  shouldApprove();
  shouldSetApprovalForAll();
  shouldTransferFrom();

  testsWhiteListChildTD();

  describe("getChild", function () {
    it("should get child", async function () {
      await this.erc721Instance.whiteListChild(this.erc721InstanceMock.address, 0);
      await this.erc721Instance.setDefaultMaxChild(0);
      await this.erc721InstanceMock.mint(this.owner.address);
      await this.erc721InstanceMock.approve(this.erc721Instance.address, 0);
      await this.erc721Instance.mint(this.owner.address); // this is edge case
      await this.erc721Instance.mint(this.owner.address);

      const tx1 = this.erc721Instance.getChild(this.owner.address, 1, this.erc721InstanceMock.address, 0);

      await expect(tx1).to.be.revertedWith(`CTD: this method is not supported`);
    });
  });

  shouldWhiteListChild();
});

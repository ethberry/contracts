import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";

import {
  ERC721NonReceiverMock,
  ERC721ReceiverMock,
  ERC721ACBCE,
  ERC998ERC721TopDownWhiteListChildTest,
} from "../../typechain-types";
import { baseTokenURI, DEFAULT_ADMIN_ROLE, MINTER_ROLE, tokenName, tokenSymbol } from "../constants";

import { shouldMint } from "./shared/mint";
import { shouldSafeMint } from "./shared/safeMint";
import { shouldGetBalanceOf } from "./shared/balanceOf";
import { shouldGetOwnerOf } from "./shared/ownerOf";
import { shouldGetTokenURI } from "./shared/tokenURI";
import { shouldApprove } from "./shared/approve";
import { shouldSetApprovalForAll } from "./shared/setApprovalForAll";
import { shouldTransferFrom } from "./shared/transferFrom";
import { shouldSafeTransferFrom } from "./shared/sharedWhiteListChild/safeTransferFrom";
import { shouldSafeTransferChild } from "./shared/sharedWhiteListChild/safeTransferChild";
import { shouldTransferChild } from "./shared/sharedWhiteListChild/transferChild";
import { shouldChildExists } from "./shared/sharedWhiteListChild/childExists";
import { shouldTotalChildContracts } from "./shared/sharedWhiteListChild/totalChildContracts";
import { shouldChildContractByIndex } from "./shared/sharedWhiteListChild/childContractByIndex";
import { shouldTotalChildTokens } from "./shared/sharedWhiteListChild/totalChildTokens";
import { shouldChildTokenByIndex } from "./shared/sharedWhiteListChild/childTokenByIndex";
import { shouldGetChild } from "./shared/sharedWhiteListChild/getChild";
import { shouldWhiteListChild } from "./shared/sharedWhiteListChild/whiteListChild";

describe("ERC998ERC721TopDownWhiteListChildTest", function () {
  let erc721: ContractFactory;
  let erc998: ContractFactory;
  let erc721Receiver: ContractFactory;
  let erc721NonReceiver: ContractFactory;

  beforeEach(async function () {
    erc721 = await ethers.getContractFactory("ERC721ACBCE");
    erc998 = await ethers.getContractFactory("ERC998ERC721TopDownWhiteListChildTest");
    erc721Receiver = await ethers.getContractFactory("ERC721ReceiverMock");
    erc721NonReceiver = await ethers.getContractFactory("ERC721NonReceiverMock");
    [this.owner, this.receiver] = await ethers.getSigners();

    this.erc721Instance = (await erc721.deploy(tokenName, tokenSymbol, baseTokenURI, 2)) as ERC721ACBCE;
    this.erc998Instance = (await erc998.deploy(
      tokenName,
      tokenSymbol,
      baseTokenURI,
      1000,
    )) as ERC998ERC721TopDownWhiteListChildTest;
    this.erc721ReceiverInstance = (await erc721Receiver.deploy()) as ERC721ReceiverMock;
    this.erc721NonReceiverInstance = (await erc721NonReceiver.deploy()) as ERC721NonReceiverMock;
  });

  describe("constructor", function () {
    it("Should set the right roles to deployer", async function () {
      const isAdmin = await this.erc998Instance.hasRole(DEFAULT_ADMIN_ROLE, this.owner.address);
      expect(isAdmin).to.equal(true);
      const isMinter = await this.erc998Instance.hasRole(MINTER_ROLE, this.owner.address);
      expect(isMinter).to.equal(true);
    });
  });

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
  shouldGetChild();
  shouldWhiteListChild();
});

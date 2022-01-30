import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";

import {
  ERC20ACBCS,
  ERC721NonReceiverMock,
  ERC721ReceiverMock,
  ERC721ACBCE,
  ERC998ComposableTopDownTest,
} from "../../typechain-types";
import { amount, baseTokenURI, DEFAULT_ADMIN_ROLE, MINTER_ROLE, tokenName, tokenSymbol } from "../constants";

import { shouldMint } from "./shared/mint";
import { shouldSafeMint } from "./shared/safeMint";
import { shouldGetBalanceOf } from "./shared/balanceOf";
import { shouldGetOwnerOf } from "./shared/ownerOf";
import { shouldGetTokenURI } from "./shared/tokenURI";
import { shouldApprove } from "./shared/approve";
import { shouldSetApprovalForAll } from "./shared/setApprovalForAll";
import { shouldTransferFrom } from "./shared/transferFrom";
import { shouldSafeTransferFrom } from "./shared/safeTransferFrom";
import { shouldSafeTransferChild } from "./shared/safeTransferChild";
import { shouldTransferChild } from "./shared/transferChild";
import { shouldChildExists } from "./shared/childExists";
import { shouldTotalChildContracts } from "./shared/totalChildContracts";
import { shouldChildContractByIndex } from "./shared/childContractByIndex";
import { shouldTotalChildTokens } from "./shared/totalChildTokens";
import { shouldChildTokenByIndex } from "./shared/childTokenByIndex";
import { shouldGetChild } from "./shared/getChild";
import { shouldGetERC20 } from "./shared/getERC20";
import { shouldBalanceOfERC20 } from "./shared/balanceOfERC20";
import { shouldErc20ContractByIndex } from "./shared/erc20ContractByIndex";
import { shouldTotalERC20Contracts } from "./shared/totalERC20Contracts";

describe("ERC998ComposableTopDown", function () {
  let erc20: ContractFactory;
  let erc721: ContractFactory;
  let erc998: ContractFactory;
  let erc721Receiver: ContractFactory;
  let erc721NonReceiver: ContractFactory;

  beforeEach(async function () {
    erc20 = await ethers.getContractFactory("ERC20ACBCS");
    erc721 = await ethers.getContractFactory("ERC721ACBCE");
    erc998 = await ethers.getContractFactory("ERC998ComposableTopDownTest");
    erc721Receiver = await ethers.getContractFactory("ERC721ReceiverMock");
    erc721NonReceiver = await ethers.getContractFactory("ERC721NonReceiverMock");
    [this.owner, this.receiver] = await ethers.getSigners();

    this.erc20Instance = (await erc20.deploy(tokenName, tokenSymbol, amount)) as ERC20ACBCS;
    this.erc721Instance = (await erc721.deploy(tokenName, tokenSymbol, baseTokenURI, 2)) as ERC721ACBCE;
    this.erc998Instance = (await erc998.deploy(tokenName, tokenSymbol, baseTokenURI)) as ERC998ComposableTopDownTest;
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
  shouldGetERC20();
  shouldBalanceOfERC20();
  shouldErc20ContractByIndex();
  shouldTotalERC20Contracts();

  describe("supportsInterface", function () {
    it("should support all interfaces", async function () {
      const supportsIERC721 = await this.erc998Instance.supportsInterface("0x80ac58cd");
      expect(supportsIERC721).to.equal(true);
      const supportsIERC721Metadata = await this.erc998Instance.supportsInterface("0x5b5e139f");
      expect(supportsIERC721Metadata).to.equal(true);
      const supportsIERC721Enumerable = await this.erc998Instance.supportsInterface("0x780e9d63");
      expect(supportsIERC721Enumerable).to.equal(true);
      const supportsIERC165 = await this.erc998Instance.supportsInterface("0x01ffc9a7");
      expect(supportsIERC165).to.equal(true);
      const supportsIAccessControl = await this.erc998Instance.supportsInterface("0x7965db0b");
      expect(supportsIAccessControl).to.equal(true);
      const supportsERC998 = await this.erc998Instance.supportsInterface("0x1bc995e4");
      expect(supportsERC998).to.equal(true);
      const supportsInvalidInterface = await this.erc998Instance.supportsInterface("0xffffffff");
      expect(supportsInvalidInterface).to.equal(false);
    });
  });
});

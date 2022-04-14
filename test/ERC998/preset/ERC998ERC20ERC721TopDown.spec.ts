import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";

import {
  ERC20ACBCS,
  ERC721NonReceiverMock,
  ERC721ReceiverMock,
  ERC721ACBCE,
  ERC998ERC20ERC721TopDown,
} from "../../../typechain-types";
import { amount, baseTokenURI, DEFAULT_ADMIN_ROLE, MINTER_ROLE, tokenName, tokenSymbol } from "../../constants";

import { shouldHaveRole } from "../../shared/accessControl/hasRoles";
import { shouldGetRoleAdmin } from "../../shared/accessControl/getRoleAdmin";
import { shouldGrantRole } from "../../shared/accessControl/grantRole";
import { shouldRevokeRole } from "../../shared/accessControl/revokeRole";
import { shouldRenounceRole } from "../../shared/accessControl/renounceRole";
import { shouldMint } from "../../ERC721/shared/enumerable/mint";
import { shouldSafeMint } from "../../ERC721/shared/enumerable/safeMint";
import { shouldGetBalanceOf } from "../../ERC721/shared/enumerable/balanceOf";
import { shouldGetOwnerOf } from "../../ERC721/shared/enumerable/ownerOf";
import { shouldGetTokenURI } from "../../ERC721/shared/enumerable/tokenURI";
import { shouldApprove } from "../shared/approve";
import { shouldSetApprovalForAll } from "../../ERC721/shared/enumerable/setApprovalForAll";
import { shouldTransferFrom } from "../../ERC721/shared/enumerable/transferFrom";
import { shouldSafeTransferFrom } from "../shared/safeTransferFrom";
import { shouldSafeTransferChild } from "../shared/safeTransferChild";
import { shouldTransferChild } from "../shared/transferChild";
import { shouldChildExists } from "../shared/childExists";
import { shouldTotalChildContracts } from "../shared/totalChildContracts";
import { shouldChildContractByIndex } from "../shared/childContractByIndex";
import { shouldTotalChildTokens } from "../shared/totalChildTokens";
import { shouldChildTokenByIndex } from "../shared/childTokenByIndex";
import { shouldGetChild } from "../shared/getChild";
import { shouldGetERC20 } from "../shared/getERC20";
import { shouldBalanceOfERC20 } from "../shared/balanceOfERC20";
import { shouldErc20ContractByIndex } from "../shared/erc20ContractByIndex";
import { shouldTotalERC20Contracts } from "../shared/totalERC20Contracts";

describe("ERC998ComposableTopDown", function () {
  let erc20: ContractFactory;
  let erc721: ContractFactory;
  let erc998: ContractFactory;
  let erc721Receiver: ContractFactory;
  let erc721NonReceiver: ContractFactory;

  beforeEach(async function () {
    erc20 = await ethers.getContractFactory("ERC20ACBCS");
    erc721 = await ethers.getContractFactory("ERC721ACBCE");
    erc998 = await ethers.getContractFactory("ERC998ERC20ERC721TopDown");
    erc721Receiver = await ethers.getContractFactory("ERC721ReceiverMock");
    erc721NonReceiver = await ethers.getContractFactory("ERC721NonReceiverMock");
    [this.owner, this.receiver] = await ethers.getSigners();

    this.erc20Instance = (await erc20.deploy(tokenName, tokenSymbol, amount)) as ERC20ACBCS;
    this.erc721InstanceMock = (await erc721.deploy(tokenName, tokenSymbol, baseTokenURI, 2)) as ERC721ACBCE;
    this.erc721Instance = (await erc998.deploy(tokenName, tokenSymbol, baseTokenURI, 1000)) as ERC998ERC20ERC721TopDown;
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
      const supportsERC998 = await this.erc721Instance.supportsInterface("0x1bc995e4");
      expect(supportsERC998).to.equal(true);
      const supportsInvalidInterface = await this.erc721Instance.supportsInterface("0xffffffff");
      expect(supportsInvalidInterface).to.equal(false);
    });
  });
});

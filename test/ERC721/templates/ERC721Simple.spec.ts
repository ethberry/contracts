import { ethers } from "hardhat";
import { ContractFactory } from "ethers";
import { expect } from "chai";

import { ERC721Simple, ERC721NonReceiverMock, ERC721ReceiverMock } from "../../../typechain-types";
import {
  baseTokenURI,
  DEFAULT_ADMIN_ROLE,
  MINTER_ROLE,
  royaltyNumerator,
  tokenName,
  tokenSymbol,
} from "../../constants";

import { shouldHaveRole } from "../../shared/accessControl/hasRoles";
import { shouldGetRoleAdmin } from "../../shared/accessControl/getRoleAdmin";
import { shouldGrantRole } from "../../shared/accessControl/grantRole";
import { shouldRevokeRole } from "../../shared/accessControl/revokeRole";
import { shouldRenounceRole } from "../../shared/accessControl/renounceRole";
import { shouldMint } from "../shared/enumerable/mint";
import { shouldSafeMint } from "../shared/enumerable/safeMint";
import { shouldGetOwnerOf } from "../shared/enumerable/ownerOf";
import { shouldApprove } from "../shared/enumerable/approve";
import { shouldSetApprovalForAll } from "../shared/enumerable/setApprovalForAll";
import { shouldGetBalanceOf } from "../shared/enumerable/balanceOf";
import { shouldTransferFrom } from "../shared/enumerable/transferFrom";
import { shouldSafeTransferFrom } from "../shared/enumerable/safeTransferFrom";
import { shouldBurn } from "../shared/enumerable/burn";
import { shouldGetTokenOfOwnerByIndex } from "../shared/enumerable/tokenOfOwnerByIndex";
import { shouldSetTokenRoyalty } from "../shared/royalty/setTokenRoyalty";
import { shouldSetDefaultRoyalty } from "../shared/royalty/setDefaultRoyalty";
import { shouldGetRoyaltyInfo } from "../shared/royalty/royaltyInfo";
import { shouldBurnBasic } from "../shared/royalty/burnBasic";

describe("ERC721Simple", function () {
  let erc721: ContractFactory;
  let erc721Receiver: ContractFactory;
  let erc721NonReceiver: ContractFactory;

  const templateId = 1337;

  beforeEach(async function () {
    erc721 = await ethers.getContractFactory("ERC721Simple");
    erc721Receiver = await ethers.getContractFactory("ERC721ReceiverMock");
    erc721NonReceiver = await ethers.getContractFactory("ERC721NonReceiverMock");
    [this.owner, this.receiver] = await ethers.getSigners();

    this.erc721Instance = (await erc721.deploy(tokenName, tokenSymbol, baseTokenURI, royaltyNumerator)) as ERC721Simple;
    this.erc721ReceiverInstance = (await erc721Receiver.deploy()) as ERC721ReceiverMock;
    this.erc721NonReceiverInstance = (await erc721NonReceiver.deploy()) as ERC721NonReceiverMock;

    await this.erc721Instance.setMaxTemplateId(templateId);

    this.contractInstance = this.erc721Instance;
  });

  shouldHaveRole(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldGetRoleAdmin(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldGrantRole();
  shouldRevokeRole();
  shouldRenounceRole();
  shouldMint(true);
  shouldSafeMint(true);
  shouldGetOwnerOf();
  shouldApprove();
  shouldSetApprovalForAll();
  shouldGetBalanceOf();
  shouldTransferFrom();
  shouldSafeTransferFrom();
  shouldBurn();
  shouldGetTokenOfOwnerByIndex();
  shouldSetTokenRoyalty(true);
  shouldSetDefaultRoyalty(true);
  shouldGetRoyaltyInfo();
  shouldBurnBasic(true);

  describe("mintCommon", function () {
    it("should fail: wrong role", async function () {
      const tx = this.erc721Instance.connect(this.receiver).mintCommon(this.receiver.address, templateId);
      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${this.receiver.address.toLowerCase()} is missing role ${MINTER_ROLE}`,
      );
    });

    it("should mint to wallet", async function () {
      const tx = this.erc721Instance.mintCommon(this.receiver.address, templateId);
      await expect(tx)
        .to.emit(this.erc721Instance, "Transfer")
        .withArgs(ethers.constants.AddressZero, this.receiver.address, 0);

      const balance = await this.erc721Instance.balanceOf(this.receiver.address);
      expect(balance).to.equal(1);

      const value = await this.erc721Instance.getRecordFieldValue(
        0,
        ethers.utils.keccak256(ethers.utils.toUtf8Bytes("templateId")),
      );
      expect(value).to.equal(templateId);
    });

    it("should fail to mint to non receiver", async function () {
      const tx = this.erc721Instance.mintCommon(this.erc721NonReceiverInstance.address, templateId);
      await expect(tx).to.be.revertedWith(`ERC721: transfer to non ERC721Receiver implementer`);
    });

    it("should mint to receiver", async function () {
      const tx = this.erc721Instance.mintCommon(this.erc721ReceiverInstance.address, templateId);
      await expect(tx)
        .to.emit(this.erc721Instance, "Transfer")
        .withArgs(ethers.constants.AddressZero, this.erc721ReceiverInstance.address, 0);

      const balance = await this.erc721Instance.balanceOf(this.erc721ReceiverInstance.address);
      expect(balance).to.equal(1);
    });
  });

  describe("supportsInterface", function () {
    it("should support all interfaces", async function () {
      const supportsIERC721 = await this.erc721Instance.supportsInterface("0x80ac58cd");
      expect(supportsIERC721).to.equal(true);
      const supportsIERC721Metadata = await this.erc721Instance.supportsInterface("0x5b5e139f");
      expect(supportsIERC721Metadata).to.equal(true);
      const supportsIERC721Enumerable = await this.erc721Instance.supportsInterface("0x780e9d63");
      expect(supportsIERC721Enumerable).to.equal(true);
      const supportsIERC721Royalty = await this.erc721Instance.supportsInterface("0x2a55205a");
      expect(supportsIERC721Royalty).to.equal(true);
      const supportsIERC165 = await this.erc721Instance.supportsInterface("0x01ffc9a7");
      expect(supportsIERC165).to.equal(true);
      const supportsIAccessControl = await this.erc721Instance.supportsInterface("0x7965db0b");
      expect(supportsIAccessControl).to.equal(true);
      const supportsInvalidInterface = await this.erc721Instance.supportsInterface("0xffffffff");
      expect(supportsInvalidInterface).to.equal(false);
    });
  });
});

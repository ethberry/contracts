import { ethers } from "hardhat";
import { ContractFactory } from "ethers";
import { expect } from "chai";

import { ERC721ACBCR, ERC721NonReceiverMock, ERC721ReceiverMock } from "../../../typechain-types";
import { baseTokenURI, tokenName, tokenSymbol } from "../../constants";

import { shouldHaveRole } from "../shared/accessControl/hasRole";
import { shouldMint } from "../shared/basic/mint";
import { shouldSafeMint } from "../shared/basic/safeMint";
import { shouldGetOwnerOf } from "../shared/basic/ownerOf";
import { shouldApprove } from "../shared/basic/approve";
import { shouldSetApprovalForAll } from "../shared/basic/setApprovalForAll";
import { shouldGetBalanceOf } from "../shared/basic/balanceOf";
import { shouldTransferFrom } from "../shared/basic/transferFrom";
import { shouldSafeTransferFrom } from "../shared/basic/safeTransferFrom";
import { shouldBurn } from "../shared/basic/burn";
import { shouldCapped } from "../shared/basic/capped";
import { shouldSetTokenRoyalty } from "../shared/royalty/setTokenRoyalty";
import { shouldSetDefaultRoyalty } from "../shared/royalty/setDefaultRoyalty";
import { shouldGetRoyaltyInfo } from "../shared/royalty/royaltyInfo";
import { shouldBurnBasic } from "../shared/royalty/burnBasic";

describe("ERC721ACBCR", function () {
  let erc721: ContractFactory;
  let erc721Receiver: ContractFactory;
  let erc721NonReceiver: ContractFactory;

  beforeEach(async function () {
    erc721 = await ethers.getContractFactory("ERC721ACBCR");
    erc721Receiver = await ethers.getContractFactory("ERC721ReceiverMock");
    erc721NonReceiver = await ethers.getContractFactory("ERC721NonReceiverMock");
    [this.owner, this.receiver] = await ethers.getSigners();

    this.erc721Instance = (await erc721.deploy(tokenName, tokenSymbol, baseTokenURI, 2, 100)) as ERC721ACBCR;
    this.erc721ReceiverInstance = (await erc721Receiver.deploy()) as ERC721ReceiverMock;
    this.erc721NonReceiverInstance = (await erc721NonReceiver.deploy()) as ERC721NonReceiverMock;
  });

  shouldHaveRole();
  shouldMint(true);
  shouldSafeMint(true);
  shouldGetOwnerOf();
  shouldApprove();
  shouldSetApprovalForAll();
  shouldGetBalanceOf();
  shouldTransferFrom();
  shouldSafeTransferFrom();
  shouldBurn();
  shouldCapped();
  shouldSetTokenRoyalty(true);
  shouldSetDefaultRoyalty(true);
  shouldGetRoyaltyInfo();
  shouldBurnBasic();

  describe("supportsInterface", function () {
    it("should support all interfaces", async function () {
      const supportsIERC721 = await this.erc721Instance.supportsInterface("0x80ac58cd");
      expect(supportsIERC721).to.equal(true);
      const supportsIERC721Metadata = await this.erc721Instance.supportsInterface("0x5b5e139f");
      expect(supportsIERC721Metadata).to.equal(true);
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

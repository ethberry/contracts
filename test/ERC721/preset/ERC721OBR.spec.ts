import { ethers } from "hardhat";
import { ContractFactory } from "ethers";
import { expect } from "chai";

import { ERC721ACBR, ERC721NonReceiverMock, ERC721ReceiverMock } from "../../../typechain-types";
import { royalty, tokenName, tokenSymbol } from "../../constants";

import { shouldHaveOwner } from "../../shared/ownable/owner";
import { shouldMint } from "../shared/basic/mint";
import { shouldSafeMint } from "../shared/basic/safeMint";
import { shouldGetOwnerOf } from "../shared/basic/ownerOf";
import { shouldApprove } from "../shared/basic/approve";
import { shouldSetApprovalForAll } from "../shared/basic/setApprovalForAll";
import { shouldGetBalanceOf } from "../shared/basic/balanceOf";
import { shouldTransferFrom } from "../shared/basic/transferFrom";
import { shouldSafeTransferFrom } from "../shared/basic/safeTransferFrom";
import { shouldBurn } from "../shared/basic/burn";
import { shouldSetTokenRoyalty } from "../shared/royalty/setTokenRoyalty";
import { shouldSetDefaultRoyalty } from "../shared/royalty/setDefaultRoyalty";
import { shouldGetRoyaltyInfo } from "../shared/royalty/royaltyInfo";
import { shouldBurnBasic } from "../shared/royalty/burnBasic";
import { shouldTransferOwnership } from "../../shared/ownable/transferOwnership";
import { shouldRenounceOwnership } from "../../shared/ownable/renounceOwnership";

describe("ERC721OBR", function () {
  let erc721: ContractFactory;
  let erc721Receiver: ContractFactory;
  let erc721NonReceiver: ContractFactory;

  beforeEach(async function () {
    erc721 = await ethers.getContractFactory("ERC721OBR");
    erc721Receiver = await ethers.getContractFactory("ERC721ReceiverMock");
    erc721NonReceiver = await ethers.getContractFactory("ERC721NonReceiverMock");
    [this.owner, this.receiver] = await ethers.getSigners();

    this.erc721Instance = (await erc721.deploy(tokenName, tokenSymbol, royalty)) as ERC721ACBR;
    this.erc721ReceiverInstance = (await erc721Receiver.deploy()) as ERC721ReceiverMock;
    this.erc721NonReceiverInstance = (await erc721NonReceiver.deploy()) as ERC721NonReceiverMock;

    this.contractInstance = this.erc721Instance;
  });

  shouldHaveOwner();
  shouldTransferOwnership();
  shouldRenounceOwnership();
  shouldMint();
  shouldSafeMint();
  shouldGetOwnerOf();
  shouldApprove();
  shouldSetApprovalForAll();
  shouldGetBalanceOf();
  shouldTransferFrom();
  shouldSafeTransferFrom();
  shouldBurn();
  shouldSetTokenRoyalty();
  shouldSetDefaultRoyalty();
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
      const supportsInvalidInterface = await this.erc721Instance.supportsInterface("0xffffffff");
      expect(supportsInvalidInterface).to.equal(false);
    });
  });
});

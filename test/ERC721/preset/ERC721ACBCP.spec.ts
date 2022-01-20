import { ethers } from "hardhat";
import { ContractFactory } from "ethers";
import { expect } from "chai";

import { ERC721ACBCP, ERC721NonReceiverMock, ERC721ReceiverMock } from "../../../typechain-types";
import { baseTokenURI, tokenName, tokenSymbol } from "../../constants";

import { shouldConstructor } from "../shared/constructor";
import { shouldMint } from "../shared/mint2";
import { shouldSafeMint } from "../shared/safeMint2";
import { shouldOwnerOf } from "../shared/ownerOf2";
import { shouldApprove } from "../shared/approve2";
import { shouldSetApprovalForAll } from "../shared/setApprovalForAll2";
import { shouldBalanceOf } from "../shared/balanceOf2";
import { shouldTransferFrom } from "../shared/transferFrom2";
import { shouldSafeTransferFrom } from "../shared/safeTransferFrom2";
import { shouldBurn } from "../shared/burn2";
import { shouldCapped } from "../shared/capped2";
import { shouldPause } from "../shared/pausable2";

describe.only("ERC721ACBCP", function () {
  let erc721: ContractFactory;
  let nftReceiver: ContractFactory;
  let nftNonReceiver: ContractFactory;

  beforeEach(async function () {
    erc721 = await ethers.getContractFactory("ERC721ACBCP");
    nftReceiver = await ethers.getContractFactory("ERC721ReceiverMock");
    nftNonReceiver = await ethers.getContractFactory("ERC721NonReceiverMock");
    [this.owner, this.receiver] = await ethers.getSigners();

    this.erc721Instance = (await erc721.deploy(tokenName, tokenSymbol, baseTokenURI, 2)) as ERC721ACBCP;
    this.nftReceiverInstance = (await nftReceiver.deploy()) as ERC721ReceiverMock;
    this.nftNonReceiverInstance = (await nftNonReceiver.deploy()) as ERC721NonReceiverMock;
  });

  shouldConstructor();
  shouldMint();
  shouldSafeMint();
  shouldOwnerOf();
  shouldApprove();
  shouldSetApprovalForAll();
  shouldBalanceOf();
  shouldTransferFrom();
  shouldSafeTransferFrom();
  shouldBurn();
  shouldCapped();
  shouldPause();

  describe("supportsInterface", function () {
    it("should support all interfaces", async function () {
      const supportsIERC721 = await this.erc721Instance.supportsInterface("0x80ac58cd");
      expect(supportsIERC721).to.equal(true);
      const supportsIERC721Metadata = await this.erc721Instance.supportsInterface("0x5b5e139f");
      expect(supportsIERC721Metadata).to.equal(true);
      const supportsIERC165 = await this.erc721Instance.supportsInterface("0x01ffc9a7");
      expect(supportsIERC165).to.equal(true);
      const supportsIAccessControl = await this.erc721Instance.supportsInterface("0x7965db0b");
      expect(supportsIAccessControl).to.equal(true);
      const supportsInvalidInterface = await this.erc721Instance.supportsInterface("0xffffffff");
      expect(supportsInvalidInterface).to.equal(false);
    });
  });
});

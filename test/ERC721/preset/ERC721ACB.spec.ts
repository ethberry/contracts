import { ethers } from "hardhat";
import { ContractFactory } from "ethers";
import { expect } from "chai";

import { ERC721ACB, ERC721NonReceiverMock, ERC721ReceiverMock } from "../../../typechain-types";
import { baseTokenURI, tokenName, tokenSymbol } from "../../constants";

import { shouldDeploy } from "../shared/constructor1";
import { shouldMint } from "../shared/mint2";
import { shouldSafeMint } from "../shared/safeMint2";
import { shouldGetOwnerOf } from "../shared/ownerOf2";
import { shouldApprove } from "../shared/approve2";
import { shouldSetApprovalForAll } from "../shared/setApprovalForAll2";
import { shouldGetBalanceOf } from "../shared/balanceOf2";
import { shouldTransferFrom } from "../shared/transferFrom2";
import { shouldSafeTransferFrom } from "../shared/safeTransferFrom2";
import { shouldBurn } from "../shared/burn2";

describe("ERC721ACB", function () {
  let erc721: ContractFactory;
  let nftReceiver: ContractFactory;
  let nftNonReceiver: ContractFactory;

  beforeEach(async function () {
    erc721 = await ethers.getContractFactory("ERC721ACB");
    nftReceiver = await ethers.getContractFactory("ERC721ReceiverMock");
    nftNonReceiver = await ethers.getContractFactory("ERC721NonReceiverMock");
    [this.owner, this.receiver] = await ethers.getSigners();

    this.erc721Instance = (await erc721.deploy(tokenName, tokenSymbol, baseTokenURI)) as ERC721ACB;
    this.nftReceiverInstance = (await nftReceiver.deploy()) as ERC721ReceiverMock;
    this.nftNonReceiverInstance = (await nftNonReceiver.deploy()) as ERC721NonReceiverMock;
  });

  shouldDeploy();
  shouldMint();
  shouldSafeMint();
  shouldGetOwnerOf();
  shouldApprove();
  shouldSetApprovalForAll();
  shouldGetBalanceOf();
  shouldTransferFrom();
  shouldSafeTransferFrom();
  shouldBurn();

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

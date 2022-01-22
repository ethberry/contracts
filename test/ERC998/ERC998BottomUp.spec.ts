import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";

import { ERC721NonReceiverMock, ERC721ReceiverMock, ERC998ComposableBottomUpTest } from "../../typechain-types";
import { baseTokenURI, tokenName, tokenSymbol } from "../constants";

import { shouldDeploy } from "../ERC721/shared/constructor1";
import { shouldMint } from "../ERC721/shared/mint1";
import { shouldSafeMint } from "../ERC721/shared/safeMint1";
import { shouldGetOwnerOf } from "../ERC721/shared/ownerOf1";
import { shouldApprove } from "../ERC721/shared/approve1";
import { shouldSetApprovalForAll } from "../ERC721/shared/setApprovalForAll1";
import { shouldGetBalanceOf } from "../ERC721/shared/balanceOf1";
import { shouldTransferFrom } from "../ERC721/shared/transferFrom1";
import { shouldSafeTransferFrom } from "../ERC721/shared/safeTransferFrom1";
import { shouldBurn } from "../ERC721/shared/burn1";
import { shouldGetTokenURI } from "../ERC721/shared/tokenURI1";
import { shouldGetTokenOfOwnerByIndex } from "../ERC721/shared/tokenOfOwnerByIndex1";
import { shouldGetCap } from "../ERC721/shared/capped1";

describe("ERC998ComposableBottomUp", function () {
  let erc721: ContractFactory;
  let erc721Receiver: ContractFactory;
  let erc721NonReceiver: ContractFactory;

  beforeEach(async function () {
    erc721 = await ethers.getContractFactory("ERC998ComposableBottomUpTest");
    erc721Receiver = await ethers.getContractFactory("ERC721ReceiverMock");
    erc721NonReceiver = await ethers.getContractFactory("ERC721NonReceiverMock");
    [this.owner, this.receiver] = await ethers.getSigners();

    this.erc721Instance = (await erc721.deploy(tokenName, tokenSymbol, baseTokenURI)) as ERC998ComposableBottomUpTest;
    this.erc721ReceiverInstance = (await erc721Receiver.deploy()) as ERC721ReceiverMock;
    this.erc721NonReceiverInstance = (await erc721NonReceiver.deploy()) as ERC721NonReceiverMock;
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
  shouldGetTokenURI();
  shouldGetTokenOfOwnerByIndex();
  shouldGetCap();

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

      const supportsERC998 = await this.erc721Instance.supportsInterface("0xa1b23002");
      expect(supportsERC998).to.equal(true);

      const supportsInvalidInterface = await this.erc721Instance.supportsInterface("0xffffffff");
      expect(supportsInvalidInterface).to.equal(false);
    });
  });
});

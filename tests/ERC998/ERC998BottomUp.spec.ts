import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";

import { ERC721NonReceiverMock, ERC721ReceiverMock, ERC998ComposableBottomUpTest } from "../../typechain-types";
import { baseTokenURI, tokenName, tokenSymbol } from "../constants";

import { shouldHaveRole } from "../ERC721/shared/accessControl/hasRole";
import { shouldMint } from "../ERC721/shared/enumerable/mint";
import { shouldSafeMint } from "../ERC721/shared/enumerable/safeMint";
import { shouldGetOwnerOf } from "../ERC721/shared/enumerable/ownerOf";
import { shouldApprove } from "../ERC721/shared/enumerable/approve";
import { shouldSetApprovalForAll } from "../ERC721/shared/enumerable/setApprovalForAll";
import { shouldGetBalanceOf } from "../ERC721/shared/enumerable/balanceOf";
import { shouldTransferFrom } from "../ERC721/shared/enumerable/transferFrom";
import { shouldSafeTransferFrom } from "../ERC721/shared/enumerable/safeTransferFrom";
import { shouldBurn } from "../ERC721/shared/enumerable/burn";
import { shouldGetTokenURI } from "../ERC721/shared/enumerable/tokenURI";
import { shouldGetTokenOfOwnerByIndex } from "../ERC721/shared/enumerable/tokenOfOwnerByIndex";
import { shouldGetCap } from "../ERC721/shared/enumerable/capped";

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

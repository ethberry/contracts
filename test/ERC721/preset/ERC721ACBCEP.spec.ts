import { ethers } from "hardhat";
import { ContractFactory } from "ethers";
import { expect } from "chai";

import { ERC721ACBCEP, ERC721NonReceiverMock, ERC721ReceiverMock } from "../../../typechain-types";
import { baseTokenURI, tokenName, tokenSymbol } from "../../constants";

import { shouldHasRole } from "../shared/accessControl/hasRole";
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
import { shouldGetCap } from "../shared/enumerable/capped";
import { shouldPause } from "../shared/enumerable/pausable";

describe("ERC721ACBCEP", function () {
  let erc721: ContractFactory;
  let erc721Receiver: ContractFactory;
  let erc721NonReceiver: ContractFactory;

  beforeEach(async function () {
    erc721 = await ethers.getContractFactory("ERC721ACBCEP");
    erc721Receiver = await ethers.getContractFactory("ERC721ReceiverMock");
    erc721NonReceiver = await ethers.getContractFactory("ERC721NonReceiverMock");
    [this.owner, this.receiver] = await ethers.getSigners();

    this.erc721Instance = (await erc721.deploy(tokenName, tokenSymbol, baseTokenURI, 2)) as ERC721ACBCEP;
    this.erc721ReceiverInstance = (await erc721Receiver.deploy()) as ERC721ReceiverMock;
    this.erc721NonReceiverInstance = (await erc721NonReceiver.deploy()) as ERC721NonReceiverMock;
  });

  shouldHasRole(true);
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
  shouldGetCap();
  shouldPause();

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
      const supportsInvalidInterface = await this.erc721Instance.supportsInterface("0xffffffff");
      expect(supportsInvalidInterface).to.equal(false);
    });
  });
});

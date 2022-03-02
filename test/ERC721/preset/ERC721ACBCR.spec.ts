import { ethers } from "hardhat";
import { ContractFactory } from "ethers";
import { expect } from "chai";

import { ERC721ACBCR, ERC721NonReceiverMock, ERC721ReceiverMock } from "../../../typechain-types";
import { baseTokenURI, tokenId, tokenName, tokenSymbol } from "../../constants";

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
import { shouldCapped } from "../shared/capped2";
import { shouldSetTokenRoyalty } from "../shared/setTokenRoyalty";
import { shouldSetDefaultRoyalty } from "../shared/setDefaultRoyalty";
import { shouldGetRoyaltyInfo } from "../shared/royaltyInfo";

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
  shouldCapped();
  shouldSetTokenRoyalty();
  shouldSetDefaultRoyalty();
  shouldGetRoyaltyInfo();

  describe("burn", function () {
    it("should reset token royalty info", async function () {
      await this.erc721Instance.mint(this.owner.address, tokenId);

      await this.erc721Instance.setTokenRoyalty(tokenId, this.owner.address, 200);
      const [receiver, amount] = await this.erc721Instance.royaltyInfo(tokenId, 1e6);
      expect(receiver).to.equal(this.owner.address);
      expect(amount).to.equal(20000);

      const tx = await this.erc721Instance.burn(tokenId);
      await expect(tx)
        .to.emit(this.erc721Instance, "Transfer")
        .withArgs(this.owner.address, ethers.constants.AddressZero, tokenId);

      const [receiver2, amount2] = await this.erc721Instance.royaltyInfo(tokenId, 1e6);
      expect(receiver2).to.equal(this.owner.address);
      expect(amount2).to.equal(10000);
    });
  });

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

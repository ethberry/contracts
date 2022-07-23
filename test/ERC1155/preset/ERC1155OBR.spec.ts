import { expect, use } from "chai";
import { solidity } from "ethereum-waffle";
import { ethers } from "hardhat";

import { baseTokenURI, royalty } from "../../constants";

import { shouldHaveOwner } from "../../shared/ownable/owner";
import { shouldTransferOwnership } from "../../shared/ownable/transferOwnership";
import { shouldRenounceOwnership } from "../../shared/ownable/renounceOwnership";
import { shouldMint } from "../shared/mint";
import { shouldMintBatch } from "../shared/mintBatch";
import { shouldBalanceOf } from "../shared/balanceOf";
import { shouldBalanceOfBatch } from "../shared/balanceOfBatch";
import { shouldURI } from "../shared/uri";
import { shouldSetApprovalForAll } from "../shared/setApprovalForAll";
import { shouldSafeTransferFrom } from "../shared/safeTransferFrom";
import { shouldSafeBatchTransferFrom } from "../shared/safeBatchTransferFrom";
import { shouldBurn } from "../shared/burn";
import { shouldBurnBatch } from "../shared/burnBatch";
import { shouldSetTokenRoyalty } from "../../shared/royalty/setTokenRoyalty";
import { shouldSetDefaultRoyalty } from "../../shared/royalty/setDefaultRoyalty";
import { shouldGetRoyaltyInfo } from "../../shared/royalty/royaltyInfo";

use(solidity);

describe("ERC1155OBR", function () {
  beforeEach(async function () {
    [this.owner, this.receiver] = await ethers.getSigners();

    const erc1155Factory = await ethers.getContractFactory("ERC1155OBR");
    this.erc1155Instance = await erc1155Factory.deploy(royalty, baseTokenURI);

    const erc1155ReceiverFactory = await ethers.getContractFactory("ERC1155ReceiverMock");
    this.erc1155ReceiverInstance = await erc1155ReceiverFactory.deploy();

    const erc1155NonReceiverFactory = await ethers.getContractFactory("ERC1155NonReceiverMock");
    this.erc1155NonReceiverInstance = await erc1155NonReceiverFactory.deploy();

    this.contractInstance = this.erc1155Instance;
  });

  shouldHaveOwner();
  shouldTransferOwnership();
  shouldRenounceOwnership();
  shouldMint();
  shouldMintBatch();
  shouldBalanceOf();
  shouldBalanceOfBatch();
  shouldURI();
  shouldSetApprovalForAll();
  shouldSafeTransferFrom();
  shouldSafeBatchTransferFrom();
  shouldBurn();
  shouldBurnBatch();
  shouldSetTokenRoyalty();
  shouldSetDefaultRoyalty();
  shouldGetRoyaltyInfo();

  describe("supportsInterface", function () {
    it("should support all interfaces", async function () {
      const supportsIERC1155 = await this.erc1155Instance.supportsInterface("0xd9b67a26");
      expect(supportsIERC1155).to.equal(true);
      const supportsIERC1155MetadataURI = await this.erc1155Instance.supportsInterface("0x0e89341c");
      expect(supportsIERC1155MetadataURI).to.equal(true);
      const supportsIERC165 = await this.erc1155Instance.supportsInterface("0x01ffc9a7");
      expect(supportsIERC165).to.equal(true);
      const supportsInvalidInterface = await this.erc1155Instance.supportsInterface("0xffffffff");
      expect(supportsInvalidInterface).to.equal(false);
    });
  });
});

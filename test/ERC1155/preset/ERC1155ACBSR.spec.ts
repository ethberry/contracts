import { expect, use } from "chai";
import { solidity } from "ethereum-waffle";
import { ethers } from "hardhat";

import { baseTokenURI, DEFAULT_ADMIN_ROLE, MINTER_ROLE, royalty } from "../../constants";

import { shouldHaveRole } from "../../shared/accessControl/hasRoles";
import { shouldGetRoleAdmin } from "../../shared/accessControl/getRoleAdmin";
import { shouldGrantRole } from "../../shared/accessControl/grantRole";
import { shouldRevokeRole } from "../../shared/accessControl/revokeRole";
import { shouldRenounceRole } from "../../shared/accessControl/renounceRole";
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
import { shouldGtTotalSupply } from "../shared/totalSupply";
import { shouldSetTokenRoyalty } from "../../shared/royalty/setTokenRoyalty";
import { shouldSetDefaultRoyalty } from "../../shared/royalty/setDefaultRoyalty";
import { shouldGetRoyaltyInfo } from "../../shared/royalty/royaltyInfo";

use(solidity);

describe("ERC1155ACBSR", function () {
  beforeEach(async function () {
    [this.owner, this.receiver] = await ethers.getSigners();

    const erc1155Factory = await ethers.getContractFactory("ERC1155ACBSR");
    this.erc1155Instance = await erc1155Factory.deploy(royalty, baseTokenURI);

    const erc1155ReceiverFactory = await ethers.getContractFactory("ERC1155ReceiverMock");
    this.erc1155ReceiverInstance = await erc1155ReceiverFactory.deploy();

    const erc1155NonReceiverFactory = await ethers.getContractFactory("ERC1155NonReceiverMock");
    this.erc1155NonReceiverInstance = await erc1155NonReceiverFactory.deploy();

    this.contractInstance = this.erc1155Instance;
  });

  shouldHaveRole(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldGetRoleAdmin(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldGrantRole();
  shouldRevokeRole();
  shouldRenounceRole();
  shouldMint(true);
  shouldMintBatch(true);
  shouldGtTotalSupply();
  shouldBalanceOf();
  shouldBalanceOfBatch();
  shouldURI();
  shouldSetApprovalForAll();
  shouldSafeTransferFrom();
  shouldSafeBatchTransferFrom();
  shouldBurn(true);
  shouldBurnBatch(true);
  shouldSetTokenRoyalty(true);
  shouldSetDefaultRoyalty(true);
  shouldGetRoyaltyInfo();

  describe("supportsInterface", function () {
    it("should support all interfaces", async function () {
      const supportsIERC1155 = await this.erc1155Instance.supportsInterface("0xd9b67a26");
      expect(supportsIERC1155).to.equal(true);
      const supportsIERC1155MetadataURI = await this.erc1155Instance.supportsInterface("0x0e89341c");
      expect(supportsIERC1155MetadataURI).to.equal(true);
      const supportsIERC1155Royalty = await this.erc1155Instance.supportsInterface("0x2a55205a");
      expect(supportsIERC1155Royalty).to.equal(true);
      const supportsIERC165 = await this.erc1155Instance.supportsInterface("0x01ffc9a7");
      expect(supportsIERC165).to.equal(true);
      const supportsIAccessControl = await this.erc1155Instance.supportsInterface("0x7965db0b");
      expect(supportsIAccessControl).to.equal(true);
      const supportsInvalidInterface = await this.erc1155Instance.supportsInterface("0xffffffff");
      expect(supportsInvalidInterface).to.equal(false);
    });
  });
});

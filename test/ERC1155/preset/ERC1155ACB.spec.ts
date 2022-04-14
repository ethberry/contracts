import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";

import { ERC1155ACB, ERC1155NonReceiverMock, ERC1155ReceiverMock } from "../../../typechain-types";
import { baseTokenURI, DEFAULT_ADMIN_ROLE, MINTER_ROLE } from "../../constants";

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

describe("ERC1155ACB", function () {
  let erc1155: ContractFactory;
  let erc1155Receiver: ContractFactory;
  let erc1155NonReceiver: ContractFactory;

  beforeEach(async function () {
    erc1155 = await ethers.getContractFactory("ERC1155ACB");
    erc1155Receiver = await ethers.getContractFactory("ERC1155ReceiverMock");
    erc1155NonReceiver = await ethers.getContractFactory("ERC1155NonReceiverMock");
    [this.owner, this.receiver] = await ethers.getSigners();

    this.erc1155Instance = (await erc1155.deploy(baseTokenURI)) as ERC1155ACB;
    this.erc1155ReceiverInstance = (await erc1155Receiver.deploy()) as ERC1155ReceiverMock;
    this.erc1155NonReceiverInstance = (await erc1155NonReceiver.deploy()) as ERC1155NonReceiverMock;

    this.contractInstance = this.erc1155Instance;
  });

  shouldHaveRole(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldGetRoleAdmin(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldGrantRole();
  shouldRevokeRole();
  shouldRenounceRole();
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

  describe("supportsInterface", function () {
    it("should support all interfaces", async function () {
      const supportsIERC1155 = await this.erc1155Instance.supportsInterface("0xd9b67a26");
      expect(supportsIERC1155).to.equal(true);
      const supportsIERC1155MetadataURI = await this.erc1155Instance.supportsInterface("0x0e89341c");
      expect(supportsIERC1155MetadataURI).to.equal(true);
      const supportsIERC165 = await this.erc1155Instance.supportsInterface("0x01ffc9a7");
      expect(supportsIERC165).to.equal(true);
      const supportsIAccessControl = await this.erc1155Instance.supportsInterface("0x7965db0b");
      expect(supportsIAccessControl).to.equal(true);
      const supportsInvalidInterface = await this.erc1155Instance.supportsInterface("0xffffffff");
      expect(supportsInvalidInterface).to.equal(false);
    });
  });
});

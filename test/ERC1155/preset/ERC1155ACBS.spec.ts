import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";

import { ERC1155ACBS, ERC1155NonReceiverMock, ERC1155ReceiverMock } from "../../../typechain-types";
import { baseTokenURI } from "../../constants";

import { shouldHasRole } from "../shared/accessControl/hasRole";
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

describe("ERC1155ACBS", function () {
  let erc1155: ContractFactory;
  let erc1155Receiver: ContractFactory;
  let erc1155NonReceiver: ContractFactory;

  beforeEach(async function () {
    erc1155 = await ethers.getContractFactory("ERC1155ACBS");
    erc1155Receiver = await ethers.getContractFactory("ERC1155ReceiverMock");
    erc1155NonReceiver = await ethers.getContractFactory("ERC1155NonReceiverMock");
    [this.owner, this.receiver] = await ethers.getSigners();

    this.erc1155Instance = (await erc1155.deploy(baseTokenURI)) as ERC1155ACBS;
    this.erc1155ReceiverInstance = (await erc1155Receiver.deploy()) as ERC1155ReceiverMock;
    this.erc1155NonReceiverInstance = (await erc1155NonReceiver.deploy()) as ERC1155NonReceiverMock;
  });

  shouldHasRole();
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

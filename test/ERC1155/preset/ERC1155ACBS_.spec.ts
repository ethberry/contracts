import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";

import { ERC1155NonReceiverMock, ERC1155ReceiverMock, ERC1155ACBS } from "../../../typechain-types";
import { baseTokenURI, DEFAULT_ADMIN_ROLE, MINTER_ROLE } from "../../constants";

import { shouldMint } from "../shared/mint";
import { shouldMintBatch } from "../shared/mintBatch";
import { shouldBalanceOf } from "../shared/balanceOf";
import { shouldBalanceOfBatch } from "../shared/balanceOfBatch";
import { shouldURI } from "../shared/uri";

describe.only("ERC1155ACBS", function () {
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

  describe("constructor", function () {
    it("Should set the right roles to deployer", async function () {
      const isAdmin = await this.erc1155Instance.hasRole(DEFAULT_ADMIN_ROLE, this.owner.address);
      expect(isAdmin).to.equal(true);
      const isMinter = await this.erc1155Instance.hasRole(MINTER_ROLE, this.owner.address);
      expect(isMinter).to.equal(true);
    });
  });

  shouldMint();
  shouldMintBatch();
  shouldBalanceOf();
  shouldBalanceOfBatch();
  shouldURI();

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

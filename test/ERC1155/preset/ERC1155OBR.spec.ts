import { expect, use } from "chai";
import { solidity } from "ethereum-waffle";
import { ethers } from "hardhat";

import { baseTokenURI, royalty } from "../../constants";
import { shouldERC1155Ownable } from "../shared/ownable";
import { shouldERC1155Base } from "../shared/base";
import { shouldERC1155Royalty } from "../shared/royalty";

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

  shouldERC1155Base();
  shouldERC1155Ownable();
  shouldERC1155Royalty();

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

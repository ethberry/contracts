import { expect, use } from "chai";
import { solidity } from "ethereum-waffle";
import { ethers } from "hardhat";
import { DEFAULT_ADMIN_ROLE, MINTER_ROLE, tokenName, tokenSymbol } from "../../constants";
import { shouldERC721Burnable } from "../shared/basic/burn";
import { shouldERC721Acessible } from "../shared/accessible";
import { shouldERC721Base } from "../shared/basic/base";

use(solidity);

describe("ERC721AB", function () {
  beforeEach(async function () {
    [this.owner, this.receiver] = await ethers.getSigners();

    const erc721Factory = await ethers.getContractFactory("ERC721AB");
    this.erc721Instance = await erc721Factory.deploy(tokenName, tokenSymbol);

    const erc721ReceiverFactory = await ethers.getContractFactory("ERC721ReceiverMock");
    this.erc721ReceiverInstance = await erc721ReceiverFactory.deploy();

    const erc721NonReceiverFactory = await ethers.getContractFactory("ERC721NonReceiverMock");
    this.erc721NonReceiverInstance = await erc721NonReceiverFactory.deploy();

    this.contractInstance = this.erc721Instance;
  });

  shouldERC721Base();
  shouldERC721Acessible(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldERC721Burnable();

  describe("supportsInterface", function () {
    it("should support all interfaces", async function () {
      const supportsIERC721 = await this.erc721Instance.supportsInterface("0x80ac58cd");
      expect(supportsIERC721).to.equal(true);
      const supportsIERC721Metadata = await this.erc721Instance.supportsInterface("0x5b5e139f");
      expect(supportsIERC721Metadata).to.equal(true);
      const supportsIERC165 = await this.erc721Instance.supportsInterface("0x01ffc9a7");
      expect(supportsIERC165).to.equal(true);
      const supportsIAccessControl = await this.erc721Instance.supportsInterface("0x7965db0b");
      expect(supportsIAccessControl).to.equal(true);
      const supportsInvalidInterface = await this.erc721Instance.supportsInterface("0xffffffff");
      expect(supportsInvalidInterface).to.equal(false);
    });
  });
});

import { expect, use } from "chai";
import { solidity } from "ethereum-waffle";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";

import { ERC721ABCER, ERC721NonReceiverMock, ERC721ReceiverMock } from "../../../typechain-types";
import { DEFAULT_ADMIN_ROLE, MINTER_ROLE, royalty, tokenName, tokenSymbol } from "../../constants";
import { shouldERC721Acessible } from "../shared/accessible";
import { shouldERC721Burnable } from "../shared/enumerable/burn";
import { shouldERC721Capped } from "../shared/enumerable/capped";
import { shouldERC721Base } from "../shared/enumerable/base";
import { shouldERC721Royalty } from "../shared/enumerable/royalty";
import { shouldERC721Enumerable } from "../shared/enumerable/enumerable";

use(solidity);

describe("ERC721ABCER", function () {
  let erc721: ContractFactory;
  let erc721Receiver: ContractFactory;
  let erc721NonReceiver: ContractFactory;

  beforeEach(async function () {
    erc721 = await ethers.getContractFactory("ERC721ABCER");
    erc721Receiver = await ethers.getContractFactory("ERC721ReceiverMock");
    erc721NonReceiver = await ethers.getContractFactory("ERC721NonReceiverMock");
    [this.owner, this.receiver] = await ethers.getSigners();

    this.erc721Instance = (await erc721.deploy(tokenName, tokenSymbol, 2, royalty)) as ERC721ABCER;
    this.erc721ReceiverInstance = (await erc721Receiver.deploy()) as ERC721ReceiverMock;
    this.erc721NonReceiverInstance = (await erc721NonReceiver.deploy()) as ERC721NonReceiverMock;

    this.contractInstance = this.erc721Instance;
  });

  shouldERC721Base();
  shouldERC721Acessible(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldERC721Burnable();
  shouldERC721Capped();
  shouldERC721Enumerable();
  shouldERC721Royalty();

  describe("supportsInterface", function () {
    it("should support all interfaces", async function () {
      const supportsIERC721 = await this.erc721Instance.supportsInterface("0x80ac58cd");
      expect(supportsIERC721).to.equal(true);
      const supportsIERC721Metadata = await this.erc721Instance.supportsInterface("0x5b5e139f");
      expect(supportsIERC721Metadata).to.equal(true);
      const supportsIERC721Enumerable = await this.erc721Instance.supportsInterface("0x780e9d63");
      expect(supportsIERC721Enumerable).to.equal(true);
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

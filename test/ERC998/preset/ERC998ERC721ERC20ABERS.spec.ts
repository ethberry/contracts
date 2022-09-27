import { expect, use } from "chai";
import { solidity } from "ethereum-waffle";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";

import {
  ERC20ABCS,
  ERC721ABCE,
  ERC721NonReceiverMock,
  ERC721ReceiverMock,
  ERC998ERC721ERC20ABERS,
} from "../../../typechain-types";
import { amount, DEFAULT_ADMIN_ROLE, MINTER_ROLE, royalty, tokenName, tokenSymbol } from "../../constants";

import { shouldSafeTransferFrom } from "../shared/safeTransferFrom";
import { shouldSafeTransferChild } from "../shared/safeTransferChild";
import { shouldTransferChild } from "../shared/transferChild";
import { shouldChildExists } from "../shared/childExists";
import { shouldGetERC20 } from "../shared/getERC20";
import { shouldBalanceOfERC20 } from "../shared/balanceOfERC20";
import { shouldERC721Base } from "../../ERC721/shared/enumerable/base";
import { shouldERC721Acessible } from "../../ERC721/shared/accessible";
import { shouldERC721Burnable } from "../../ERC721/shared/enumerable/burn";
import { shouldERC721Enumerable } from "../../ERC721/shared/enumerable/enumerable";
import { shouldERC721Royalty } from "../../ERC721/shared/enumerable/royalty";
import { shouldERC721Storage } from "../../ERC721/shared/enumerable/storage";

use(solidity);

describe("ERC998ERC721ERC20ABERS", function () {
  let erc20: ContractFactory;
  let erc721: ContractFactory;
  let erc998: ContractFactory;
  let erc721Receiver: ContractFactory;
  let erc721NonReceiver: ContractFactory;

  beforeEach(async function () {
    erc20 = await ethers.getContractFactory("ERC20ABCS");
    erc721 = await ethers.getContractFactory("ERC721ABCE");
    erc998 = await ethers.getContractFactory("ERC998ERC721ERC20ABERS");
    erc721Receiver = await ethers.getContractFactory("ERC721ReceiverMock");
    erc721NonReceiver = await ethers.getContractFactory("ERC721NonReceiverMock");
    [this.owner, this.receiver] = await ethers.getSigners();

    this.erc20Instance = (await erc20.deploy(tokenName, tokenSymbol, amount)) as ERC20ABCS;
    this.erc721InstanceMock = (await erc721.deploy(tokenName, tokenSymbol, 2)) as ERC721ABCE;
    this.erc721Instance = (await erc998.deploy(tokenName, tokenSymbol, royalty)) as ERC998ERC721ERC20ABERS;
    this.erc721ReceiverInstance = (await erc721Receiver.deploy()) as ERC721ReceiverMock;
    this.erc721NonReceiverInstance = (await erc721NonReceiver.deploy()) as ERC721NonReceiverMock;

    this.contractInstance = this.erc721Instance;
  });

  shouldERC721Base();
  shouldERC721Acessible(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldERC721Burnable();
  shouldERC721Enumerable();
  shouldERC721Royalty();
  shouldERC721Storage();

  shouldSafeTransferFrom();
  shouldSafeTransferChild();
  shouldTransferChild();
  shouldChildExists();

  shouldGetERC20();
  shouldBalanceOfERC20();

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
      const supportsERC998 = await this.erc721Instance.supportsInterface("0x1bc995e4");
      expect(supportsERC998).to.equal(true);
      const supportsInvalidInterface = await this.erc721Instance.supportsInterface("0xffffffff");
      expect(supportsInvalidInterface).to.equal(false);
    });
  });
});

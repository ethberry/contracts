import { expect, use } from "chai";
import { solidity } from "ethereum-waffle";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";

import { ERC721ABCE, ERC721NonReceiverMock, ERC721ReceiverMock, ERC998ERC721ABERSWL } from "../../../typechain-types";
import { DEFAULT_ADMIN_ROLE, MINTER_ROLE, royalty, tokenName, tokenSymbol } from "../../constants";
import { testsWhiteListChildTD } from "../shared/sharedWhiteListChild/testsWhiteListChildTD";
import { shouldWhiteListChild } from "../shared/sharedWhiteListChild/whiteListChild";
import { shouldERC721Base } from "../../ERC721/shared/enumerable/base";
import { shouldERC721Accessible } from "../../ERC721/shared/accessible";
import { shouldERC721Burnable } from "../../ERC721/shared/enumerable/burn";
import { shouldERC721Enumerable } from "../../ERC721/shared/enumerable/enumerable";
import { shouldERC721Royalty } from "../../ERC721/shared/enumerable/royalty";
import { shouldERC721Storage } from "../../ERC721/shared/enumerable/storage";

use(solidity);

describe("ERC998ERC721ABERSWL", function () {
  const name = "ERC998ERC721ABERSWL";

  let erc721: ContractFactory;
  let erc998: ContractFactory;
  let erc721Receiver: ContractFactory;
  let erc721NonReceiver: ContractFactory;

  beforeEach(async function () {
    erc721 = await ethers.getContractFactory("ERC721ABCE");
    erc998 = await ethers.getContractFactory("ERC998ERC721ABERSWL");
    erc721Receiver = await ethers.getContractFactory("ERC721ReceiverMock");
    erc721NonReceiver = await ethers.getContractFactory("ERC721NonReceiverMock");
    [this.owner, this.receiver] = await ethers.getSigners();

    this.erc721InstanceMock = (await erc721.deploy(tokenName, tokenSymbol, 2)) as ERC721ABCE;
    this.erc721Instance = (await erc998.deploy(tokenName, tokenSymbol, royalty)) as ERC998ERC721ABERSWL;
    this.erc721ReceiverInstance = (await erc721Receiver.deploy()) as ERC721ReceiverMock;
    this.erc721NonReceiverInstance = (await erc721NonReceiver.deploy()) as ERC721NonReceiverMock;

    this.contractInstance = this.erc721Instance;
  });

  shouldERC721Base(name);
  shouldERC721Accessible(name)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldERC721Burnable(name);
  shouldERC721Enumerable(name);
  shouldERC721Royalty(name);
  shouldERC721Storage(name);

  testsWhiteListChildTD();

  describe("getChild", function () {
    it("should get child", async function () {
      await this.erc721Instance.whiteListChild(this.erc721InstanceMock.address, 0);
      await this.erc721Instance.setDefaultMaxChild(0);
      await this.erc721InstanceMock.mint(this.owner.address);
      await this.erc721InstanceMock.approve(this.erc721Instance.address, 0);
      await this.erc721Instance.mint(this.owner.address); // this is edge case
      await this.erc721Instance.mint(this.owner.address);

      const tx1 = this.erc721Instance.getChild(this.owner.address, 1, this.erc721InstanceMock.address, 0);

      await expect(tx1).to.be.revertedWith(`CTD: this method is not supported`);
    });
  });

  shouldWhiteListChild();
});

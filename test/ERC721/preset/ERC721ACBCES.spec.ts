import { ethers } from "hardhat";
import { ContractFactory } from "ethers";

import { ERC721ACBCES, ERC721NonReceiverMock, ERC721ReceiverMock } from "../../../typechain-types";
import { baseTokenURI, tokenName, tokenSymbol } from "../../constants";

import { shouldMint } from "../shared/mint";

describe.only("ERC721ACBCES", function () {
  let erc721: ContractFactory;
  let nftReceiver: ContractFactory;
  let nftNonReceiver: ContractFactory;

  beforeEach(async function () {
    erc721 = await ethers.getContractFactory("ERC721ACBCES");
    nftReceiver = await ethers.getContractFactory("ERC721ReceiverMock");
    nftNonReceiver = await ethers.getContractFactory("ERC721NonReceiverMock");
    [this.owner, this.receiver] = await ethers.getSigners();

    this.erc721Instance = (await erc721.deploy(tokenName, tokenSymbol, baseTokenURI, 2)) as ERC721ACBCES;
    this.nftReceiverInstance = (await nftReceiver.deploy()) as ERC721ReceiverMock;
    this.nftNonReceiverInstance = (await nftNonReceiver.deploy()) as ERC721NonReceiverMock;
  });

  shouldMint();
});

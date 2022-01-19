/*const {
    shouldBehaveLikeERC721,
    shouldBehaveLikeERC721Metadata,
  } = require('./ERC721.behavior');
  
  const ERC721Mock = artifacts.require('ERC721Mock');
  
  contract('ERC721', function (accounts) {
    const name = 'Non Fungible Token';
    const symbol = 'NFT';
  
    beforeEach(async function () {
      this.token = await ERC721Mock.new(name, symbol);
    });
  
    shouldBehaveLikeERC721('ERC721', ...accounts);
    shouldBehaveLikeERC721Metadata('ERC721', name, symbol, ...accounts);
  });
*/

import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { ERC721NonReceiverMock, ERC721ReceiverMock, ERC721ACBCES } from "../../../typechain-types";
import { baseTokenURI, DEFAULT_ADMIN_ROLE, MINTER_ROLE, tokenName, tokenSymbol } from "../../constants";

import { ERC721TestInterface } from "./Interfaces/ERC721TestInterface";

import { shouldBehaveLikeERC721 } from "./ERC721.behavior";
/*const {
    shouldBehaveLikeERC721,
//    shouldBehaveLikeERC721Metadata,
  } = require('./ERC721.behavior');*/

describe("ERC721ACBCES", function () {
    let erc721: ContractFactory;
    let erc721Instance: ERC721ACBCES;
    //let erc721Instance: ERC721TestInterface;
    let nftReceiver: ContractFactory;
    let nftReceiverInstance: ERC721ReceiverMock;
    let nftNonReceiver: ContractFactory;
    let nftNonReceiverInstance: ERC721NonReceiverMock;
    let owner: SignerWithAddress;
    let receiver: SignerWithAddress;
  
    beforeEach(async function () {
      erc721 = await ethers.getContractFactory("ERC721ACBCES");
      nftReceiver = await ethers.getContractFactory("ERC721ReceiverMock");
      nftNonReceiver = await ethers.getContractFactory("ERC721NonReceiverMock");
      [owner, receiver] = await ethers.getSigners();
  
      erc721Instance = (await erc721.deploy(tokenName, tokenSymbol, baseTokenURI, 2)) as ERC721ACBCES;
      nftReceiverInstance = (await nftReceiver.deploy()) as ERC721ReceiverMock;
      nftNonReceiverInstance = (await nftNonReceiver.deploy()) as ERC721NonReceiverMock;

 //       console.log(`befor shouldBehaveLikeERC721 ${erc721Instance.address}`);
 //     shouldBehaveLikeERC721(erc721Instance, owner, receiver);

    });

    describe("constructor", function () {
        it.only("----------------------------------------", async function () {
            console.log(`constructor erc721Instance ${erc721Instance}`)
            shouldBehaveLikeERC721(erc721Instance, owner, receiver);
        });
        //console.log(`constructor erc721Instance ${erc721Instance}`)
        //shouldBehaveLikeERC721(erc721Instance, owner, receiver);
    });
    
});
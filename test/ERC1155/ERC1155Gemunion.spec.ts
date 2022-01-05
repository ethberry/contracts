import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import {
  ERC1155GemunionTest,
  ERC1155GemunionReceiverTest,
  ERC1155GemunionNonReceiverTest,
} from "../../typechain-types";
import { baseTokenURI, DEFAULT_ADMIN_ROLE, MINTER_ROLE, PAUSER_ROLE } from "../constants";

describe("ERC1155Gemunion", function () {
  let erc1155: ContractFactory;
  let erc1155Instance: ERC1155GemunionTest;
  let nftReceiver: ContractFactory;
  let nftReceiverInstance: ERC1155GemunionReceiverTest;
  let nftNonReceiver: ContractFactory;
  let nftNonReceiverInstance: ERC1155GemunionNonReceiverTest;
  let owner: SignerWithAddress;
  let receiver: SignerWithAddress;

  beforeEach(async function () {
    erc1155 = await ethers.getContractFactory("ERC1155GemunionTest");
    nftReceiver = await ethers.getContractFactory("ERC1155GemunionReceiverTest");
    nftNonReceiver = await ethers.getContractFactory("ERC1155GemunionNonReceiverTest");
    [owner, receiver] = await ethers.getSigners();

    erc1155Instance = (await erc1155.deploy(baseTokenURI)) as ERC1155GemunionTest;
    nftReceiverInstance = (await nftReceiver.deploy()) as ERC1155GemunionReceiverTest;
    nftNonReceiverInstance = (await nftNonReceiver.deploy()) as ERC1155GemunionNonReceiverTest;

    void receiver;
    void nftReceiverInstance;
    void nftNonReceiverInstance;
  });

  describe("constructor", function () {
    it("Should set the right roles to deployer", async function () {
      const isAdmin = await erc1155Instance.hasRole(DEFAULT_ADMIN_ROLE, owner.address);
      expect(isAdmin).to.equal(true);
      const isMinter = await erc1155Instance.hasRole(MINTER_ROLE, owner.address);
      expect(isMinter).to.equal(true);
      const isPauser = await erc1155Instance.hasRole(PAUSER_ROLE, owner.address);
      expect(isPauser).to.equal(true);
    });
  });
});

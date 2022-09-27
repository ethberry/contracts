import { expect, use } from "chai";
import { solidity } from "ethereum-waffle";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";

import { ERC1155BaseUrlTest } from "../../typechain-types";
import { baseTokenURI, tokenId } from "../constants";

use(solidity);

describe("ERC1155BaseUrl", function () {
  let erc1155: ContractFactory;
  let contractInstance: ERC1155BaseUrlTest;

  beforeEach(async function () {
    erc1155 = await ethers.getContractFactory("ERC1155BaseUrlTest");

    contractInstance = (await erc1155.deploy(baseTokenURI)) as ERC1155BaseUrlTest;
  });

  describe("uri", function () {
    it("should get token uri", async function () {
      const uri2 = await contractInstance.uri(tokenId);
      expect(uri2).to.equal(`${baseTokenURI}/${contractInstance.address.toLowerCase()}/{id}`);
    });
  });
});

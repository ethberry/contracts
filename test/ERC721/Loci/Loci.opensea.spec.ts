import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { LociOpenSea, ProxyRegistry } from "../../../typechain";
import { baseTokenURI, tokenName, tokenSymbol } from "../../constants";

describe("Loci OpenSea", function () {
  let nft: ContractFactory;
  let nftInstance: LociOpenSea;
  let proxy: ContractFactory;
  let proxyInstance: ProxyRegistry;
  let owner: SignerWithAddress;

  beforeEach(async function () {
    nft = await ethers.getContractFactory("LociOpenSea");
    proxy = await ethers.getContractFactory("ProxyRegistry");
    [owner] = await ethers.getSigners();

    proxyInstance = (await proxy.deploy()) as ProxyRegistry;
    nftInstance = (await nft.deploy(tokenName, tokenSymbol, baseTokenURI)) as LociOpenSea;

    await nftInstance.setProxyRegistry(proxyInstance.address);
  });

  describe("Deployment", function () {
    it("should set owner", async function () {
      const address = await nftInstance.owner();
      expect(address).to.equal(owner.address);
    });
  });

  // describe("baseTokenURI", function () {
  //   it("should return base token uri", async function () {
  //     const uri = await nftInstance._baseURI();
  //     expect(uri).to.equal(`${baseTokenURI}`);
  //   });
  // });
});

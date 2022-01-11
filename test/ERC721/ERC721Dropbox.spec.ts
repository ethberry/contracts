import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";
import { Network } from "@ethersproject/networks";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import tokens from "./tokens.json";

import { ERC721DropboxTest } from "../../typechain-types";
import { MINTER_ROLE, tokenName, tokenSymbol, baseTokenURI } from "../constants";

describe("ERC721Dropbox", function () {
  let erc721: ContractFactory;
  let erc721Instance: ERC721DropboxTest;
  let owner: SignerWithAddress;
  let receiver: SignerWithAddress;
  let addr2: SignerWithAddress;
  let network: Network;

  beforeEach(async function () {
    erc721 = await ethers.getContractFactory("ERC721DropboxTest");
    [owner, receiver, addr2] = await ethers.getSigners();

    erc721Instance = (await erc721.deploy(tokenName, tokenSymbol, baseTokenURI)) as ERC721DropboxTest;

    await erc721Instance.grantRole(MINTER_ROLE, receiver.address);

    network = await ethers.provider.getNetwork();
  });

  describe("Mint all elements", function () {
    it("element", async function () {
      for (const [tokenId, account] of Object.entries(tokens)) {
        const signature = await receiver._signTypedData(
          // Domain
          {
            name: tokenName,
            version: "1.0.0",
            chainId: network.chainId,
            verifyingContract: erc721Instance.address,
          },
          // Types
          {
            NFT: [
              { name: "tokenId", type: "uint256" },
              { name: "account", type: "address" },
            ],
          },
          // Value
          { tokenId, account },
        );

        await expect(erc721Instance.connect(addr2).redeem(account, tokenId, receiver.address, signature))
          .to.emit(erc721Instance, "Transfer")
          .withArgs(ethers.constants.AddressZero, account, tokenId);
      }
    });
  });

  describe("Duplicate mint", function () {
    it("element", async function () {
      const tokenId = Object.keys(tokens)[0];
      const account = Object.values(tokens)[0];
      const signature = await receiver._signTypedData(
        // Domain
        {
          name: tokenName,
          version: "1.0.0",
          chainId: network.chainId,
          verifyingContract: erc721Instance.address,
        },
        // Types
        {
          NFT: [
            { name: "tokenId", type: "uint256" },
            { name: "account", type: "address" },
          ],
        },
        // Value
        { tokenId, account },
      );

      await expect(erc721Instance.redeem(account, tokenId, receiver.address, signature))
        .to.emit(erc721Instance, "Transfer")
        .withArgs(ethers.constants.AddressZero, account, tokenId);

      await expect(erc721Instance.redeem(account, tokenId, receiver.address, signature)).to.be.revertedWith(
        "ERC721: token already minted",
      );
    });
  });

  describe("Frontrun", function () {
    it("element", async function () {
      const tokenId = Object.keys(tokens)[0];
      const account = Object.values(tokens)[0];
      const signature = await receiver._signTypedData(
        // Domain
        {
          name: tokenName,
          version: "1.0.0",
          chainId: network.chainId,
          verifyingContract: erc721Instance.address,
        },
        // Types
        {
          NFT: [
            { name: "tokenId", type: "uint256" },
            { name: "account", type: "address" },
          ],
        },
        // Value
        { tokenId, account },
      );

      await expect(erc721Instance.redeem(owner.address, tokenId, receiver.address, signature)).to.be.revertedWith(
        "Invalid signature",
      );
    });
  });
});

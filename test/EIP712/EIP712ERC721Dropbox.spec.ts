import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";
import { Network } from "@ethersproject/networks";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import tokens from "./tokens.json";
import { EIP712ERC721Dropbox, ERC721DroppableTest } from "../../typechain-types";
import { MINTER_ROLE, tokenName, tokenSymbol, baseTokenURI } from "../constants";

describe("EIP712ERC721Dropbox", function () {
  let erc721: ContractFactory;
  let erc721Instance: ERC721DroppableTest;
  let dropbox: ContractFactory;
  let dropboxInstance: EIP712ERC721Dropbox;
  let owner: SignerWithAddress;
  let receiver: SignerWithAddress;
  let addr2: SignerWithAddress;
  let network: Network;

  beforeEach(async function () {
    erc721 = await ethers.getContractFactory("ERC721DroppableTest");
    dropbox = await ethers.getContractFactory("EIP712ERC721Dropbox");
    [owner, receiver, addr2] = await ethers.getSigners();

    erc721Instance = (await erc721.deploy(tokenName, tokenSymbol, baseTokenURI)) as ERC721DroppableTest;
    dropboxInstance = (await dropbox.deploy(tokenName)) as EIP712ERC721Dropbox;

    await dropboxInstance.setFactory(erc721Instance.address);
    await erc721Instance.grantRole(MINTER_ROLE, dropboxInstance.address);

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
            verifyingContract: dropboxInstance.address,
          },
          // Types
          {
            NFT: [
              { name: "account", type: "address" },
              { name: "tokenId", type: "uint256" },
            ],
          },
          // Value
          { account, tokenId },
        );

        await expect(dropboxInstance.connect(addr2).redeem(account, tokenId, receiver.address, signature))
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
          verifyingContract: dropboxInstance.address,
        },
        // Types
        {
          NFT: [
            { name: "account", type: "address" },
            { name: "tokenId", type: "uint256" },
          ],
        },
        // Value
        { account, tokenId },
      );

      await expect(dropboxInstance.redeem(account, tokenId, receiver.address, signature))
        .to.emit(erc721Instance, "Transfer")
        .withArgs(ethers.constants.AddressZero, account, tokenId);

      await expect(dropboxInstance.redeem(account, tokenId, receiver.address, signature)).to.be.revertedWith(
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
          verifyingContract: dropboxInstance.address,
        },
        // Types
        {
          NFT: [
            { name: "account", type: "address" },
            { name: "tokenId", type: "uint256" },
          ],
        },
        // Value
        { account, tokenId },
      );

      await expect(dropboxInstance.redeem(owner.address, tokenId, receiver.address, signature)).to.be.revertedWith(
        "EIP712ERC721Dropbox: Invalid signature",
      );
    });
  });
});

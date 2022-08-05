import { expect, use } from "chai";
import { solidity } from "ethereum-waffle";
import { ethers } from "hardhat";
import { Network } from "@ethersproject/networks";

import { DEFAULT_ADMIN_ROLE, MINTER_ROLE, tokenId, tokenName, tokenSymbol } from "../constants";
import { shouldHaveRole } from "../shared/accessControl/hasRoles";

use(solidity);

describe("ERC721Dropbox", function () {
  let network: Network;

  beforeEach(async function () {
    [this.owner, this.receiver] = await ethers.getSigners();

    const erc721Factory = await ethers.getContractFactory("ERC721DropboxTest");
    this.erc721Instance = await erc721Factory.deploy(tokenName, tokenSymbol, 1);

    network = await ethers.provider.getNetwork();

    this.contractInstance = this.erc721Instance;
  });

  shouldHaveRole(DEFAULT_ADMIN_ROLE, MINTER_ROLE);

  describe("redeem", function () {
    it("should redeem", async function () {
      const signature = await this.owner._signTypedData(
        // Domain
        {
          name: tokenName,
          version: "1.0.0",
          chainId: network.chainId,
          verifyingContract: this.erc721Instance.address,
        },
        // Types
        {
          EIP712: [
            { name: "account", type: "address" },
            { name: "tokenId", type: "uint256" },
          ],
        },
        // Value
        {
          account: this.receiver.address,
          tokenId,
        },
      );

      const tx1 = this.erc721Instance
        .connect(this.receiver)
        .redeem(this.receiver.address, tokenId, this.owner.address, signature);
      await expect(tx1).to.emit(this.erc721Instance, "Redeem").withArgs(this.receiver.address, tokenId);

      const ownerOf = await this.erc721Instance.ownerOf(tokenId);
      expect(ownerOf).to.equal(this.receiver.address);
    });

    it("should fail: account is missing role", async function () {
      const signature = await this.owner._signTypedData(
        // Domain
        {
          name: tokenName,
          version: "1.0.0",
          chainId: network.chainId,
          verifyingContract: this.erc721Instance.address,
        },
        // Types
        {
          EIP712: [
            { name: "account", type: "address" },
            { name: "tokenId", type: "uint256" },
          ],
        },
        // Value
        {
          account: this.receiver.address,
          tokenId,
        },
      );

      const tx1 = this.erc721Instance
        .connect(this.receiver)
        .redeem(this.receiver.address, tokenId, this.receiver.address, signature);
      await expect(tx1).to.be.revertedWith(
        `AccessControl: account ${this.receiver.address.toLowerCase()} is missing role ${MINTER_ROLE}`,
      );
    });

    it("should fail: invalid signature", async function () {
      const tx1 = this.erc721Instance
        .connect(this.receiver)
        .redeem(this.receiver.address, tokenId, this.owner.address, ethers.utils.formatBytes32String("signature"));
      await expect(tx1).to.be.revertedWith("ERC721Dropbox: Invalid signature");
    });

    it("should fail: token already minted", async function () {
      const signature = await this.owner._signTypedData(
        // Domain
        {
          name: tokenName,
          version: "1.0.0",
          chainId: network.chainId,
          verifyingContract: this.erc721Instance.address,
        },
        // Types
        {
          EIP712: [
            { name: "account", type: "address" },
            { name: "tokenId", type: "uint256" },
          ],
        },
        // Value
        {
          account: this.receiver.address,
          tokenId,
        },
      );

      const tx1 = this.erc721Instance
        .connect(this.receiver)
        .redeem(this.receiver.address, tokenId, this.owner.address, signature);
      await expect(tx1).to.emit(this.erc721Instance, "Redeem").withArgs(this.receiver.address, tokenId);

      const tx2 = this.erc721Instance
        .connect(this.receiver)
        .redeem(this.receiver.address, tokenId, this.owner.address, signature);
      await expect(tx2).to.be.revertedWith("ERC721: token already minted");
    });

    it("should fail: cap exceeded", async function () {
      const signature = await this.owner._signTypedData(
        // Domain
        {
          name: tokenName,
          version: "1.0.0",
          chainId: network.chainId,
          verifyingContract: this.erc721Instance.address,
        },
        // Types
        {
          EIP712: [
            { name: "account", type: "address" },
            { name: "tokenId", type: "uint256" },
          ],
        },
        // Value
        {
          account: this.receiver.address,
          tokenId,
        },
      );

      const tx1 = this.erc721Instance
        .connect(this.receiver)
        .redeem(this.receiver.address, tokenId, this.owner.address, signature);
      await expect(tx1).to.emit(this.erc721Instance, "Redeem").withArgs(this.receiver.address, tokenId);

      const newTokenId = 2;

      const signature2 = await this.owner._signTypedData(
        // Domain
        {
          name: tokenName,
          version: "1.0.0",
          chainId: network.chainId,
          verifyingContract: this.erc721Instance.address,
        },
        // Types
        {
          EIP712: [
            { name: "account", type: "address" },
            { name: "tokenId", type: "uint256" },
          ],
        },
        // Value
        {
          account: this.receiver.address,
          tokenId: newTokenId,
        },
      );

      const tx2 = this.erc721Instance
        .connect(this.receiver)
        .redeem(this.receiver.address, newTokenId, this.owner.address, signature2);
      await expect(tx2).to.be.revertedWith("ERC721Capped: cap exceeded");
    });
  });
});

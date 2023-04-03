import { expect } from "chai";
import { ethers } from "hardhat";
import { utils } from "ethers";

import { DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE, nonce, tokenId, tokenName } from "@gemunion/contracts-constants";
import { shouldBehaveLikeAccessControl, shouldSupportsInterface } from "@gemunion/contracts-mocha";

import { shouldBehaveLikeERC721, shouldBehaveLikeERC721Burnable, shouldBehaveLikeERC721Royalty } from "../../src";
import { deployERC721 } from "../../src/fixtures";

describe("ERC721DropboxTest", function () {
  const factory = () => deployERC721(this.title);

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);

  shouldBehaveLikeERC721(factory);
  shouldBehaveLikeERC721Burnable(factory);
  shouldBehaveLikeERC721Royalty(factory);

  describe("redeem", function () {
    it("should redeem", async function () {
      const network = await ethers.provider.getNetwork();
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const signature = await owner._signTypedData(
        // Domain
        {
          name: tokenName,
          version: "1.0.0",
          chainId: network.chainId,
          verifyingContract: contractInstance.address,
        },
        // Types
        {
          EIP712: [
            { name: "nonce", type: "bytes32" },
            { name: "account", type: "address" },
            { name: "tokenId", type: "uint256" },
          ],
        },
        // Value
        {
          nonce,
          account: receiver.address,
          tokenId,
        },
      );

      const tx1 = contractInstance.connect(receiver).redeem(nonce, receiver.address, tokenId, owner.address, signature);
      await expect(tx1).to.emit(contractInstance, "Redeem").withArgs(receiver.address, tokenId);

      const ownerOf = await contractInstance.ownerOf(tokenId);
      expect(ownerOf).to.equal(receiver.address);
    });

    it("should fail: account is missing role", async function () {
      const network = await ethers.provider.getNetwork();
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const signature = await owner._signTypedData(
        // Domain
        {
          name: tokenName,
          version: "1.0.0",
          chainId: network.chainId,
          verifyingContract: contractInstance.address,
        },
        // Types
        {
          EIP712: [
            { name: "nonce", type: "bytes32" },
            { name: "account", type: "address" },
            { name: "tokenId", type: "uint256" },
          ],
        },
        // Value
        {
          nonce,
          account: receiver.address,
          tokenId,
        },
      );

      const tx1 = contractInstance
        .connect(receiver)
        .redeem(nonce, receiver.address, tokenId, receiver.address, signature);
      await expect(tx1).to.be.revertedWith(
        `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${MINTER_ROLE}`,
      );
    });

    it("should fail: invalid signature", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx1 = contractInstance
        .connect(receiver)
        .redeem(nonce, receiver.address, tokenId, owner.address, ethers.utils.formatBytes32String("signature"));
      await expect(tx1).to.be.revertedWith("ERC721Dropbox: Invalid signature");
    });

    it("should fail: expired signature", async function () {
      const network = await ethers.provider.getNetwork();
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const signature = await owner._signTypedData(
        // Domain
        {
          name: tokenName,
          version: "1.0.0",
          chainId: network.chainId,
          verifyingContract: contractInstance.address,
        },
        // Types
        {
          EIP712: [
            { name: "nonce", type: "bytes32" },
            { name: "account", type: "address" },
            { name: "tokenId", type: "uint256" },
          ],
        },
        // Value
        {
          nonce,
          account: receiver.address,
          tokenId,
        },
      );

      const tx1 = contractInstance.connect(receiver).redeem(nonce, receiver.address, tokenId, owner.address, signature);
      await expect(tx1).to.emit(contractInstance, "Redeem").withArgs(receiver.address, tokenId);

      const tx2 = contractInstance.connect(receiver).redeem(nonce, receiver.address, tokenId, owner.address, signature);
      await expect(tx2).to.be.revertedWith("ERC721Dropbox: Expired signature");
    });

    it("should fail: token already minted", async function () {
      const network = await ethers.provider.getNetwork();
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const signature = await owner._signTypedData(
        // Domain
        {
          name: tokenName,
          version: "1.0.0",
          chainId: network.chainId,
          verifyingContract: contractInstance.address,
        },
        // Types
        {
          EIP712: [
            { name: "nonce", type: "bytes32" },
            { name: "account", type: "address" },
            { name: "tokenId", type: "uint256" },
          ],
        },
        // Value
        {
          nonce,
          account: receiver.address,
          tokenId,
        },
      );

      const tx1 = contractInstance.connect(receiver).redeem(nonce, receiver.address, tokenId, owner.address, signature);
      await expect(tx1).to.emit(contractInstance, "Redeem").withArgs(receiver.address, tokenId);

      const newNonce = utils.formatBytes32String("nonce1");

      const signature2 = await owner._signTypedData(
        // Domain
        {
          name: tokenName,
          version: "1.0.0",
          chainId: network.chainId,
          verifyingContract: contractInstance.address,
        },
        // Types
        {
          EIP712: [
            { name: "nonce", type: "bytes32" },
            { name: "account", type: "address" },
            { name: "tokenId", type: "uint256" },
          ],
        },
        // Value
        {
          nonce: newNonce,
          account: receiver.address,
          tokenId,
        },
      );

      const tx2 = contractInstance
        .connect(receiver)
        .redeem(newNonce, receiver.address, tokenId, owner.address, signature2);
      await expect(tx2).to.be.revertedWith("ERC721: token already minted");
    });

    it("should fail: cap exceeded", async function () {
      const network = await ethers.provider.getNetwork();
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const signature = await owner._signTypedData(
        // Domain
        {
          name: tokenName,
          version: "1.0.0",
          chainId: network.chainId,
          verifyingContract: contractInstance.address,
        },
        // Types
        {
          EIP712: [
            { name: "nonce", type: "bytes32" },
            { name: "account", type: "address" },
            { name: "tokenId", type: "uint256" },
          ],
        },
        // Value
        {
          nonce,
          account: receiver.address,
          tokenId,
        },
      );

      const tx1 = contractInstance.connect(receiver).redeem(nonce, receiver.address, tokenId, owner.address, signature);
      await expect(tx1).to.emit(contractInstance, "Redeem").withArgs(receiver.address, tokenId);

      const tokenId2 = 2;
      const nonce2 = utils.formatBytes32String("nonce2");

      const signature2 = await owner._signTypedData(
        // Domain
        {
          name: tokenName,
          version: "1.0.0",
          chainId: network.chainId,
          verifyingContract: contractInstance.address,
        },
        // Types
        {
          EIP712: [
            { name: "nonce", type: "bytes32" },
            { name: "account", type: "address" },
            { name: "tokenId", type: "uint256" },
          ],
        },
        // Value
        {
          nonce: nonce2,
          account: receiver.address,
          tokenId: tokenId2,
        },
      );

      const tx2 = contractInstance
        .connect(receiver)
        .redeem(nonce2, receiver.address, tokenId2, owner.address, signature2);
      await expect(tx2).to.emit(contractInstance, "Redeem").withArgs(receiver.address, tokenId2);

      const tokenId3 = 3;
      const nonce3 = utils.formatBytes32String("nonce3");

      const signature3 = await owner._signTypedData(
        // Domain
        {
          name: tokenName,
          version: "1.0.0",
          chainId: network.chainId,
          verifyingContract: contractInstance.address,
        },
        // Types
        {
          EIP712: [
            { name: "nonce", type: "bytes32" },
            { name: "account", type: "address" },
            { name: "tokenId", type: "uint256" },
          ],
        },
        // Value
        {
          nonce: nonce3,
          account: receiver.address,
          tokenId: tokenId3,
        },
      );

      const tx3 = contractInstance
        .connect(receiver)
        .redeem(nonce3, receiver.address, tokenId3, owner.address, signature3);
      await expect(tx3).to.be.revertedWith("ERC721Capped: cap exceeded");
    });
  });

  shouldSupportsInterface(factory)(
    InterfaceId.IERC165,
    InterfaceId.IAccessControl,
    InterfaceId.IERC721,
    InterfaceId.IERC721Metadata,
    InterfaceId.IRoyalty,
  );
});

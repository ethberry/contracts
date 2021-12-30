import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import {
  ERC998ComposableTopDownTest,
  ERC998GemunionNonReceiverTest,
  ERC998GemunionReceiverTest,
} from "../../typechain-types";
import {
  baseTokenURI,
  DEFAULT_ADMIN_ROLE,
  MINTER_ROLE,
  PAUSER_ROLE,
  tokenName,
  tokenSymbol,
  ZERO_ADDR,
} from "../constants";

describe("ERC998ComposableTopDown", function () {
  let nft: ContractFactory;
  let nftInstance: ERC998ComposableTopDownTest;
  let nftReceiver: ContractFactory;
  let nftReceiverInstance: ERC998GemunionReceiverTest;
  let nftNonReceiver: ContractFactory;
  let nftNonReceiverInstance: ERC998GemunionNonReceiverTest;
  let owner: SignerWithAddress;
  let receiver: SignerWithAddress;

  beforeEach(async function () {
    nft = await ethers.getContractFactory("ERC998ComposableTopDownTest");
    nftReceiver = await ethers.getContractFactory("ERC998GemunionReceiverTest");
    nftNonReceiver = await ethers.getContractFactory("ERC998GemunionNonReceiverTest");
    [owner, receiver] = await ethers.getSigners();

    nftInstance = (await nft.deploy(tokenName, tokenSymbol, baseTokenURI)) as ERC998ComposableTopDownTest;
    nftReceiverInstance = (await nftReceiver.deploy(tokenName, tokenSymbol)) as ERC998GemunionReceiverTest;
    nftNonReceiverInstance = (await nftNonReceiver.deploy(tokenName, tokenSymbol)) as ERC998GemunionNonReceiverTest;
  });

  describe("constructor", function () {
    it("Should set the right roles to deployer", async function () {
      const isAdmin = await nftInstance.hasRole(DEFAULT_ADMIN_ROLE, owner.address);
      expect(isAdmin).to.equal(true);
      const isMinter = await nftInstance.hasRole(MINTER_ROLE, owner.address);
      expect(isMinter).to.equal(true);
      const isPauser = await nftInstance.hasRole(PAUSER_ROLE, owner.address);
      expect(isPauser).to.equal(true);
    });
  });

  describe("safeMint", function () {
    it("should fail for wrong role", async function () {
      const tx = nftInstance.connect(receiver).safeMint(receiver.address);
      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${MINTER_ROLE}`,
      );
    });

    it("should mint to wallet", async function () {
      const tx = nftInstance.safeMint(owner.address);
      await expect(tx).to.emit(nftInstance, "Transfer").withArgs(ZERO_ADDR, owner.address, 0);

      const balance = await nftInstance.balanceOf(owner.address);
      expect(balance).to.equal(1);
    });

    it("should fail to mint to non receiver", async function () {
      const tx = nftInstance.safeMint(nftNonReceiverInstance.address);
      await expect(tx).to.be.revertedWith(`ERC721: transfer to non ERC721Receiver implementer`);
    });

    it("should mint to receiver", async function () {
      const tx = nftInstance.safeMint(nftReceiverInstance.address);
      await expect(tx).to.emit(nftInstance, "Transfer").withArgs(ZERO_ADDR, nftReceiverInstance.address, 0);

      const balance = await nftInstance.balanceOf(nftReceiverInstance.address);
      expect(balance).to.equal(1);
    });
  });

  describe("balanceOf", function () {
    it("should fail for zero addr", async function () {
      const tx = nftInstance.balanceOf(ZERO_ADDR);
      await expect(tx).to.be.revertedWith(`ComposableTopDown: balanceOf _tokenOwner zero address`);
    });

    it("should get balance of owner", async function () {
      await nftInstance.safeMint(owner.address);
      const balance = await nftInstance.balanceOf(owner.address);
      expect(balance).to.equal(1);
    });

    it("should get balance of not owner", async function () {
      await nftInstance.safeMint(owner.address);
      const balance = await nftInstance.balanceOf(receiver.address);
      expect(balance).to.equal(0);
    });
  });

  describe("supportsInterface", function () {
    it("should support all interfaces", async function () {
      const supportsIERC721 = await nftInstance.supportsInterface("0x80ac58cd");
      expect(supportsIERC721).to.equal(true);
      const supportsIERC721Metadata = await nftInstance.supportsInterface("0x5b5e139f");
      expect(supportsIERC721Metadata).to.equal(true);
      const supportsIERC721Enumerable = await nftInstance.supportsInterface("0x780e9d63");
      expect(supportsIERC721Enumerable).to.equal(true);

      const supportsIERC165 = await nftInstance.supportsInterface("0x01ffc9a7");
      expect(supportsIERC165).to.equal(true);

      const supportsIAccessControl = await nftInstance.supportsInterface("0x7965db0b");
      expect(supportsIAccessControl).to.equal(true);
      const supportsIAccessControlEnumerable = await nftInstance.supportsInterface("0x5a05180f");
      expect(supportsIAccessControlEnumerable).to.equal(true);

      const supportsERC998 = await nftInstance.supportsInterface("0x1bc995e4");
      expect(supportsERC998).to.equal(true);

      const supportsInvalidInterface = await nftInstance.supportsInterface("0xffffffff");
      expect(supportsInvalidInterface).to.equal(false);
    });
  });
});

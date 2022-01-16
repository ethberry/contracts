import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import {
  ERC20GemunionTest,
  ERC721GemunionNonReceiverTest,
  ERC721GemunionReceiverTest,
  ERC721GemunionTest,
  ERC998ComposableTopDownTest,
} from "../../typechain-types";
import { amount, baseTokenURI, DEFAULT_ADMIN_ROLE, MINTER_ROLE, tokenName, tokenSymbol } from "../constants";

describe("ERC998ComposableTopDown", function () {
  let erc20: ContractFactory;
  let erc20Instance: ERC20GemunionTest;
  let erc721: ContractFactory;
  let erc721Instance: ERC721GemunionTest;
  let erc998: ContractFactory;
  let erc998Instance: ERC998ComposableTopDownTest;
  let nftReceiver: ContractFactory;
  let nftReceiverInstance: ERC721GemunionReceiverTest;
  let nftNonReceiver: ContractFactory;
  let nftNonReceiverInstance: ERC721GemunionNonReceiverTest;
  let owner: SignerWithAddress;
  let receiver: SignerWithAddress;

  beforeEach(async function () {
    erc20 = await ethers.getContractFactory("ERC20GemunionTest");
    erc721 = await ethers.getContractFactory("ERC721GemunionTest");
    erc998 = await ethers.getContractFactory("ERC998ComposableTopDownTest");
    nftReceiver = await ethers.getContractFactory("ERC721GemunionReceiverTest");
    nftNonReceiver = await ethers.getContractFactory("ERC721GemunionNonReceiverTest");
    [owner, receiver] = await ethers.getSigners();

    erc20Instance = (await erc20.deploy(tokenName, tokenSymbol)) as ERC20GemunionTest;
    erc721Instance = (await erc721.deploy(tokenName, tokenSymbol, baseTokenURI)) as ERC721GemunionTest;
    erc998Instance = (await erc998.deploy(tokenName, tokenSymbol, baseTokenURI)) as ERC998ComposableTopDownTest;
    nftReceiverInstance = (await nftReceiver.deploy()) as ERC721GemunionReceiverTest;
    nftNonReceiverInstance = (await nftNonReceiver.deploy()) as ERC721GemunionNonReceiverTest;
  });

  describe("constructor", function () {
    it("Should set the right roles to deployer", async function () {
      const isAdmin = await erc998Instance.hasRole(DEFAULT_ADMIN_ROLE, owner.address);
      expect(isAdmin).to.equal(true);
      const isMinter = await erc998Instance.hasRole(MINTER_ROLE, owner.address);
      expect(isMinter).to.equal(true);
    });
  });

  describe("mint", function () {
    it("should fail for wrong role", async function () {
      const tx = erc998Instance.connect(receiver).mint(receiver.address);
      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${MINTER_ROLE}`,
      );
    });

    it("should mint to wallet", async function () {
      const tx = erc998Instance.mint(owner.address);
      await expect(tx).to.emit(erc998Instance, "Transfer").withArgs(ethers.constants.AddressZero, owner.address, 0);

      const balance = await erc998Instance.balanceOf(owner.address);
      expect(balance).to.equal(1);
    });

    it("should fail to mint to non receiver", async function () {
      const tx = erc998Instance.mint(nftNonReceiverInstance.address);
      await expect(tx).to.be.revertedWith(`ERC721: transfer to non ERC721Receiver implementer`);
    });

    it("should mint to receiver", async function () {
      const tx = erc998Instance.mint(nftReceiverInstance.address);
      await expect(tx)
        .to.emit(erc998Instance, "Transfer")
        .withArgs(ethers.constants.AddressZero, nftReceiverInstance.address, 0);

      const balance = await erc998Instance.balanceOf(nftReceiverInstance.address);
      expect(balance).to.equal(1);
    });
  });

  describe("balanceOf", function () {
    it("should fail for zero addr", async function () {
      const tx = erc998Instance.balanceOf(ethers.constants.AddressZero);
      await expect(tx).to.be.revertedWith(`ERC721: balance query for the zero address`);
    });

    it("should get balance of owner", async function () {
      await erc998Instance.mint(owner.address);
      const balance = await erc998Instance.balanceOf(owner.address);
      expect(balance).to.equal(1);
    });

    it("should get balance of not owner", async function () {
      await erc998Instance.mint(owner.address);
      const balance = await erc998Instance.balanceOf(receiver.address);
      expect(balance).to.equal(0);
    });
  });

  describe("ownerOf", function () {
    it("should get owner of token", async function () {
      await erc998Instance.mint(owner.address);
      const ownerOfToken = await erc998Instance.ownerOf(0);
      expect(ownerOfToken).to.equal(owner.address);
    });

    it("should get owner of burned token", async function () {
      await erc998Instance.mint(owner.address);
      const tx = erc998Instance.burn(0);
      await expect(tx).to.not.be.reverted;
      const balanceOfOwner = await erc998Instance.balanceOf(owner.address);
      expect(balanceOfOwner).to.equal(0);
      const tx2 = erc998Instance.ownerOf(0);
      await expect(tx2).to.be.revertedWith(`ERC721: owner query for nonexistent token`);
    });
  });

  describe("tokenURI", function () {
    it("should get default token URI", async function () {
      await erc998Instance.mint(owner.address);
      const uri = await erc998Instance.tokenURI(0);
      expect(uri).to.equal(`${baseTokenURI}0`);
    });

    it("should override token URI", async function () {
      await erc998Instance.mint(owner.address);
      await erc998Instance.setTokenURI(0, "newURI");
      const uri = await erc998Instance.tokenURI(0);
      expect(uri).to.equal(`${baseTokenURI}newURI`);
    });
  });

  describe("approve", function () {
    it("should fail: not an owner", async function () {
      await erc998Instance.mint(owner.address);
      const tx = erc998Instance.connect(receiver).approve(owner.address, 0);
      await expect(tx).to.be.revertedWith(`ComposableTopDown: approval to current owner`);
    });

    it("should fail: approve to self", async function () {
      await erc998Instance.mint(owner.address);
      const tx = erc998Instance.approve(owner.address, 0);
      await expect(tx).to.be.revertedWith("ComposableTopDown: approval to current owner");
    });

    it("should approve", async function () {
      await erc998Instance.mint(owner.address);
      const tx = erc998Instance.approve(receiver.address, 0);

      await expect(tx).to.emit(erc998Instance, "Approval").withArgs(owner.address, receiver.address, 0);

      const approved = await erc998Instance.getApproved(0);
      expect(approved).to.equal(receiver.address);

      const tx1 = erc998Instance.connect(receiver).burn(0);
      await expect(tx1).to.emit(erc998Instance, "Transfer").withArgs(owner.address, ethers.constants.AddressZero, 0);

      const balanceOfOwner = await erc998Instance.balanceOf(owner.address);
      expect(balanceOfOwner).to.equal(0);
    });
  });

  describe("setApprovalForAll", function () {
    it("should approve for all", async function () {
      await erc998Instance.mint(owner.address);
      await erc998Instance.mint(owner.address);

      const balanceOfOwner = await erc998Instance.balanceOf(owner.address);
      expect(balanceOfOwner).to.equal(2);

      const tx1 = erc998Instance.setApprovalForAll(receiver.address, true);
      await expect(tx1).to.not.be.reverted;

      const approved1 = await erc998Instance.getApproved(0);
      expect(approved1).to.equal(ethers.constants.AddressZero);

      const isApproved1 = await erc998Instance.isApprovedForAll(owner.address, receiver.address);
      expect(isApproved1).to.equal(true);

      const tx2 = erc998Instance.setApprovalForAll(receiver.address, false);
      await expect(tx2).to.not.be.reverted;

      const approved3 = await erc998Instance.getApproved(0);
      expect(approved3).to.equal(ethers.constants.AddressZero);

      const isApproved2 = await erc998Instance.isApprovedForAll(owner.address, receiver.address);
      expect(isApproved2).to.equal(false);
    });
  });

  describe("transferFrom", function () {
    it("should fail: not an owner", async function () {
      await erc998Instance.mint(owner.address);
      const tx = erc998Instance.connect(receiver).transferFrom(owner.address, receiver.address, 0);

      await expect(tx).to.be.revertedWith("ERC721: transfer caller is not owner nor approved");
    });

    it("should fail: zero addr", async function () {
      await erc998Instance.mint(owner.address);
      const tx = erc998Instance.transferFrom(owner.address, ethers.constants.AddressZero, 0);

      await expect(tx).to.be.revertedWith(`ERC721: transfer to the zero address`);
    });

    it("should transfer own tokens to wallet", async function () {
      await erc998Instance.mint(owner.address);
      const tx = erc998Instance.transferFrom(owner.address, receiver.address, 0);

      await expect(tx).to.emit(erc998Instance, "Transfer").withArgs(owner.address, receiver.address, 0);

      const balanceOfOwner = await erc998Instance.balanceOf(owner.address);
      expect(balanceOfOwner).to.equal(0);

      const balanceOfReceiver = await erc998Instance.balanceOf(receiver.address);
      expect(balanceOfReceiver).to.equal(1);

      const item = await erc998Instance.tokenOfOwnerByIndex(receiver.address, 0);
      expect(item).to.equal(0); // 0 is nft index
    });

    it("should transfer approved tokens to wallet", async function () {
      await erc998Instance.mint(owner.address);
      await erc998Instance.approve(receiver.address, 0);

      const tx = erc998Instance.connect(receiver).transferFrom(owner.address, receiver.address, 0);

      await expect(tx).to.emit(erc998Instance, "Transfer").withArgs(owner.address, receiver.address, 0);

      const balanceOfOwner = await erc998Instance.balanceOf(owner.address);
      expect(balanceOfOwner).to.equal(0);

      const balanceOfReceiver = await erc998Instance.balanceOf(receiver.address);
      expect(balanceOfReceiver).to.equal(1);

      const item = await erc998Instance.tokenOfOwnerByIndex(receiver.address, 0);
      expect(item).to.equal(0); // 0 is nft index
    });
  });

  describe("safeTransferFrom", function () {
    it("should fail: not an owner", async function () {
      await erc998Instance.mint(owner.address);
      const tx = erc998Instance
        .connect(receiver)
        ["safeTransferFrom(address,address,uint256)"](owner.address, receiver.address, 0);

      await expect(tx).to.be.revertedWith(`ERC721: transfer caller is not owner nor approved`);
    });

    it("should fail: burned token", async function () {
      await erc721Instance.mint(owner.address);
      await erc998Instance.mint(owner.address); // this is edge case
      await erc998Instance.mint(owner.address);

      await erc721Instance.burn(0);

      const tx = erc721Instance["safeTransferFrom(address,address,uint256,bytes)"](
        owner.address,
        erc998Instance.address,
        0,
        "0x0000000000000000000000000000000000000000000000000000000000000001",
      );
      await expect(tx).to.be.revertedWith(`ERC721: operator query for nonexistent token`);
    });

    it("should fail: receiver is burned", async function () {
      await erc721Instance.mint(owner.address);
      await erc998Instance.mint(owner.address); // this is edge case
      await erc998Instance.mint(owner.address);

      await erc998Instance.burn(1);

      const tx = erc721Instance["safeTransferFrom(address,address,uint256,bytes)"](
        owner.address,
        erc998Instance.address,
        0,
        "0x0000000000000000000000000000000000000000000000000000000000000001",
      );
      await expect(tx).to.be.revertedWith(`ERC721: owner query for nonexistent token`);
    });

    it("should transfer own tokens to receiver contract", async function () {
      await erc998Instance.mint(owner.address);
      const tx = erc998Instance["safeTransferFrom(address,address,uint256)"](
        owner.address,
        nftReceiverInstance.address,
        0,
      );

      await expect(tx).to.emit(erc998Instance, "Transfer").withArgs(owner.address, nftReceiverInstance.address, 0);

      const balanceOfOwner = await erc998Instance.balanceOf(owner.address);
      expect(balanceOfOwner).to.equal(0);

      const balanceOfReceiver = await erc998Instance.balanceOf(nftReceiverInstance.address);
      expect(balanceOfReceiver).to.equal(1);

      const item = await erc998Instance.tokenOfOwnerByIndex(nftReceiverInstance.address, 0);
      expect(item).to.equal(0); // 0 is nft index
    });

    it("should transfer own tokens to non receiver contract", async function () {
      await erc998Instance.mint(owner.address);
      const tx = erc998Instance["safeTransferFrom(address,address,uint256)"](
        owner.address,
        nftNonReceiverInstance.address,
        0,
      );
      await expect(tx).to.be.revertedWith(`ERC721: transfer to non ERC721Receiver implementer`);
    });

    it("should transfer approved tokens to receiver contract", async function () {
      await erc998Instance.mint(owner.address);
      await erc998Instance.approve(receiver.address, 0);

      const tx = erc998Instance
        .connect(receiver)
        ["safeTransferFrom(address,address,uint256)"](owner.address, nftReceiverInstance.address, 0);

      await expect(tx).to.emit(erc998Instance, "Transfer").withArgs(owner.address, nftReceiverInstance.address, 0);

      const balanceOfOwner = await erc998Instance.balanceOf(owner.address);
      expect(balanceOfOwner).to.equal(0);

      const balanceOfReceiver = await erc998Instance.balanceOf(nftReceiverInstance.address);
      expect(balanceOfReceiver).to.equal(1);

      const item = await erc998Instance.tokenOfOwnerByIndex(nftReceiverInstance.address, 0);
      expect(item).to.equal(0); // 0 is nft index
    });

    it("should transfer approved tokens to non receiver contract", async function () {
      await erc998Instance.mint(owner.address);
      await erc998Instance.approve(receiver.address, 0);

      const tx = erc998Instance
        .connect(receiver)
        ["safeTransferFrom(address,address,uint256)"](owner.address, nftNonReceiverInstance.address, 0);
      await expect(tx).to.be.revertedWith(`ERC721: transfer to non ERC721Receiver implementer`);
    });

    it("should transfer token to another token", async function () {
      await erc721Instance.mint(owner.address);
      await erc998Instance.mint(owner.address); // this is edge case
      await erc998Instance.mint(owner.address);

      const tx1 = erc721Instance["safeTransferFrom(address,address,uint256,bytes)"](
        owner.address,
        erc998Instance.address,
        0,
        "0x0000000000000000000000000000000000000000000000000000000000000001",
      );
      await expect(tx1).to.emit(erc998Instance, "ReceivedChild").withArgs(owner.address, 1, erc721Instance.address, 0);
      await expect(tx1).to.emit(erc721Instance, "Transfer").withArgs(owner.address, erc998Instance.address, 0);

      const balanceOfOwner = await erc721Instance.balanceOf(erc998Instance.address);
      expect(balanceOfOwner).to.equal(1);

      // TODO "ComposableTopDown: _transferFrom token is child of other top down composable"
    });

    it.skip("should not transfer token to itself", async function () {
      await erc998Instance.mint(owner.address); // this is edge case
      await erc998Instance.mint(owner.address);

      const tx1 = erc998Instance["safeTransferFrom(address,address,uint256,bytes)"](
        owner.address,
        erc998Instance.address,
        1,
        "0x0000000000000000000000000000000000000000000000000000000000000001",
      );
      await expect(tx1).to.be.reverted;
    });

    it("should transfer tree of tokens to wallet", async function () {
      await erc998Instance.mint(owner.address); // this is edge case
      await erc998Instance.mint(owner.address);
      await erc998Instance.mint(owner.address);
      await erc998Instance.mint(owner.address);

      const tx1 = erc998Instance["safeTransferFrom(address,address,uint256,bytes)"](
        owner.address,
        erc998Instance.address,
        3,
        "0x0000000000000000000000000000000000000000000000000000000000000002",
      );
      await expect(tx1).to.not.be.reverted;

      const tx2 = erc998Instance["safeTransferFrom(address,address,uint256,bytes)"](
        owner.address,
        erc998Instance.address,
        2,
        "0x0000000000000000000000000000000000000000000000000000000000000001",
      );
      await expect(tx2).to.not.be.reverted;

      const tx3 = erc998Instance["safeTransferFrom(address,address,uint256)"](owner.address, receiver.address, 1);
      await expect(tx3).to.not.be.reverted;

      const balance = await erc998Instance.balanceOf(receiver.address);
      expect(balance).to.equal(1);
    });

    it("should not transfer token from the middle of the tree", async function () {
      await erc998Instance.mint(owner.address); // this is edge case
      await erc998Instance.mint(owner.address);
      await erc998Instance.mint(owner.address);
      await erc998Instance.mint(owner.address);

      const tx1 = erc998Instance["safeTransferFrom(address,address,uint256,bytes)"](
        owner.address,
        erc998Instance.address,
        3,
        "0x0000000000000000000000000000000000000000000000000000000000000002",
      );
      await expect(tx1).to.not.be.reverted;

      const tx2 = erc998Instance["safeTransferFrom(address,address,uint256,bytes)"](
        owner.address,
        erc998Instance.address,
        2,
        "0x0000000000000000000000000000000000000000000000000000000000000001",
      );
      await expect(tx2).to.not.be.reverted;

      const tx3 = erc998Instance["safeTransferFrom(address,address,uint256)"](owner.address, receiver.address, 2);
      // DOUBLE CHECK
      await expect(tx3).to.be.revertedWith(`ERC721: transfer caller is not owner nor approved`);
    });

    it.skip("should not transfer token to its child token", async function () {
      await erc998Instance.mint(owner.address); // this is edge case
      await erc998Instance.mint(owner.address);
      await erc998Instance.mint(owner.address);

      const tx1 = erc998Instance["safeTransferFrom(address,address,uint256,bytes)"](
        owner.address,
        erc998Instance.address,
        1,
        "0x0000000000000000000000000000000000000000000000000000000000000002",
      );
      await expect(tx1).to.not.be.reverted;

      const tx2 = erc998Instance["safeTransferFrom(address,address,uint256,bytes)"](
        owner.address,
        erc998Instance.address,
        2,
        "0x0000000000000000000000000000000000000000000000000000000000000001",
      );
      // DOUBLE CHECK
      await expect(tx2).to.be.revertedWith(`ERC721: transfer to non ERC721Receiver implementer`);
    });
  });

  describe("safeTransferChild", function () {
    it("should transfer token owned by another token to the wallet", async function () {
      await erc721Instance.mint(owner.address);
      await erc998Instance.mint(owner.address); // this is edge case
      await erc998Instance.mint(owner.address);

      const tx1 = erc721Instance["safeTransferFrom(address,address,uint256,bytes)"](
        owner.address,
        erc998Instance.address,
        0, // erc721 tokenId
        "0x0000000000000000000000000000000000000000000000000000000000000001", // erc998 tokenId
      );
      await expect(tx1).to.not.be.reverted;

      const tx2 = erc998Instance["safeTransferChild(uint256,address,address,uint256)"](
        1,
        receiver.address,
        erc721Instance.address,
        0,
      );
      await expect(tx2)
        .to.emit(erc998Instance, "TransferChild")
        .withArgs(1, receiver.address, erc721Instance.address, 0);
    });

    it("should transfer token owned by another token to the receiver contract", async function () {
      await erc721Instance.mint(owner.address);
      await erc998Instance.mint(owner.address); // this is edge case
      await erc998Instance.mint(owner.address);

      const tx1 = erc721Instance["safeTransferFrom(address,address,uint256,bytes)"](
        owner.address,
        erc998Instance.address,
        0, // erc721 tokenId
        "0x0000000000000000000000000000000000000000000000000000000000000001", // erc998 tokenId
      );
      await expect(tx1).to.not.be.reverted;

      const tx2 = erc998Instance["safeTransferChild(uint256,address,address,uint256)"](
        1,
        nftReceiverInstance.address,
        erc721Instance.address,
        0,
      );
      await expect(tx2)
        .to.emit(erc998Instance, "TransferChild")
        .withArgs(1, nftReceiverInstance.address, erc721Instance.address, 0);
    });

    it("should non transfer token owned by another token to the non receiver contract", async function () {
      await erc721Instance.mint(owner.address);
      await erc998Instance.mint(owner.address); // this is edge case
      await erc998Instance.mint(owner.address);

      const tx1 = erc721Instance["safeTransferFrom(address,address,uint256,bytes)"](
        owner.address,
        erc998Instance.address,
        0, // erc721 tokenId
        "0x0000000000000000000000000000000000000000000000000000000000000001", // erc998 tokenId
      );
      await expect(tx1).to.not.be.reverted;

      const tx2 = erc998Instance["safeTransferChild(uint256,address,address,uint256)"](
        1,
        nftNonReceiverInstance.address,
        erc721Instance.address,
        0,
      );
      await expect(tx2).to.be.revertedWith(`ERC721: transfer to non ERC721Receiver implementer`);
    });

    it("should not transfer token which is not owned", async function () {
      await erc721Instance.mint(owner.address);
      await erc998Instance.mint(owner.address); // this is edge case
      await erc998Instance.mint(owner.address);

      const tx = erc998Instance["safeTransferChild(uint256,address,address,uint256)"](
        1,
        receiver.address,
        erc721Instance.address,
        0,
      );

      await expect(tx).to.be.revertedWith(`ComposableTopDown: _transferChild _childContract _childTokenId not found`);
    });
  });

  describe("transferChild", function () {
    it("should transfer token owned by another token to wallet", async function () {
      await erc721Instance.mint(owner.address);
      await erc998Instance.mint(owner.address); // this is edge case
      await erc998Instance.mint(owner.address);

      const tx1 = erc721Instance["safeTransferFrom(address,address,uint256,bytes)"](
        owner.address,
        erc998Instance.address,
        0, // erc721 tokenId
        "0x0000000000000000000000000000000000000000000000000000000000000001", // erc998 tokenId
      );
      await expect(tx1).to.not.be.reverted;

      const tx2 = erc998Instance.transferChild(1, receiver.address, erc721Instance.address, 0);
      await expect(tx2)
        .to.emit(erc998Instance, "TransferChild")
        .withArgs(1, receiver.address, erc721Instance.address, 0);
    });

    it("should transfer token owned by another token to the receiver contract", async function () {
      await erc721Instance.mint(owner.address);
      await erc998Instance.mint(owner.address); // this is edge case
      await erc998Instance.mint(owner.address);

      const tx1 = erc721Instance["safeTransferFrom(address,address,uint256,bytes)"](
        owner.address,
        erc998Instance.address,
        0, // erc721 tokenId
        "0x0000000000000000000000000000000000000000000000000000000000000001", // erc998 tokenId
      );
      await expect(tx1).to.not.be.reverted;

      const tx2 = erc998Instance.transferChild(1, nftReceiverInstance.address, erc721Instance.address, 0);
      await expect(tx2)
        .to.emit(erc998Instance, "TransferChild")
        .withArgs(1, nftReceiverInstance.address, erc721Instance.address, 0);
    });

    it("should transfer token owned by another token to the non receiver contract", async function () {
      await erc721Instance.mint(owner.address);
      await erc998Instance.mint(owner.address); // this is edge case
      await erc998Instance.mint(owner.address);

      const tx1 = erc721Instance["safeTransferFrom(address,address,uint256,bytes)"](
        owner.address,
        erc998Instance.address,
        0, // erc721 tokenId
        "0x0000000000000000000000000000000000000000000000000000000000000001", // erc998 tokenId
      );
      await expect(tx1).to.not.be.reverted;

      const tx2 = erc998Instance.transferChild(1, nftNonReceiverInstance.address, erc721Instance.address, 0);
      await expect(tx2)
        .to.emit(erc998Instance, "TransferChild")
        .withArgs(1, nftNonReceiverInstance.address, erc721Instance.address, 0);
    });

    it("should not transfer token which is not owned", async function () {
      await erc721Instance.mint(owner.address);
      await erc998Instance.mint(owner.address); // this is edge case
      await erc998Instance.mint(owner.address);

      const tx = erc998Instance.transferChild(1, receiver.address, erc721Instance.address, 0);

      await expect(tx).to.be.revertedWith(`ComposableTopDown: _transferChild _childContract _childTokenId not found`);
    });
  });

  describe("childExists", function () {
    it("should check if child exists", async function () {
      await erc721Instance.mint(owner.address);
      await erc998Instance.mint(owner.address); // this is edge case
      await erc998Instance.mint(owner.address);

      const tx1 = erc721Instance["safeTransferFrom(address,address,uint256,bytes)"](
        owner.address,
        erc998Instance.address,
        0, // erc721 tokenId
        "0x0000000000000000000000000000000000000000000000000000000000000001", // erc998 tokenId
      );
      await expect(tx1).to.not.be.reverted;

      const isExist1 = await erc998Instance.childExists(erc721Instance.address, 0);
      expect(isExist1).to.equal(true);

      const isExist2 = await erc998Instance.childExists(erc721Instance.address, 1);
      expect(isExist2).to.equal(false);
    });
  });

  describe("totalChildContracts", function () {
    it("should count child contracts", async function () {
      await erc721Instance.mint(owner.address);
      await erc998Instance.mint(owner.address); // this is edge case
      await erc998Instance.mint(owner.address);

      const tx1 = erc721Instance["safeTransferFrom(address,address,uint256,bytes)"](
        owner.address,
        erc998Instance.address,
        0, // erc721 tokenId
        "0x0000000000000000000000000000000000000000000000000000000000000001", // erc998 tokenId
      );
      await expect(tx1).to.not.be.reverted;

      const total = await erc998Instance.totalChildContracts(1);
      expect(total).to.equal(1);
    });
  });

  describe("childContractByIndex", function () {
    it("should get child contract by index", async function () {
      await erc721Instance.mint(owner.address);
      await erc998Instance.mint(owner.address); // this is edge case
      await erc998Instance.mint(owner.address);

      const tx1 = erc721Instance["safeTransferFrom(address,address,uint256,bytes)"](
        owner.address,
        erc998Instance.address,
        0, // erc721 tokenId
        "0x0000000000000000000000000000000000000000000000000000000000000001", // erc998 tokenId
      );
      await expect(tx1).to.not.be.reverted;

      const address = await erc998Instance.childContractByIndex(1, 0);
      expect(address).to.equal(erc721Instance.address);
    });
  });

  describe("totalChildTokens", function () {
    it("should get child contract tokens count", async function () {
      await erc721Instance.mint(owner.address);
      await erc998Instance.mint(owner.address); // this is edge case
      await erc998Instance.mint(owner.address);

      const tx1 = erc721Instance["safeTransferFrom(address,address,uint256,bytes)"](
        owner.address,
        erc998Instance.address,
        0, // erc721 tokenId
        "0x0000000000000000000000000000000000000000000000000000000000000001", // erc998 tokenId
      );
      await expect(tx1).to.not.be.reverted;

      const total = await erc998Instance.totalChildTokens(1, erc721Instance.address);
      expect(total).to.equal(1);
    });
  });

  describe("childTokenByIndex", function () {
    it("should get child contract tokens count", async function () {
      await erc721Instance.mint(owner.address);
      await erc998Instance.mint(owner.address); // this is edge case
      await erc998Instance.mint(owner.address);

      const tx1 = erc721Instance["safeTransferFrom(address,address,uint256,bytes)"](
        owner.address,
        erc998Instance.address,
        0, // erc721 tokenId
        "0x0000000000000000000000000000000000000000000000000000000000000001", // erc998 tokenId
      );
      await expect(tx1).to.not.be.reverted;

      const total = await erc998Instance.childTokenByIndex(1, erc721Instance.address, 0);
      expect(total).to.equal(0); // erc721 tokenId
    });
  });

  describe("getChild", function () {
    it("should get child", async function () {
      await erc721Instance.mint(owner.address);
      await erc721Instance.approve(erc998Instance.address, 0);
      await erc998Instance.mint(owner.address); // this is edge case
      await erc998Instance.mint(owner.address);

      const tx1 = erc998Instance.getChild(owner.address, 1, erc721Instance.address, 0);
      await expect(tx1).to.emit(erc998Instance, "ReceivedChild").withArgs(owner.address, 1, erc721Instance.address, 0);
      await expect(tx1).to.emit(erc721Instance, "Transfer").withArgs(owner.address, erc998Instance.address, 0);
    });
  });

  describe("getERC20", function () {
    it("should get erc20 tokens", async function () {
      await erc20Instance.mint(owner.address, amount);
      await erc20Instance.approve(erc998Instance.address, amount);
      await erc998Instance.mint(owner.address); // this is edge case
      await erc998Instance.mint(owner.address);

      const tx1 = erc998Instance.getERC20(owner.address, 1, erc20Instance.address, amount);
      await expect(tx1)
        .to.emit(erc998Instance, "ReceivedERC20")
        .withArgs(owner.address, 1, erc20Instance.address, amount);
      await expect(tx1).to.emit(erc20Instance, "Transfer").withArgs(owner.address, erc998Instance.address, amount);
    });
  });

  describe("balanceOfERC20", function () {
    it("should get balance of erc20 tokens", async function () {
      await erc20Instance.mint(owner.address, amount);
      await erc20Instance.approve(erc998Instance.address, amount);
      await erc998Instance.mint(owner.address); // this is edge case
      await erc998Instance.mint(owner.address);

      await erc998Instance.getERC20(owner.address, 1, erc20Instance.address, amount);

      const balance = await erc998Instance.balanceOfERC20(1, erc20Instance.address);
      expect(balance).to.equal(amount);
    });
  });

  describe("erc20ContractByIndex", function () {
    it("should get erc20 contract by index", async function () {
      await erc20Instance.mint(owner.address, amount);
      await erc20Instance.approve(erc998Instance.address, amount);
      await erc998Instance.mint(owner.address); // this is edge case
      await erc998Instance.mint(owner.address);

      await erc998Instance.getERC20(owner.address, 1, erc20Instance.address, amount);

      const address = await erc998Instance.erc20ContractByIndex(1, 0);
      expect(address).to.equal(erc20Instance.address);
    });
  });

  describe("totalERC20Contracts", function () {
    it("should get total erc20 contracts", async function () {
      await erc20Instance.mint(owner.address, amount);
      await erc20Instance.approve(erc998Instance.address, amount);
      await erc998Instance.mint(owner.address); // this is edge case
      await erc998Instance.mint(owner.address);

      await erc998Instance.getERC20(owner.address, 1, erc20Instance.address, amount);

      const total = await erc998Instance.totalERC20Contracts(1);
      expect(total).to.equal(1);
    });
  });

  describe("supportsInterface", function () {
    it("should support all interfaces", async function () {
      const supportsIERC721 = await erc998Instance.supportsInterface("0x80ac58cd");
      expect(supportsIERC721).to.equal(true);
      const supportsIERC721Metadata = await erc998Instance.supportsInterface("0x5b5e139f");
      expect(supportsIERC721Metadata).to.equal(true);
      const supportsIERC721Enumerable = await erc998Instance.supportsInterface("0x780e9d63");
      expect(supportsIERC721Enumerable).to.equal(true);

      const supportsIERC165 = await erc998Instance.supportsInterface("0x01ffc9a7");
      expect(supportsIERC165).to.equal(true);

      const supportsIAccessControl = await erc998Instance.supportsInterface("0x7965db0b");
      expect(supportsIAccessControl).to.equal(true);

      const supportsERC998 = await erc998Instance.supportsInterface("0x1bc995e4");
      expect(supportsERC998).to.equal(true);

      const supportsInvalidInterface = await erc998Instance.supportsInterface("0xffffffff");
      expect(supportsInvalidInterface).to.equal(false);
    });
  });
});

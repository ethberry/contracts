import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { ERC721NonReceiverTest, ERC721ReceiverTest, ERC721ACBECS } from "../../../typechain-types";
import { baseTokenURI, DEFAULT_ADMIN_ROLE, MINTER_ROLE, tokenName, tokenSymbol } from "../../constants";

describe("ERC721ACBECS", function () {
  let erc721: ContractFactory;
  let erc721Instance: ERC721ACBECS;
  let nftReceiver: ContractFactory;
  let nftReceiverInstance: ERC721ReceiverTest;
  let nftNonReceiver: ContractFactory;
  let nftNonReceiverInstance: ERC721NonReceiverTest;
  let owner: SignerWithAddress;
  let receiver: SignerWithAddress;

  beforeEach(async function () {
    erc721 = await ethers.getContractFactory("ERC721ACBECS");
    nftReceiver = await ethers.getContractFactory("ERC721ReceiverTest");
    nftNonReceiver = await ethers.getContractFactory("ERC721NonReceiverTest");
    [owner, receiver] = await ethers.getSigners();

    erc721Instance = (await erc721.deploy(tokenName, tokenSymbol, baseTokenURI, 2)) as ERC721ACBECS;
    nftReceiverInstance = (await nftReceiver.deploy()) as ERC721ReceiverTest;
    nftNonReceiverInstance = (await nftNonReceiver.deploy()) as ERC721NonReceiverTest;
  });

  describe("constructor", function () {
    it("Should set the right roles to deployer", async function () {
      const isAdmin = await erc721Instance.hasRole(DEFAULT_ADMIN_ROLE, owner.address);
      expect(isAdmin).to.equal(true);
      const isMinter = await erc721Instance.hasRole(MINTER_ROLE, owner.address);
      expect(isMinter).to.equal(true);
    });
  });

  describe("mint", function () {
    it("should fail for wrong role", async function () {
      const tx = erc721Instance.connect(receiver).mint(receiver.address);
      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${MINTER_ROLE}`,
      );
    });

    it("should mint to wallet", async function () {
      const tx = erc721Instance.mint(owner.address);
      await expect(tx).to.emit(erc721Instance, "Transfer").withArgs(ethers.constants.AddressZero, owner.address, 0);

      const balance = await erc721Instance.balanceOf(owner.address);
      expect(balance).to.equal(1);
    });

    it("should mint to non receiver", async function () {
      const tx = erc721Instance.mint(nftNonReceiverInstance.address);
      await expect(tx)
        .to.emit(erc721Instance, "Transfer")
        .withArgs(ethers.constants.AddressZero, nftNonReceiverInstance.address, 0);
    });

    it("should mint to receiver", async function () {
      const tx = erc721Instance.mint(nftReceiverInstance.address);
      await expect(tx)
        .to.emit(erc721Instance, "Transfer")
        .withArgs(ethers.constants.AddressZero, nftReceiverInstance.address, 0);

      const balance = await erc721Instance.balanceOf(nftReceiverInstance.address);
      expect(balance).to.equal(1);
    });
  });

  describe("safeMint", function () {
    it("should fail for wrong role", async function () {
      const tx = erc721Instance.connect(receiver).safeMint(receiver.address);
      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${MINTER_ROLE}`,
      );
    });

    it("should mint to wallet", async function () {
      const tx = erc721Instance.safeMint(owner.address);
      await expect(tx).to.emit(erc721Instance, "Transfer").withArgs(ethers.constants.AddressZero, owner.address, 0);

      const balance = await erc721Instance.balanceOf(owner.address);
      expect(balance).to.equal(1);
    });

    it("should fail to mint to non receiver", async function () {
      const tx = erc721Instance.safeMint(nftNonReceiverInstance.address);
      await expect(tx).to.be.revertedWith(`ERC721: transfer to non ERC721Receiver implementer`);
    });

    it("should mint to receiver", async function () {
      const tx = erc721Instance.safeMint(nftReceiverInstance.address);
      await expect(tx)
        .to.emit(erc721Instance, "Transfer")
        .withArgs(ethers.constants.AddressZero, nftReceiverInstance.address, 0);

      const balance = await erc721Instance.balanceOf(nftReceiverInstance.address);
      expect(balance).to.equal(1);
    });
  });

  describe("balanceOf", function () {
    it("should fail for zero addr", async function () {
      const tx = erc721Instance.balanceOf(ethers.constants.AddressZero);
      await expect(tx).to.be.revertedWith(`ERC721: balance query for the zero address`);
    });

    it("should get balance of owner", async function () {
      await erc721Instance.mint(owner.address);
      const balance = await erc721Instance.balanceOf(owner.address);
      expect(balance).to.equal(1);
    });

    it("should get balance of not owner", async function () {
      await erc721Instance.mint(owner.address);
      const balance = await erc721Instance.balanceOf(receiver.address);
      expect(balance).to.equal(0);
    });
  });

  describe("ownerOf", function () {
    it("should get owner of token", async function () {
      await erc721Instance.mint(owner.address);
      const ownerOfToken = await erc721Instance.ownerOf(0);
      expect(ownerOfToken).to.equal(owner.address);
    });

    it("should get owner of burned token", async function () {
      await erc721Instance.mint(owner.address);
      const tx = erc721Instance.burn(0);
      await expect(tx).to.not.be.reverted;
      const balanceOfOwner = await erc721Instance.balanceOf(owner.address);
      expect(balanceOfOwner).to.equal(0);
      const tx2 = erc721Instance.ownerOf(0);
      await expect(tx2).to.be.revertedWith(`ERC721: owner query for nonexistent token`);
    });
  });

  describe("tokenURI", function () {
    it("should get default token URI", async function () {
      await erc721Instance.mint(owner.address);
      const uri = await erc721Instance.tokenURI(0);
      expect(uri).to.equal(`${baseTokenURI}0`);
    });

    it("should override token URI", async function () {
      await erc721Instance.mint(owner.address);
      await erc721Instance.setTokenURI(0, "newURI");
      const uri = await erc721Instance.tokenURI(0);
      expect(uri).to.equal(`${baseTokenURI}newURI`);
    });
  });

  describe("approve", function () {
    it("should fail: not an owner", async function () {
      await erc721Instance.mint(owner.address);
      const tx = erc721Instance.connect(receiver).approve(owner.address, 0);
      await expect(tx).to.be.revertedWith("ERC721: approval to current owner");
    });

    it("should fail: approve to self", async function () {
      await erc721Instance.mint(owner.address);
      const tx = erc721Instance.approve(owner.address, 0);
      await expect(tx).to.be.revertedWith("ERC721: approval to current owner");
    });

    it("should approve", async function () {
      await erc721Instance.mint(owner.address);

      const tx = erc721Instance.approve(receiver.address, 0);
      await expect(tx).to.emit(erc721Instance, "Approval").withArgs(owner.address, receiver.address, 0);

      const approved = await erc721Instance.getApproved(0);
      expect(approved).to.equal(receiver.address);

      const tx1 = erc721Instance.connect(receiver).burn(0);
      await expect(tx1).to.emit(erc721Instance, "Transfer").withArgs(owner.address, ethers.constants.AddressZero, 0);

      const balanceOfOwner = await erc721Instance.balanceOf(owner.address);
      expect(balanceOfOwner).to.equal(0);
    });
  });

  describe("setApprovalForAll", function () {
    it("should approve for all", async function () {
      await erc721Instance.mint(owner.address);
      await erc721Instance.mint(owner.address);

      const balanceOfOwner = await erc721Instance.balanceOf(owner.address);
      expect(balanceOfOwner).to.equal(2);

      const tx1 = erc721Instance.setApprovalForAll(receiver.address, true);
      await expect(tx1).to.not.be.reverted;

      const approved1 = await erc721Instance.getApproved(0);
      expect(approved1).to.equal(ethers.constants.AddressZero);

      const isApproved1 = await erc721Instance.isApprovedForAll(owner.address, receiver.address);
      expect(isApproved1).to.equal(true);

      const tx2 = erc721Instance.setApprovalForAll(receiver.address, false);
      await expect(tx2).to.not.be.reverted;

      const approved3 = await erc721Instance.getApproved(0);
      expect(approved3).to.equal(ethers.constants.AddressZero);

      const isApproved2 = await erc721Instance.isApprovedForAll(owner.address, receiver.address);
      expect(isApproved2).to.equal(false);
    });
  });

  describe("transferFrom", function () {
    it("should fail: not an owner", async function () {
      await erc721Instance.mint(owner.address);
      const tx = erc721Instance.connect(receiver).transferFrom(owner.address, receiver.address, 0);

      await expect(tx).to.be.revertedWith(`ERC721: transfer caller is not owner nor approved`);
    });

    it("should fail: zero addr", async function () {
      await erc721Instance.mint(owner.address);
      const tx = erc721Instance.transferFrom(owner.address, ethers.constants.AddressZero, 0);

      await expect(tx).to.be.revertedWith(`ERC721: transfer to the zero address`);
    });

    it("should transfer own tokens to wallet", async function () {
      await erc721Instance.mint(owner.address);
      const tx = erc721Instance.transferFrom(owner.address, receiver.address, 0);

      await expect(tx).to.emit(erc721Instance, "Transfer").withArgs(owner.address, receiver.address, 0);

      const balanceOfOwner = await erc721Instance.balanceOf(owner.address);
      expect(balanceOfOwner).to.equal(0);

      const balanceOfReceiver = await erc721Instance.balanceOf(receiver.address);
      expect(balanceOfReceiver).to.equal(1);

      const item = await erc721Instance.tokenOfOwnerByIndex(receiver.address, 0);
      expect(item).to.equal(0); // 0 is nft index
    });

    it("should transfer approved tokens to wallet", async function () {
      await erc721Instance.mint(owner.address);
      await erc721Instance.approve(receiver.address, 0);

      const tx = erc721Instance.connect(receiver).transferFrom(owner.address, receiver.address, 0);

      await expect(tx).to.emit(erc721Instance, "Transfer").withArgs(owner.address, receiver.address, 0);

      const balanceOfOwner = await erc721Instance.balanceOf(owner.address);
      expect(balanceOfOwner).to.equal(0);

      const balanceOfReceiver = await erc721Instance.balanceOf(receiver.address);
      expect(balanceOfReceiver).to.equal(1);

      const item = await erc721Instance.tokenOfOwnerByIndex(receiver.address, 0);
      expect(item).to.equal(0); // 0 is nft index
    });
  });

  describe("safeTransferFrom", function () {
    it("should fail: not an owner", async function () {
      await erc721Instance.mint(owner.address);
      const tx = erc721Instance
        .connect(receiver)
        ["safeTransferFrom(address,address,uint256)"](owner.address, receiver.address, 0);

      await expect(tx).to.be.revertedWith(`ERC721: transfer caller is not owner nor approved`);
    });

    it("should transfer own tokens to receiver contract", async function () {
      await erc721Instance.mint(owner.address);
      const tx = erc721Instance["safeTransferFrom(address,address,uint256)"](
        owner.address,
        nftReceiverInstance.address,
        0,
      );

      await expect(tx).to.emit(erc721Instance, "Transfer").withArgs(owner.address, nftReceiverInstance.address, 0);

      const balanceOfOwner = await erc721Instance.balanceOf(owner.address);
      expect(balanceOfOwner).to.equal(0);

      const balanceOfReceiver = await erc721Instance.balanceOf(nftReceiverInstance.address);
      expect(balanceOfReceiver).to.equal(1);

      const item = await erc721Instance.tokenOfOwnerByIndex(nftReceiverInstance.address, 0);
      expect(item).to.equal(0); // 0 is nft index
    });

    it("should transfer own tokens to non receiver contract", async function () {
      await erc721Instance.mint(owner.address);
      const tx = erc721Instance["safeTransferFrom(address,address,uint256)"](
        owner.address,
        nftNonReceiverInstance.address,
        0,
      );
      await expect(tx).to.be.revertedWith(`ERC721: transfer to non ERC721Receiver implementer`);
    });

    it("should transfer approved tokens to receiver contract", async function () {
      await erc721Instance.mint(owner.address);
      await erc721Instance.approve(receiver.address, 0);

      const tx = erc721Instance
        .connect(receiver)
        ["safeTransferFrom(address,address,uint256)"](owner.address, nftReceiverInstance.address, 0);

      await expect(tx).to.emit(erc721Instance, "Transfer").withArgs(owner.address, nftReceiverInstance.address, 0);

      const balanceOfOwner = await erc721Instance.balanceOf(owner.address);
      expect(balanceOfOwner).to.equal(0);

      const balanceOfReceiver = await erc721Instance.balanceOf(nftReceiverInstance.address);
      expect(balanceOfReceiver).to.equal(1);

      const item = await erc721Instance.tokenOfOwnerByIndex(nftReceiverInstance.address, 0);
      expect(item).to.equal(0); // 0 is nft index
    });

    it("should transfer approved tokens to non receiver contract", async function () {
      await erc721Instance.mint(owner.address);
      await erc721Instance.approve(receiver.address, 0);

      const tx = erc721Instance
        .connect(receiver)
        ["safeTransferFrom(address,address,uint256)"](owner.address, nftNonReceiverInstance.address, 0);
      await expect(tx).to.be.revertedWith(`ERC721: transfer to non ERC721Receiver implementer`);
    });
  });

  describe("burn", function () {
    it("should fail: not an owner", async function () {
      await erc721Instance.mint(owner.address);
      const tx = erc721Instance.connect(receiver).burn(0);

      await expect(tx).to.be.revertedWith(`ERC721Burnable: caller is not owner nor approved`);
    });

    it("should burn own token", async function () {
      await erc721Instance.mint(owner.address);
      const tx = await erc721Instance.burn(0);

      await expect(tx).to.emit(erc721Instance, "Transfer").withArgs(owner.address, ethers.constants.AddressZero, 0);

      const balanceOfOwner = await erc721Instance.balanceOf(owner.address);
      expect(balanceOfOwner).to.equal(0);
    });

    it("should burn approved token", async function () {
      await erc721Instance.mint(owner.address);
      await erc721Instance.approve(receiver.address, 0);

      const tx = await erc721Instance.burn(0);

      await expect(tx).to.emit(erc721Instance, "Transfer").withArgs(owner.address, ethers.constants.AddressZero, 0);

      const balanceOfOwner = await erc721Instance.balanceOf(owner.address);
      expect(balanceOfOwner).to.equal(0);
    });
  });

  describe("cap", function () {
    it("should fail: cap exceeded", async function () {
      await erc721Instance.mint(owner.address);
      await erc721Instance.mint(owner.address);

      const cap = await erc721Instance.cap();
      expect(cap).to.equal(2);

      const totalSupply = await erc721Instance.totalSupply();
      expect(totalSupply).to.equal(2);

      const tx = erc721Instance.mint(owner.address);
      await expect(tx).to.be.revertedWith(`ERC20Capped: cap exceeded`);
    });
  });

  describe("supportsInterface", function () {
    it("should support all interfaces", async function () {
      const supportsIERC721 = await erc721Instance.supportsInterface("0x80ac58cd");
      expect(supportsIERC721).to.equal(true);
      const supportsIERC721Metadata = await erc721Instance.supportsInterface("0x5b5e139f");
      expect(supportsIERC721Metadata).to.equal(true);
      const supportsIERC721Enumerable = await erc721Instance.supportsInterface("0x780e9d63");
      expect(supportsIERC721Enumerable).to.equal(true);

      const supportsIERC165 = await erc721Instance.supportsInterface("0x01ffc9a7");
      expect(supportsIERC165).to.equal(true);

      const supportsIAccessControl = await erc721Instance.supportsInterface("0x7965db0b");
      expect(supportsIAccessControl).to.equal(true);

      const supportsInvalidInterface = await erc721Instance.supportsInterface("0xffffffff");
      expect(supportsInvalidInterface).to.equal(false);
    });
  });
});

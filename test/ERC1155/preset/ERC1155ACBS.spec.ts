import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber, ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { ERC1155NonReceiverMock, ERC1155ReceiverMock, ERC1155ACBS } from "../../../typechain-types";
import { amount, baseTokenURI, DEFAULT_ADMIN_ROLE, MINTER_ROLE, tokenId } from "../../constants";

describe("ERC1155ACBS", function () {
  let erc1155: ContractFactory;
  let erc1155Instance: ERC1155ACBS;
  let erc1155Receiver: ContractFactory;
  let erc1155ReceiverInstance: ERC1155ReceiverMock;
  let erc1155NonReceiver: ContractFactory;
  let erc1155NonReceiverInstance: ERC1155NonReceiverMock;
  let owner: SignerWithAddress;
  let receiver: SignerWithAddress;

  beforeEach(async function () {
    erc1155 = await ethers.getContractFactory("ERC1155ACBS");
    erc1155Receiver = await ethers.getContractFactory("ERC1155ReceiverMock");
    erc1155NonReceiver = await ethers.getContractFactory("ERC1155NonReceiverMock");
    [owner, receiver] = await ethers.getSigners();

    erc1155Instance = (await erc1155.deploy(baseTokenURI)) as ERC1155ACBS;
    erc1155ReceiverInstance = (await erc1155Receiver.deploy()) as ERC1155ReceiverMock;
    erc1155NonReceiverInstance = (await erc1155NonReceiver.deploy()) as ERC1155NonReceiverMock;

    void receiver;
    void erc1155ReceiverInstance;
    void erc1155NonReceiverInstance;
  });

  describe("constructor", function () {
    it("Should set the right roles to deployer", async function () {
      const isAdmin = await erc1155Instance.hasRole(DEFAULT_ADMIN_ROLE, owner.address);
      expect(isAdmin).to.equal(true);
      const isMinter = await erc1155Instance.hasRole(MINTER_ROLE, owner.address);
      expect(isMinter).to.equal(true);
    });
  });

  describe("mint", function () {
    it("should fail for wrong role", async function () {
      const tx = erc1155Instance.connect(receiver).mint(receiver.address, 1, amount, "0x");
      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${MINTER_ROLE}`,
      );
    });

    it("should mint to wallet", async function () {
      const tx = erc1155Instance.mint(receiver.address, tokenId, amount, "0x");
      await expect(tx)
        .to.emit(erc1155Instance, "TransferSingle")
        .withArgs(owner.address, ethers.constants.AddressZero, receiver.address, tokenId, amount);

      const balance = await erc1155Instance.balanceOf(receiver.address, tokenId);
      expect(balance).to.equal(amount);

      const totalSupply = await erc1155Instance.totalSupply(tokenId);
      expect(totalSupply).to.equal(amount);
    });

    it("should fail to mint to non receiver", async function () {
      const tx = erc1155Instance.mint(erc1155NonReceiverInstance.address, tokenId, amount, "0x");
      await expect(tx).to.be.revertedWith(`ERC1155: transfer to non ERC1155Receiver implementer`);
    });

    it("should mint to receiver", async function () {
      const tx = erc1155Instance.mint(erc1155ReceiverInstance.address, tokenId, amount, "0x");
      await expect(tx)
        .to.emit(erc1155Instance, "TransferSingle")
        .withArgs(owner.address, ethers.constants.AddressZero, erc1155ReceiverInstance.address, tokenId, amount);

      const balance = await erc1155Instance.balanceOf(erc1155ReceiverInstance.address, tokenId);
      expect(balance).to.equal(amount);
    });
  });

  describe("mintBatch", function () {
    it("should fail for wrong role", async function () {
      const tx = erc1155Instance.connect(receiver).mintBatch(receiver.address, [tokenId], [amount], "0x");
      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${MINTER_ROLE}`,
      );
    });

    it("should mint to wallet", async function () {
      const tx = erc1155Instance.mintBatch(receiver.address, [tokenId], [amount], "0x");
      await expect(tx)
        .to.emit(erc1155Instance, "TransferBatch")
        .withArgs(owner.address, ethers.constants.AddressZero, receiver.address, [tokenId], [amount]);

      const balance = await erc1155Instance.balanceOf(receiver.address, tokenId);
      expect(balance).to.equal(amount);

      const totalSupply = await erc1155Instance.totalSupply(tokenId);
      expect(totalSupply).to.equal(amount);
    });

    it("should fail to mint to non receiver", async function () {
      const tx = erc1155Instance.mintBatch(erc1155NonReceiverInstance.address, [tokenId], [amount], "0x");
      await expect(tx).to.be.revertedWith(`ERC1155: transfer to non ERC1155Receiver implementer`);
    });

    it("should mint to receiver", async function () {
      const tx = erc1155Instance.mintBatch(erc1155ReceiverInstance.address, [tokenId], [amount], "0x");
      await expect(tx)
        .to.emit(erc1155Instance, "TransferBatch")
        .withArgs(owner.address, ethers.constants.AddressZero, erc1155ReceiverInstance.address, [tokenId], [amount]);

      const balance = await erc1155Instance.balanceOf(erc1155ReceiverInstance.address, tokenId);
      expect(balance).to.equal(amount);
    });
  });

  describe("balanceOf", function () {
    it("should fail for zero addr", async function () {
      const tx = erc1155Instance.balanceOf(ethers.constants.AddressZero, tokenId);
      await expect(tx).to.be.revertedWith(`ERC1155: balance query for the zero address`);
    });

    it("should get balance of owner", async function () {
      await erc1155Instance.mint(owner.address, tokenId, amount, "0x");
      const balance = await erc1155Instance.balanceOf(owner.address, tokenId);
      expect(balance).to.equal(amount);
    });

    it("should get balance of not owner", async function () {
      await erc1155Instance.mint(owner.address, tokenId, amount, "0x");
      const balance = await erc1155Instance.balanceOf(receiver.address, tokenId);
      expect(balance).to.equal(0);
    });
  });

  describe("balanceOfBatch", function () {
    it("should fail for zero addr", async function () {
      const tx = erc1155Instance.balanceOfBatch([ethers.constants.AddressZero], [tokenId]);
      await expect(tx).to.be.revertedWith(`ERC1155: balance query for the zero address`);
    });

    it("should get balance of owner", async function () {
      await erc1155Instance.mint(owner.address, tokenId, amount, "0x");
      const balances = await erc1155Instance.balanceOfBatch([owner.address, receiver.address], [tokenId, 100]);
      expect(balances).to.deep.equal([BigNumber.from(amount), BigNumber.from(0)]);
    });
  });

  describe("uri", function () {
    it("should get default token URI", async function () {
      const uri = await erc1155Instance.uri(0);
      expect(uri).to.equal(baseTokenURI);
    });
  });

  describe("supportsInterface", function () {
    it("should support all interfaces", async function () {
      const supportsIERC1155 = await erc1155Instance.supportsInterface("0xd9b67a26");
      expect(supportsIERC1155).to.equal(true);
      const supportsIERC1155MetadataURI = await erc1155Instance.supportsInterface("0x0e89341c");
      expect(supportsIERC1155MetadataURI).to.equal(true);

      const supportsIERC165 = await erc1155Instance.supportsInterface("0x01ffc9a7");
      expect(supportsIERC165).to.equal(true);

      const supportsIAccessControl = await erc1155Instance.supportsInterface("0x7965db0b");
      expect(supportsIAccessControl).to.equal(true);

      const supportsInvalidInterface = await erc1155Instance.supportsInterface("0xffffffff");
      expect(supportsInvalidInterface).to.equal(false);
    });
  });
});

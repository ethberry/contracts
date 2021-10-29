import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { Gateway, GatewayErc20, GatewayErc721, GatewayErc1155 } from "../../typechain-types";
import { amount, DEFAULT_ADMIN_ROLE } from "../constants";

describe("Gateway", function () {
  let erc20: ContractFactory;
  let erc20Instance: GatewayErc20;
  let erc721: ContractFactory;
  let erc721Instance: GatewayErc721;
  let erc1155: ContractFactory;
  let erc1155Instance: GatewayErc1155;
  let gateway: ContractFactory;
  let gatewayInstance: Gateway;
  let owner: SignerWithAddress;
  let receiver: SignerWithAddress;

  beforeEach(async function () {
    erc20 = await ethers.getContractFactory("GatewayErc20");
    erc721 = await ethers.getContractFactory("GatewayErc721");
    erc1155 = await ethers.getContractFactory("GatewayErc1155");
    gateway = await ethers.getContractFactory("Gateway");
    [owner, receiver] = await ethers.getSigners();

    erc20Instance = (await erc20.deploy()) as GatewayErc20;
    erc721Instance = (await erc721.deploy()) as GatewayErc721;
    erc1155Instance = (await erc1155.deploy()) as GatewayErc1155;
    gatewayInstance = (await gateway.deploy(
      erc20Instance.address,
      erc721Instance.address,
      erc1155Instance.address,
    )) as Gateway;
  });

  describe("Deployment", function () {
    it("should set the right roles to deployer", async function () {
      const isAdmin = await gatewayInstance.hasRole(DEFAULT_ADMIN_ROLE, owner.address);
      expect(isAdmin).to.equal(true);
    });
  });

  describe("ETH", function () {
    describe("Deposit", function () {
      it("should receive ETH", async function () {
        const tx = owner.sendTransaction({
          to: gatewayInstance.address,
          value: amount,
        });
        await expect(tx).to.emit(gatewayInstance, "Deposited").withArgs(owner.address, amount);
      });
    });

    describe("Withdraw", function () {
      it("should fail: account is missing role", async function () {
        const tx = gatewayInstance.connect(receiver).withdraw();
        await expect(tx).to.be.revertedWith(
          `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${DEFAULT_ADMIN_ROLE}`,
        );
      });

      it("should withdraw", async function () {
        await owner.sendTransaction({
          to: gatewayInstance.address,
          value: amount,
        });
        const tx = gatewayInstance.withdraw();
        await expect(tx).to.emit(gatewayInstance, "Withdrawn").withArgs(owner.address, amount);
        const balance = await gatewayInstance.provider.getBalance(gatewayInstance.address);
        expect(balance).to.equal(0);
      });
    });
  });

  describe("ERC20", function () {
    describe("Deposit", function () {
      it("should deposit ERC20", async function () {
        await erc20Instance.mint(receiver.address, amount);
        await erc20Instance.connect(receiver).approve(gatewayInstance.address, amount);

        const tx = gatewayInstance.connect(receiver).depositErc20(amount);
        await expect(tx).to.emit(gatewayInstance, "DepositedErc20").withArgs(receiver.address, amount);

        const receiverBalance = await erc20Instance.balanceOf(receiver.address);
        expect(receiverBalance).to.equal(0);

        const gatewayBalance = await erc20Instance.balanceOf(gatewayInstance.address);
        expect(gatewayBalance).to.equal(amount);
      });
    });

    describe("Withdraw", function () {
      it("should fail: account is missing role", async function () {
        await erc20Instance.mint(gatewayInstance.address, amount);
        const tx = gatewayInstance.connect(receiver).withdrawErc20();
        await expect(tx).to.be.revertedWith(
          `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${DEFAULT_ADMIN_ROLE}`,
        );
      });

      it("should withdraw ERC20", async function () {
        await erc20Instance.mint(receiver.address, amount);
        await erc20Instance.connect(receiver).approve(gatewayInstance.address, amount);
        await gatewayInstance.connect(receiver).depositErc20(amount);

        const tx = gatewayInstance.withdrawErc20();
        await expect(tx).to.emit(gatewayInstance, "WithdrawnErc20").withArgs(owner.address, amount);

        const receiverBalance = await erc20Instance.balanceOf(receiver.address);
        expect(receiverBalance).to.equal(0);

        const gatewayBalance = await erc20Instance.balanceOf(gatewayInstance.address);
        expect(gatewayBalance).to.equal(0);

        const ownerBalance = await erc20Instance.balanceOf(owner.address);
        expect(ownerBalance).to.equal(amount);
      });
    });
  });

  describe("ERC721", function () {
    describe("Deposit", function () {
      it("should receive ERC721", async function () {
        await erc721Instance.safeMint(receiver.address);
        await erc721Instance.connect(receiver).approve(gatewayInstance.address, 0);

        const tx = gatewayInstance.connect(receiver).depositErc721(0);
        await expect(tx).to.emit(gatewayInstance, "DepositedErc721").withArgs(receiver.address, 0);

        const receiverBalance = await erc721Instance.balanceOf(receiver.address);
        expect(receiverBalance).to.equal(0);

        const gatewayBalance = await erc721Instance.balanceOf(gatewayInstance.address);
        expect(gatewayBalance).to.equal(1);
      });
    });

    describe("Withdraw", function () {
      it("should fail: account is missing role", async function () {
        await erc721Instance.safeMint(gatewayInstance.address);
        const tx = gatewayInstance.connect(receiver).withdrawErc721();
        await expect(tx).to.be.revertedWith(
          `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${DEFAULT_ADMIN_ROLE}`,
        );
      });

      it("should withdraw ERC721", async function () {
        await erc721Instance.safeMint(receiver.address);
        await erc721Instance.connect(receiver).approve(gatewayInstance.address, 0);
        await gatewayInstance.connect(receiver).depositErc721(0);

        const tx = gatewayInstance.withdrawErc721();
        await expect(tx).to.emit(gatewayInstance, "WithdrawnErc721").withArgs(owner.address, 0);

        const receiverBalance = await erc721Instance.balanceOf(receiver.address);
        expect(receiverBalance).to.equal(0);

        const gatewayBalance = await erc721Instance.balanceOf(gatewayInstance.address);
        expect(gatewayBalance).to.equal(0);

        const ownerBalance = await erc721Instance.balanceOf(owner.address);
        expect(ownerBalance).to.equal(1);
      });
    });
  });

  describe("ERC1155", function () {
    describe("Deposit", function () {
      it("should receive ERC1155", async function () {
        await erc1155Instance.mint(receiver.address, 0, amount);
        await erc1155Instance.connect(receiver).setApprovalForAll(gatewayInstance.address, true);

        const tx = gatewayInstance.connect(receiver).depositErc1155(0, amount);
        await expect(tx).to.emit(gatewayInstance, "DepositedErc1155").withArgs(receiver.address, 0, amount);

        const receiverBalance = await erc1155Instance.balanceOf(receiver.address, 0);
        expect(receiverBalance).to.equal(0);

        const gatewayBalance = await erc1155Instance.balanceOf(gatewayInstance.address, 0);
        expect(gatewayBalance).to.equal(amount);
      });
    });

    describe("Withdraw", function () {
      it("should fail: account is missing role", async function () {
        await erc1155Instance.mint(gatewayInstance.address, 0, amount);
        const tx = gatewayInstance.connect(receiver).withdrawErc1155();
        await expect(tx).to.be.revertedWith(
          `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${DEFAULT_ADMIN_ROLE}`,
        );
      });

      it.skip("should withdraw ERC1155", async function () {
        // TODO implement
      });
    });
  });
});

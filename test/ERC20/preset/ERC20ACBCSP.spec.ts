import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";

import { ERC20ACBCSP, ERC20NonReceiverMock } from "../../../typechain-types";
import {
  amount,
  DEFAULT_ADMIN_ROLE,
  MINTER_ROLE,
  PAUSER_ROLE,
  SNAPSHOT_ROLE,
  tokenName,
  tokenSymbol,
} from "../../constants";

import { shouldMint } from "../shared/mint";
import { shouldBalanceOf } from "../shared/balanceOf";
import { shouldTransfer } from "../shared/transfer";
import { shouldTransferFrom } from "../shared/transferFrom";
import { shouldSnapshot } from "../shared/snapshot";
import { shouldApprove } from "../shared/approve";
import { shouldBurn } from "../shared/burn";
import { shouldBurnFrom } from "../shared/burnFrom";
import { shouldPause } from "../shared/pause";
import { shouldCap } from "../shared/cap";

describe("ERC20ACBCSP", function () {
  let erc20: ContractFactory;
  let coinNonReceiver: ContractFactory;

  beforeEach(async function () {
    erc20 = await ethers.getContractFactory("ERC20ACBCSP");
    coinNonReceiver = await ethers.getContractFactory("ERC20NonReceiverMock");
    [this.owner, this.receiver] = await ethers.getSigners();

    this.erc20Instance = (await erc20.deploy(tokenName, tokenSymbol, amount)) as ERC20ACBCSP;
    this.coinNonReceiverInstance = (await coinNonReceiver.deploy()) as ERC20NonReceiverMock;
  });

  describe("constructor", function () {
    it("should set the right roles to deployer", async function () {
      const isAdmin = await this.erc20Instance.hasRole(DEFAULT_ADMIN_ROLE, this.owner.address);
      expect(isAdmin).to.equal(true);
      const isMinter = await this.erc20Instance.hasRole(MINTER_ROLE, this.owner.address);
      expect(isMinter).to.equal(true);
      const isPauser = await this.erc20Instance.hasRole(PAUSER_ROLE, this.owner.address);
      expect(isPauser).to.equal(true);
      const isSnapshoter = await this.erc20Instance.hasRole(SNAPSHOT_ROLE, this.owner.address);
      expect(isSnapshoter).to.equal(true);
    });
  });

  shouldMint();
  shouldBalanceOf();
  shouldTransfer();
  shouldTransferFrom();
  shouldSnapshot();
  shouldApprove();
  shouldBurn();
  shouldBurnFrom();
  shouldPause();
  shouldCap();

  describe("supportsInterface", function () {
    it("should support all interfaces", async function () {
      const supportsIERC20 = await this.erc20Instance.supportsInterface("0x36372b07");
      expect(supportsIERC20).to.equal(true);
      const supportsIERC20Metadata = await this.erc20Instance.supportsInterface("0xa219a025");
      expect(supportsIERC20Metadata).to.equal(true);
      const supportsIERC165 = await this.erc20Instance.supportsInterface("0x01ffc9a7");
      expect(supportsIERC165).to.equal(true);
      const supportsIAccessControl = await this.erc20Instance.supportsInterface("0x7965db0b");
      expect(supportsIAccessControl).to.equal(true);
      const supportsInvalidInterface = await this.erc20Instance.supportsInterface("0xffffffff");
      expect(supportsInvalidInterface).to.equal(false);
    });
  });
});

import { ethers } from "hardhat";
import { ContractFactory } from "ethers";
import { expect } from "chai";

import { ERC20ACBCSP, ERC20NonReceiverMock } from "../../../typechain-types";
import { amount, DEFAULT_ADMIN_ROLE, MINTER_ROLE, SNAPSHOT_ROLE, tokenName, tokenSymbol } from "../../constants";

import { shouldHaveRole } from "../../shared/accessControl/hasRoles";
import { shouldGetRoleAdmin } from "../../shared/accessControl/getRoleAdmin";
import { shouldGrantRole } from "../../shared/accessControl/grantRole";
import { shouldRevokeRole } from "../../shared/accessControl/revokeRole";
import { shouldRenounceRole } from "../../shared/accessControl/renounceRole";
import { shouldMint } from "../shared/mint";
import { shouldBalanceOf } from "../shared/balanceOf";
import { shouldTransfer } from "../shared/transfer";
import { shouldTransferFrom } from "../shared/transferFrom";
import { shouldSnapshot } from "../shared/snapshot";
import { shouldApprove } from "../shared/approve";
import { shouldBurn } from "../shared/burn";
import { shouldBurnFrom } from "../shared/burnFrom";
import { shouldCap } from "../shared/cap";
import { shouldPermit } from "../shared/permit";

describe("ERC20ACBCSP", function () {
  let erc20: ContractFactory;
  let erc20NonReceiver: ContractFactory;

  beforeEach(async function () {
    erc20 = await ethers.getContractFactory("ERC20ACBCSP");
    erc20NonReceiver = await ethers.getContractFactory("ERC20NonReceiverMock");
    [this.owner, this.receiver] = await ethers.getSigners();

    this.erc20Instance = (await erc20.deploy(tokenName, tokenSymbol, amount)) as ERC20ACBCSP;
    this.erc20NonReceiverInstance = (await erc20NonReceiver.deploy()) as ERC20NonReceiverMock;

    this.contractInstance = this.erc20Instance;
  });

  shouldHaveRole(DEFAULT_ADMIN_ROLE, MINTER_ROLE, SNAPSHOT_ROLE);
  shouldGetRoleAdmin(DEFAULT_ADMIN_ROLE, MINTER_ROLE, SNAPSHOT_ROLE);
  shouldGrantRole();
  shouldRevokeRole();
  shouldRenounceRole();
  shouldMint(true);
  shouldBalanceOf(true);
  shouldTransfer();
  shouldTransferFrom();
  shouldSnapshot(true);
  shouldApprove();
  shouldBurn();
  shouldBurnFrom();
  shouldCap();
  shouldPermit();

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

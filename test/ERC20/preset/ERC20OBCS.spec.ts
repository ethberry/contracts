import { ethers } from "hardhat";
import { expect } from "chai";
import { amount, tokenName, tokenSymbol } from "../../constants";

import { shouldHaveOwner } from "../../shared/ownable/owner";
import { shouldTransferOwnership } from "../../shared/ownable/transferOwnership";
import { shouldRenounceOwnership } from "../../shared/ownable/renounceOwnership";
import { shouldMint } from "../shared/mint";
import { shouldBalanceOf } from "../shared/balanceOf";
import { shouldTransfer } from "../shared/transfer";
import { shouldTransferFrom } from "../shared/transferFrom";
import { shouldSnapshot } from "../shared/snapshot";
import { shouldApprove } from "../shared/approve";
import { shouldBurn } from "../shared/burn";
import { shouldBurnFrom } from "../shared/burnFrom";
import { shouldCap } from "../shared/cap";

describe("ERC20OBCS", function () {
  beforeEach(async function () {
    [this.owner, this.receiver] = await ethers.getSigners();

    const erc20Factory = await ethers.getContractFactory("ERC20OBCS");
    this.erc20Instance = await erc20Factory.deploy(tokenName, tokenSymbol, amount);

    const erc20NonReceiverFactory = await ethers.getContractFactory("ERC20NonReceiverMock");
    this.erc20NonReceiverInstance = await erc20NonReceiverFactory.deploy();

    this.contractInstance = this.erc20Instance;
  });

  shouldHaveOwner();
  shouldTransferOwnership();
  shouldRenounceOwnership();
  shouldMint();
  shouldBalanceOf(true);
  shouldTransfer();
  shouldTransferFrom();
  shouldSnapshot();
  shouldApprove();
  shouldBurn();
  shouldBurnFrom();
  shouldCap();

  describe("supportsInterface", function () {
    it("should support all interfaces", async function () {
      const supportsIERC20 = await this.erc20Instance.supportsInterface("0x36372b07");
      expect(supportsIERC20).to.equal(true);
      const supportsIERC20Metadata = await this.erc20Instance.supportsInterface("0xa219a025");
      expect(supportsIERC20Metadata).to.equal(true);
      const supportsIERC165 = await this.erc20Instance.supportsInterface("0x01ffc9a7");
      expect(supportsIERC165).to.equal(true);
      const supportsInvalidInterface = await this.erc20Instance.supportsInterface("0xffffffff");
      expect(supportsInvalidInterface).to.equal(false);
    });
  });
});

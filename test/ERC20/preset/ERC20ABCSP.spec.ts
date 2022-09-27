import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";

import { ERC20ABCSP, ERC20NonReceiverMock } from "../../../typechain-types";
import {
  amount,
  DEFAULT_ADMIN_ROLE,
  MINTER_ROLE,
  PAUSER_ROLE,
  SNAPSHOT_ROLE,
  tokenName,
  tokenSymbol,
} from "../../constants";
import { shouldSnapshot } from "../shared/snapshot";
import { shouldERC20Pause } from "../shared/pause";
import { shouldERC20Base } from "../shared/base";
import { shouldERC20Accessible } from "../shared/accessible";
import { shouldERC20Burnable } from "../shared/burnable";
import { shouldERC20Capped } from "../shared/capped";

describe("ERC20ABCSP", function () {
  let erc20: ContractFactory;
  let erc20NonReceiver: ContractFactory;

  beforeEach(async function () {
    erc20 = await ethers.getContractFactory("ERC20ABCSP");
    erc20NonReceiver = await ethers.getContractFactory("ERC20NonReceiverMock");
    [this.owner, this.receiver] = await ethers.getSigners();

    this.erc20Instance = (await erc20.deploy(tokenName, tokenSymbol, amount)) as ERC20ABCSP;
    this.erc20NonReceiverInstance = (await erc20NonReceiver.deploy()) as ERC20NonReceiverMock;

    this.contractInstance = this.erc20Instance;
  });

  shouldERC20Base();
  shouldERC20Accessible(DEFAULT_ADMIN_ROLE, MINTER_ROLE, PAUSER_ROLE, SNAPSHOT_ROLE);
  shouldERC20Burnable();
  shouldERC20Capped();
  shouldSnapshot();
  shouldERC20Pause();

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

import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";

import { ERC1155ABSP, ERC1155NonReceiverMock, ERC1155ReceiverMock } from "../../../typechain-types";
import { baseTokenURI, DEFAULT_ADMIN_ROLE, MINTER_ROLE, PAUSER_ROLE } from "../../constants";
import { shouldERC1155Pause } from "../shared/pause";
import { shouldERC1155Base } from "../shared/base";
import { shouldERC1155Acessible } from "../shared/accessible";
import { shouldERC1155Burnable } from "../shared/burnable";
import { shouldERC1155Supply } from "../shared/supply";

describe("ERC1155ABSP", function () {
  let erc1155: ContractFactory;
  let erc1155Receiver: ContractFactory;
  let erc1155NonReceiver: ContractFactory;

  beforeEach(async function () {
    erc1155 = await ethers.getContractFactory("ERC1155ABSP");
    erc1155Receiver = await ethers.getContractFactory("ERC1155ReceiverMock");
    erc1155NonReceiver = await ethers.getContractFactory("ERC1155NonReceiverMock");
    [this.owner, this.receiver] = await ethers.getSigners();

    this.erc1155Instance = (await erc1155.deploy(baseTokenURI)) as ERC1155ABSP;
    this.erc1155ReceiverInstance = (await erc1155Receiver.deploy()) as ERC1155ReceiverMock;
    this.erc1155NonReceiverInstance = (await erc1155NonReceiver.deploy()) as ERC1155NonReceiverMock;

    this.contractInstance = this.erc1155Instance;
  });

  shouldERC1155Base();
  shouldERC1155Acessible(DEFAULT_ADMIN_ROLE, MINTER_ROLE, PAUSER_ROLE);
  shouldERC1155Burnable();
  shouldERC1155Supply();
  shouldERC1155Pause();

  describe("supportsInterface", function () {
    it("should support all interfaces", async function () {
      const supportsIERC1155 = await this.erc1155Instance.supportsInterface("0xd9b67a26");
      expect(supportsIERC1155).to.equal(true);
      const supportsIERC1155MetadataURI = await this.erc1155Instance.supportsInterface("0x0e89341c");
      expect(supportsIERC1155MetadataURI).to.equal(true);
      const supportsIERC165 = await this.erc1155Instance.supportsInterface("0x01ffc9a7");
      expect(supportsIERC165).to.equal(true);
      const supportsIAccessControl = await this.erc1155Instance.supportsInterface("0x7965db0b");
      expect(supportsIAccessControl).to.equal(true);
      const supportsInvalidInterface = await this.erc1155Instance.supportsInterface("0xffffffff");
      expect(supportsInvalidInterface).to.equal(false);
    });
  });
});

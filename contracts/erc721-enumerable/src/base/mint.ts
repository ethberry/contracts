import { expect } from "chai";
import { ethers } from "hardhat";
import { constants, Contract } from "ethers";

import { InterfaceId } from "@gemunion/contracts-constants";

import { deployJerk, deployWallet } from "@gemunion/contracts-mocks";
import { TMintERC721EnumFn } from "../shared/interfaces/IMintERC721EnumFn";
import { defaultMintERC721Enum } from "../shared/defaultMintERC721Enum";

export function shouldMint(
  factory: () => Promise<Contract>,
  mint: TMintERC721EnumFn = defaultMintERC721Enum,
  options: Record<string, any> = {},
) {
  describe("mint", function () {
    it("should fail: account is missing role", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const supportsAccessControl = await contractInstance.supportsInterface(InterfaceId.IAccessControl);

      const tx = mint(contractInstance, receiver, receiver.address);
      await expect(tx).to.be.revertedWith(
        supportsAccessControl
          ? `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${options.minterRole}`
          : "Ownable: caller is not the owner",
      );
    });

    it("should mint to wallet", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx = mint(contractInstance, owner, receiver.address);
      await expect(tx).to.emit(contractInstance, "Transfer").withArgs(constants.AddressZero, receiver.address, 0);

      const balance = await contractInstance.balanceOf(receiver.address);
      expect(balance).to.equal(1);
    });

    it("should mint to non receiver", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      const erc721NonReceiverInstance = await deployJerk();

      const tx = mint(contractInstance, owner, erc721NonReceiverInstance.address);
      await expect(tx)
        .to.emit(contractInstance, "Transfer")
        .withArgs(constants.AddressZero, erc721NonReceiverInstance.address, 0);
    });

    it("should mint to receiver", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      const erc721ReceiverInstance = await deployWallet();

      const tx = mint(contractInstance, owner, erc721ReceiverInstance.address);
      await expect(tx)
        .to.emit(contractInstance, "Transfer")
        .withArgs(constants.AddressZero, erc721ReceiverInstance.address, 0);

      const balance = await contractInstance.balanceOf(erc721ReceiverInstance.address);
      expect(balance).to.equal(1);
    });
  });
}

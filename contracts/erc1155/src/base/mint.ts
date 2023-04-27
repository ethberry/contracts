import { expect } from "chai";
import { ethers } from "hardhat";
import { constants, Contract } from "ethers";

import { amount, InterfaceId, tokenId } from "@gemunion/contracts-constants";
import { deployJerk, deployWallet } from "@gemunion/contracts-mocks";
import { TMintERC1155Fn } from "../shared/interfaces/IMintERC1155Fn";
import { defaultMintERC1155 } from "../shared/defaultMintERC1155";

export function shouldMint(
  factory: () => Promise<Contract>,
  mint: TMintERC1155Fn = defaultMintERC1155,
  options: Record<string, any> = {},
) {
  describe("mint", function () {
    it("should mint to wallet", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx1 = mint(contractInstance, owner, receiver.address, tokenId, amount, "0x");
      await expect(tx1)
        .to.emit(contractInstance, "TransferSingle")
        .withArgs(owner.address, constants.AddressZero, receiver.address, tokenId, amount);

      const balance = await contractInstance.balanceOf(receiver.address, tokenId);
      expect(balance).to.equal(amount);
    });

    it("should mint to receiver", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();
      const erc1155ReceiverInstance = await deployWallet();

      const tx1 = mint(contractInstance, owner, erc1155ReceiverInstance.address, tokenId, amount, "0x");
      await expect(tx1)
        .to.emit(contractInstance, "TransferSingle")
        .withArgs(owner.address, constants.AddressZero, erc1155ReceiverInstance.address, tokenId, amount);

      const balance = await contractInstance.balanceOf(erc1155ReceiverInstance.address, tokenId);
      expect(balance).to.equal(amount);
    });

    it("should fail: non receiver", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();
      const erc1155NonReceiverInstance = await deployJerk();

      const tx1 = mint(contractInstance, owner, erc1155NonReceiverInstance.address, tokenId, amount, "0x");
      await expect(tx1).to.be.revertedWith(`ERC1155: transfer to non-ERC1155Receiver implementer`);
    });

    it("should fail: account is missing role", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const supportsAccessControl = await contractInstance.supportsInterface(InterfaceId.IAccessControl);

      const tx1 = mint(contractInstance, receiver, owner.address, tokenId, amount, "0x");
      await expect(tx1).to.be.revertedWith(
        supportsAccessControl
          ? `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${options.minterRole}`
          : "Ownable: caller is not the owner",
      );
    });
  });
}

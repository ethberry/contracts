import { expect } from "chai";
import { ethers } from "hardhat";
import { ZeroAddress } from "ethers";

import { amount, InterfaceId, MINTER_ROLE, tokenId } from "@gemunion/contracts-constants";
import { deployJerk, deployWallet } from "@gemunion/contracts-mocks";

import type { IERC1155Options } from "../shared/defaultMint";
import { defaultMintERC1155 } from "../shared/defaultMint";

export function shouldMint(factory: () => Promise<any>, options: IERC1155Options = {}) {
  const { mint = defaultMintERC1155, minterRole = MINTER_ROLE } = options;

  describe("mint", function () {
    it("should mint to wallet", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx1 = mint(contractInstance, owner, receiver.address, tokenId, amount, "0x");
      await expect(tx1)
        .to.emit(contractInstance, "TransferSingle")
        .withArgs(owner.address, ZeroAddress, receiver.address, tokenId, amount);

      const balance = await contractInstance.balanceOf(receiver.address, tokenId);
      expect(balance).to.equal(amount);
    });

    it("should mint to receiver", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      const erc1155ReceiverInstance = await deployWallet();
      const address = await erc1155ReceiverInstance.getAddress();

      const tx1 = mint(contractInstance, owner, address, tokenId, amount, "0x");
      await expect(tx1)
        .to.emit(contractInstance, "TransferSingle")
        .withArgs(owner.address, ZeroAddress, address, tokenId, amount);

      const balance = await contractInstance.balanceOf(address, tokenId);
      expect(balance).to.equal(amount);
    });

    it("should fail: non receiver", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      const erc1155NonReceiverInstance = await deployJerk();
      const address = await erc1155NonReceiverInstance.getAddress();

      const tx1 = mint(contractInstance, owner, address, tokenId, amount, "0x");
      await expect(tx1).to.be.revertedWith(`ERC1155: transfer to non-ERC1155Receiver implementer`);
    });

    it("should fail: account is missing role", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const supportsAccessControl = await contractInstance.supportsInterface(InterfaceId.IAccessControl);

      const tx1 = mint(contractInstance, receiver, owner.address, tokenId, amount, "0x");
      await expect(tx1).to.be.revertedWith(
        supportsAccessControl
          ? `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${minterRole}`
          : "Ownable: caller is not the owner",
      );
    });
  });
}

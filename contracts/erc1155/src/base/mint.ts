import { expect } from "chai";
import { ethers } from "hardhat";
import { ZeroAddress } from "ethers";

import { amount, InterfaceId, MINTER_ROLE, tokenId } from "@ethberry/contracts-constants";
import { deployRejector, deployHolder } from "@ethberry/contracts-finance";

import type { IERC1155Options } from "../shared/defaultMint";
import { defaultMintERC1155 } from "../shared/defaultMint";

export function shouldMint(factory: () => Promise<any>, options: IERC1155Options = {}) {
  const { mint = defaultMintERC1155, minterRole = MINTER_ROLE } = options;

  describe("mint", function () {
    it("should mint to EOA", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx1 = mint(contractInstance, owner, receiver, tokenId, amount, "0x");
      await expect(tx1)
        .to.emit(contractInstance, "TransferSingle")
        .withArgs(owner, ZeroAddress, receiver, tokenId, amount);

      const balance = await contractInstance.balanceOf(receiver, tokenId);
      expect(balance).to.equal(amount);
    });

    it("should mint to receiver", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      const erc1155ReceiverInstance = await deployHolder();

      const tx1 = mint(contractInstance, owner, erc1155ReceiverInstance, tokenId, amount, "0x");
      await expect(tx1)
        .to.emit(contractInstance, "TransferSingle")
        .withArgs(owner, ZeroAddress, erc1155ReceiverInstance, tokenId, amount);

      const balance = await contractInstance.balanceOf(erc1155ReceiverInstance, tokenId);
      expect(balance).to.equal(amount);
    });

    it("should fail: ERC1155InvalidReceiver (NonReceiver)", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      const erc1155NonReceiverInstance = await deployRejector();

      const tx = mint(contractInstance, owner, erc1155NonReceiverInstance, tokenId, amount, "0x");
      await expect(tx)
        .to.be.revertedWithCustomError(contractInstance, "ERC1155InvalidReceiver")
        .withArgs(erc1155NonReceiverInstance);
    });

    it("should fail: ERC1155InvalidReceiver (ZeroAddress)", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx = mint(contractInstance, owner, ZeroAddress, tokenId, amount, "0x");
      await expect(tx).to.be.revertedWithCustomError(contractInstance, "ERC1155InvalidReceiver").withArgs(ZeroAddress);
    });

    it("should fail: AccessControlUnauthorizedAccount/OwnableUnauthorizedAccount", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const supportsAccessControl = await contractInstance.supportsInterface(InterfaceId.IAccessControl);

      const tx = mint(contractInstance, receiver, owner, tokenId, amount, "0x");
      if (supportsAccessControl) {
        await expect(tx)
          .to.be.revertedWithCustomError(contractInstance, "AccessControlUnauthorizedAccount")
          .withArgs(receiver, minterRole);
      } else {
        // Ownable
        await expect(tx)
          .to.be.revertedWithCustomError(contractInstance, "OwnableUnauthorizedAccount")
          .withArgs(receiver);
      }
    });
  });
}

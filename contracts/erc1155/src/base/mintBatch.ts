import { expect } from "chai";
import { ethers } from "hardhat";
import { ZeroAddress } from "ethers";

import { amount, InterfaceId, MINTER_ROLE, tokenId } from "@gemunion/contracts-constants";
import { deployJerk, deployWallet } from "@gemunion/contracts-mocks";

import type { IERC1155Options } from "../shared/defaultMint";
import { defaultMintBatchERC1155 } from "../shared/defaultMint";

export function shouldMintBatch(factory: () => Promise<any>, options: IERC1155Options = {}) {
  const { mintBatch = defaultMintBatchERC1155, minterRole = MINTER_ROLE } = options;

  describe("mintBatch", function () {
    it("should mint to EOA", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx = mintBatch(contractInstance, owner, receiver, [tokenId, 0n], [amount, amount], "0x");

      await expect(tx)
        .to.emit(contractInstance, "TransferBatch")
        .withArgs(owner.address, ZeroAddress, receiver.address, [tokenId, 0n], [amount, amount]);

      await expect(tx).to.not.be.reverted;

      const balance = await contractInstance.balanceOf(receiver, tokenId);
      expect(balance).to.equal(amount);
    });

    it("should mint to receiver", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      const erc1155ReceiverInstance = await deployWallet();

      const tx = mintBatch(contractInstance, owner, erc1155ReceiverInstance, [tokenId, 0n], [amount, amount], "0x");
      await expect(tx)
        .to.emit(contractInstance, "TransferBatch")
        .withArgs(
          owner.address,
          ZeroAddress,
          await erc1155ReceiverInstance.getAddress(),
          [tokenId, 0n],
          [amount, amount],
        );

      await expect(tx).to.not.be.reverted;

      const balance = await contractInstance.balanceOf(erc1155ReceiverInstance, tokenId);
      expect(balance).to.equal(amount);
    });

    it("should fail: ERC1155InvalidReceiver (NonReceiver)", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      const erc1155NonReceiverInstance = await deployJerk();

      const tx = mintBatch(contractInstance, owner, erc1155NonReceiverInstance, [tokenId], [amount], "0x");
      await expect(tx)
        .to.be.revertedWithCustomError(contractInstance, "ERC1155InvalidReceiver")
        .withArgs(await erc1155NonReceiverInstance.getAddress());
    });

    it("should fail: ERC1155InvalidReceiver (ZeroAddress)", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx = mintBatch(contractInstance, owner, ZeroAddress, [tokenId], [amount], "0x");
      await expect(tx).to.be.revertedWithCustomError(contractInstance, "ERC1155InvalidReceiver").withArgs(ZeroAddress);
    });

    it("should fail: AccessControlUnauthorizedAccount/OwnableUnauthorizedAccount", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const supportsAccessControl = await contractInstance.supportsInterface(InterfaceId.IAccessControl);

      const tx = mintBatch(contractInstance, receiver, owner, [tokenId], [amount], "0x");
      if (supportsAccessControl) {
        await expect(tx)
          .to.be.revertedWithCustomError(contractInstance, "AccessControlUnauthorizedAccount")
          .withArgs(receiver.address, minterRole);
      } else {
        // Ownable
        await expect(tx)
          .to.be.revertedWithCustomError(contractInstance, "OwnableUnauthorizedAccount")
          .withArgs(receiver.address);
      }
    });
  });
}

import { expect } from "chai";
import { ethers } from "hardhat";
import { ZeroAddress } from "ethers";

import { InterfaceId, MINTER_ROLE, tokenId } from "@gemunion/contracts-constants";
import { deployJerk, deployWallet } from "@gemunion/contracts-mocks";

import type { IERC721Options } from "../shared/defaultMint";
import { defaultSafeMintERC721 } from "../shared/defaultMint";

export function shouldSafeMint(factory: () => Promise<any>, options: IERC721Options = {}) {
  describe("safeMint", function () {
    const { safeMint = defaultSafeMintERC721, minterRole = MINTER_ROLE, batchSize = 0n } = options;

    it("should mint to EOA", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx = safeMint(contractInstance, owner, owner.address, batchSize + tokenId);
      await expect(tx)
        .to.emit(contractInstance, "Transfer")
        .withArgs(ZeroAddress, owner.address, batchSize + tokenId);

      const balance = await contractInstance.balanceOf(owner.address);
      expect(balance).to.equal(batchSize + 1n);
    });

    it("should mint to receiver", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();
      const erc721ReceiverInstance = await deployWallet();

      const address = await erc721ReceiverInstance.getAddress();
      const tx = safeMint(contractInstance, owner, address, batchSize + tokenId);
      await expect(tx)
        .to.emit(contractInstance, "Transfer")
        .withArgs(ZeroAddress, address, batchSize + tokenId);

      const balance = await contractInstance.balanceOf(address);
      expect(balance).to.equal(1);
    });

    it("should fail: AccessControlUnauthorizedAccount/OwnableUnauthorizedAccount", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const supportsAccessControl = await contractInstance.supportsInterface(InterfaceId.IAccessControl);

      const tx = safeMint(contractInstance, receiver, receiver.address, batchSize + tokenId);
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

    it("should fail: ERC721InvalidReceiver (NonReceiver)", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();
      const erc721NonReceiverInstance = await deployJerk();

      const address = await erc721NonReceiverInstance.getAddress();
      const tx = safeMint(contractInstance, owner, address, batchSize + tokenId);
      await expect(tx).to.be.revertedWithCustomError(contractInstance, "ERC721InvalidReceiver").withArgs(address);
    });
  });
}

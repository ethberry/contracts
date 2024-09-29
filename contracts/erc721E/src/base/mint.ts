import { expect } from "chai";
import { ethers } from "hardhat";
import { ZeroAddress } from "ethers";

import { InterfaceId, MINTER_ROLE } from "@ethberry/contracts-constants";
import { deployRejector, deployHolder } from "@ethberry/contracts-finance";

import type { IERC721EnumOptions } from "../shared/defaultMint";
import { defaultMintERC721 } from "../shared/defaultMint";

export function shouldMint(factory: () => Promise<any>, options: IERC721EnumOptions = {}) {
  const { mint = defaultMintERC721, minterRole = MINTER_ROLE, tokenId: defaultTokenId = 0n } = options;

  describe("mint", function () {
    it("should mint to EOA", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx = mint(contractInstance, owner, receiver);
      await expect(tx).to.emit(contractInstance, "Transfer").withArgs(ZeroAddress, receiver, defaultTokenId);

      const balance = await contractInstance.balanceOf(receiver);
      expect(balance).to.equal(1);
    });

    it("should mint to non receiver", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      const erc721NonReceiverInstance = await deployRejector();

      const tx = mint(contractInstance, owner, erc721NonReceiverInstance);
      await expect(tx)
        .to.emit(contractInstance, "Transfer")
        .withArgs(ZeroAddress, erc721NonReceiverInstance, defaultTokenId);
    });

    it("should mint to receiver", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      const erc721ReceiverInstance = await deployHolder();

      const tx = mint(contractInstance, owner, erc721ReceiverInstance);
      await expect(tx)
        .to.emit(contractInstance, "Transfer")
        .withArgs(ZeroAddress, erc721ReceiverInstance, defaultTokenId);

      const balance = await contractInstance.balanceOf(erc721ReceiverInstance);
      expect(balance).to.equal(1);
    });

    it("should fail: AccessControlUnauthorizedAccount/OwnableUnauthorizedAccount", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const supportsAccessControl = await contractInstance.supportsInterface(InterfaceId.IAccessControl);

      const tx = mint(contractInstance, receiver, receiver);
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

import { expect } from "chai";
import { ethers } from "hardhat";
import { ZeroAddress } from "ethers";

import { InterfaceId, MINTER_ROLE } from "@gemunion/contracts-constants";
import { deployJerk, deployWallet } from "@gemunion/contracts-mocks";

import type { IERC721EnumOptions } from "../shared/defaultMint";
import { defaultSafeMintERC721 } from "../shared/defaultMint";

export function shouldSafeMint(factory: () => Promise<any>, options: IERC721EnumOptions = {}) {
  const {
    safeMint = defaultSafeMintERC721,
    minterRole = MINTER_ROLE,
    tokenId: defaultTokenId = 0n,
    batchSize: defaultBatchSize = 0n,
  } = options;

  describe("safeMint", function () {
    it("should fail: account is missing role", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const supportsAccessControl = await contractInstance.supportsInterface(InterfaceId.IAccessControl);

      const tx = safeMint(contractInstance, receiver, receiver.address);
      await expect(tx).to.be.revertedWith(
        supportsAccessControl
          ? `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${minterRole}`
          : "Ownable: caller is not the owner",
      );
    });

    it("should mint to wallet", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx = safeMint(contractInstance, owner, receiver.address);
      await expect(tx)
        .to.emit(contractInstance, "Transfer")
        .withArgs(ZeroAddress, receiver.address, defaultBatchSize + defaultTokenId);

      const balance = await contractInstance.balanceOf(receiver.address);
      expect(balance).to.equal(1n);
    });

    it("should fail to mint to non receiver", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      const erc721NonReceiverInstance = await deployJerk();
      const address = await erc721NonReceiverInstance.getAddress();

      const tx = safeMint(contractInstance, owner, address);
      await expect(tx).to.be.revertedWith(`ERC721: transfer to non ERC721Receiver implementer`);
    });

    it("should mint to receiver", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      const erc721ReceiverInstance = await deployWallet();
      const address = await erc721ReceiverInstance.getAddress();

      const tx = safeMint(contractInstance, owner, address);
      await expect(tx)
        .to.emit(contractInstance, "Transfer")
        .withArgs(ZeroAddress, address, defaultBatchSize + defaultTokenId);

      const balance = await contractInstance.balanceOf(address);
      expect(balance).to.equal(1n);
    });
  });
}

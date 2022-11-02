import { expect } from "chai";
import { ethers } from "hardhat";
import { constants } from "ethers";

import { accessControlInterfaceId, amount, MINTER_ROLE, tokenId } from "../../constants";
import { deployErc1155Base, deployErc1155NonReceiver, deployErc1155Receiver } from "../fixtures";

export function shouldMintBatch(name: string) {
  describe("mintBatch", function () {
    it("should mint to wallet", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const { contractInstance } = await deployErc1155Base(name);

      const tx1 = contractInstance.mintBatch(receiver.address, [tokenId], [amount], "0x");
      await expect(tx1)
        .to.emit(contractInstance, "TransferBatch")
        .withArgs(owner.address, constants.AddressZero, receiver.address, [tokenId], [amount]);

      const balance = await contractInstance.balanceOf(receiver.address, tokenId);
      expect(balance).to.equal(amount);
    });

    it("should mint to receiver", async function () {
      const [owner] = await ethers.getSigners();
      const { contractInstance } = await deployErc1155Base(name);
      const { contractInstance: erc1155ReceiverInstance } = await deployErc1155Receiver();

      const tx1 = contractInstance.mintBatch(erc1155ReceiverInstance.address, [tokenId], [amount], "0x");
      await expect(tx1)
        .to.emit(contractInstance, "TransferBatch")
        .withArgs(owner.address, constants.AddressZero, erc1155ReceiverInstance.address, [tokenId], [amount]);

      const balance = await contractInstance.balanceOf(erc1155ReceiverInstance.address, tokenId);
      expect(balance).to.equal(amount);
    });

    it("should fail: non receiver", async function () {
      const { contractInstance } = await deployErc1155Base(name);
      const { contractInstance: erc1155NonReceiverInstance } = await deployErc1155NonReceiver();

      const tx1 = contractInstance.mintBatch(erc1155NonReceiverInstance.address, [tokenId], [amount], "0x");
      await expect(tx1).to.be.revertedWith(`ERC1155: transfer to non ERC1155Receiver implementer`);
    });

    it("should fail: account is missing role", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const { contractInstance } = await deployErc1155Base(name);

      const supportsAccessControl = await contractInstance.supportsInterface(accessControlInterfaceId);

      const tx1 = contractInstance.connect(receiver).mintBatch(receiver.address, [tokenId], [amount], "0x");
      await expect(tx1).to.be.revertedWith(
        supportsAccessControl
          ? `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${MINTER_ROLE}`
          : "Ownable: caller is not the owner",
      );
    });
  });
}

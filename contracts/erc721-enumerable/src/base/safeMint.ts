import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

import { InterfaceId, MINTER_ROLE } from "@gemunion/contracts-constants";

import { deployErc721NonReceiver, deployErc721Receiver } from "@gemunion/contracts-mocks";

export function shouldSafeMint(factory: () => Promise<Contract>, options: Record<string, any>) {
  describe("safeMint", function () {
    it("should fail: account is missing role", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const supportsAccessControl = await contractInstance.supportsInterface(InterfaceId.IAccessControl);

      const tx = contractInstance.connect(receiver).safeMint(receiver.address);
      await expect(tx).to.be.revertedWith(
        supportsAccessControl
          ? `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${
              options.MINTER_ROLE || MINTER_ROLE
            }`
          : "Ownable: caller is not the owner",
      );
    });

    it("should mint to wallet", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx = contractInstance.safeMint(receiver.address);
      await expect(tx)
        .to.emit(contractInstance, "Transfer")
        .withArgs(ethers.constants.AddressZero, receiver.address, 0);

      const balance = await contractInstance.balanceOf(receiver.address);
      expect(balance).to.equal(1);
    });

    it("should fail to mint to non receiver", async function () {
      const contractInstance = await factory();

      const erc721NonReceiverInstance = await deployErc721NonReceiver();

      const tx = contractInstance.safeMint(erc721NonReceiverInstance.address);
      await expect(tx).to.be.revertedWith(`ERC721: transfer to non ERC721Receiver implementer`);
    });

    it("should mint to receiver", async function () {
      const contractInstance = await factory();

      const erc721ReceiverInstance = await deployErc721Receiver();

      const tx = contractInstance.safeMint(erc721ReceiverInstance.address);
      await expect(tx)
        .to.emit(contractInstance, "Transfer")
        .withArgs(ethers.constants.AddressZero, erc721ReceiverInstance.address, 0);

      const balance = await contractInstance.balanceOf(erc721ReceiverInstance.address);
      expect(balance).to.equal(1);
    });
  });
}

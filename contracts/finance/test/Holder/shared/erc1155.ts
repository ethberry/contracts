import { expect } from "chai";
import { ethers } from "hardhat";
import { ZeroAddress } from "ethers";

import { amount, tokenId } from "@gemunion/contracts-constants";
import { deployERC1155Mock } from "@gemunion/contracts-mocks";

export function shouldReceiveErc1155(factory: () => Promise<any>) {
  describe("ERC1155", function () {
    it("accept ERC1155 token", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      const erc1155Instance = await deployERC1155Mock();

      const tx1 = await erc1155Instance.mint(owner, tokenId, amount, "0x");
      await expect(tx1).to.emit(erc1155Instance, "TransferSingle").withArgs(owner, ZeroAddress, owner, tokenId, amount);

      const tx2 = erc1155Instance.safeTransferFrom(owner, contractInstance, tokenId, amount, "0x");
      await expect(tx2)
        .to.emit(erc1155Instance, "TransferSingle")
        .withArgs(owner, owner, contractInstance, tokenId, amount);
    });
  });
}

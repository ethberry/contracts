import { expect } from "chai";
import { ethers } from "hardhat";
import { ZeroAddress } from "ethers";

import { tokenId } from "@ethberry/contracts-constants";
import { deployERC721Mock } from "@ethberry/contracts-mocks";

export function shouldReceiveErc721(factory: () => Promise<any>) {
  describe("ERC721", function () {
    it("accept ERC721 token", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      const erc721Instance = await deployERC721Mock();

      const tx1 = await erc721Instance.mint(owner, tokenId);
      await expect(tx1).to.emit(erc721Instance, "Transfer").withArgs(ZeroAddress, owner, tokenId);

      const tx3 = erc721Instance.transferFrom(owner, contractInstance, tokenId);
      await expect(tx3).to.emit(erc721Instance, "Transfer").withArgs(owner, contractInstance, tokenId);
    });
  });
}

import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

import { amount, tokenId } from "@gemunion/contracts-constants";
import { IMintERC1155Fns } from "../shared/interfaces/IMintERC1155Fn";
import { defaultMintERC1155Fns } from "../shared/defaultMintERC1155";

export function shouldGetTotalSupply(
  factory: () => Promise<Contract>,
  mintFns: IMintERC1155Fns = defaultMintERC1155Fns,
) {
  describe("totalSupply", function () {
    const { mint, mintBatch } = mintFns;
    it("should get total supply (mint)", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, receiver.address, tokenId, amount, "0x");

      const totalSupply = await contractInstance.totalSupply(tokenId);
      expect(totalSupply).to.equal(amount);
    });

    it("should get total supply (mintBatch)", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await mintBatch(contractInstance, owner, receiver.address, [tokenId], [amount], "0x");

      const totalSupply = await contractInstance.totalSupply(tokenId);
      expect(totalSupply).to.equal(amount);
    });
  });
}

import { expect } from "chai";
import { ethers } from "hardhat";
import { parseUnits } from "ethers";

import { royalty } from "@gemunion/contracts-constants";
import type { IERC721Options } from "../shared/defaultMint";

export function shouldGetRoyaltyInfo(factory: () => Promise<any>, options: IERC721Options = {}) {
  const { tokenId: defaultTokenId = 0n } = options;

  describe("royaltyInfo", function () {
    it("should get default royalty info", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      const amount = parseUnits("1.00", "ether");
      const royaltyAmount = parseUnits("0.01", "ether");

      const tx = await contractInstance.royaltyInfo(defaultTokenId, amount);
      expect(tx).deep.equal([owner.address, royaltyAmount]);
    });

    it("should get royalty info", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const amount = parseUnits("1.00", "ether");
      const royaltyAmount = parseUnits("0.02", "ether");

      await contractInstance.setTokenRoyalty(defaultTokenId, receiver.address, royalty * 2);

      const tx = await contractInstance.royaltyInfo(defaultTokenId, amount);
      expect(tx).deep.equal([receiver.address, royaltyAmount]);
    });
  });
}

import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

import { amount, PAUSER_ROLE } from "@gemunion/contracts-constants";
import { defaultMintERC20, IERC20Options } from "./shared/defaultMint";

export function shouldBehaveLikeERC20Pausable(factory: () => Promise<Contract>, options: IERC20Options = {}) {
  const { mint = defaultMintERC20 } = options;
  describe("pause", function () {
    it("should fail: account is missing role", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx = contractInstance.connect(receiver).pause();
      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${PAUSER_ROLE}`,
      );

      const tx2 = contractInstance.connect(receiver).unpause();
      await expect(tx2).to.be.revertedWith(
        `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${PAUSER_ROLE}`,
      );
    });

    it("should pause/unpause", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address);

      const tx1 = contractInstance.pause();
      await expect(tx1).to.emit(contractInstance, "Paused").withArgs(owner.address);

      const tx2 = contractInstance.transfer(receiver.address, amount);
      await expect(tx2).to.be.revertedWith(`ERC20Pausable: token transfer while paused`);

      const tx4 = contractInstance.unpause();
      await expect(tx4).to.emit(contractInstance, "Unpaused").withArgs(owner.address);

      const tx5 = contractInstance.transfer(receiver.address, amount);
      await expect(tx5).to.not.be.reverted;

      const balanceOfOwner = await contractInstance.balanceOf(owner.address);
      expect(balanceOfOwner).to.equal(0);
    });
  });
}

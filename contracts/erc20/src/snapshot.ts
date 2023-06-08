import { expect } from "chai";
import { ethers } from "hardhat";

import { amount, InterfaceId, SNAPSHOT_ROLE } from "@gemunion/contracts-constants";

import { defaultMintERC20, IERC20Options } from "./shared/defaultMint";

export function shouldBehaveLikeERC20Snapshot(factory: () => Promise<any>, options: IERC20Options = {}) {
  const { mint = defaultMintERC20 } = options;

  describe("snapshot", function () {
    it("should fail: account is missing role", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const supportsAccessControl = await contractInstance.supportsInterface(InterfaceId.IAccessControl);

      const tx = contractInstance.connect(receiver).snapshot();
      await expect(tx).to.be.revertedWith(
        supportsAccessControl
          ? `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${SNAPSHOT_ROLE}`
          : "Ownable: caller is not the owner",
      );
    });

    it("should fail: nonexistent id", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx = contractInstance.snapshot();
      await expect(tx).to.emit(contractInstance, "Snapshot").withArgs("1");

      const tx2 = contractInstance.balanceOfAt(receiver.address, "2");
      await expect(tx2).to.be.revertedWith("ERC20Snapshot: nonexistent id");
    });

    it("should make snapshot", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address);

      const tx = contractInstance.snapshot();
      await expect(tx).to.emit(contractInstance, "Snapshot").withArgs("1");

      const balanceOfReceiver = await contractInstance.balanceOfAt(receiver.address, "1");
      expect(balanceOfReceiver).to.equal(0);

      const balanceOfOwner = await contractInstance.balanceOfAt(owner.address, "1");
      expect(balanceOfOwner).to.equal(amount);

      const totalSupply = await contractInstance.totalSupplyAt("1");
      expect(totalSupply).to.equal(amount);
    });
  });
}

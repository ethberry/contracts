import { expect } from "chai";
import { ethers } from "hardhat";
import { constants, utils } from "ethers";
import { time } from "@openzeppelin/test-helpers";
import { Network } from "@ethersproject/networks";

import { amount, tokenName } from "../../constants";

export function shouldPermit() {
  describe("permit", function () {
    let network: Network;

    before(async function () {
      network = await ethers.provider.getNetwork();
    });

    it("initial nonce is 0", async function () {
      const nonces = await this.contractInstance.nonces(this.owner.address);
      expect(nonces).to.equal(0);
    });

    it("domain separator", async function () {
      const chainId = await this.contractInstance.getChainId();
      const actual = await this.contractInstance.DOMAIN_SEPARATOR();
      const expected = ethers.utils._TypedDataEncoder.hashDomain({
        name: tokenName,
        version: "1",
        chainId,
        verifyingContract: this.contractInstance.address,
      });
      expect(actual).to.equal(expected);
    });

    it("accepts owner signature", async function () {
      const nonce = 0;

      const signature = await this.owner._signTypedData(
        // Domain
        {
          name: tokenName,
          version: "1",
          chainId: network.chainId,
          verifyingContract: this.contractInstance.address,
        },
        // Types
        {
          Permit: [
            { name: "owner", type: "address" },
            { name: "spender", type: "address" },
            { name: "value", type: "uint256" },
            { name: "nonce", type: "uint256" },
            { name: "deadline", type: "uint256" },
          ],
        },
        // Value
        {
          owner: this.owner.address,
          spender: this.receiver.address,
          value: amount,
          nonce,
          deadline: constants.MaxUint256,
        },
      );
      const { v, r, s } = utils.splitSignature(signature);

      const tx = await this.contractInstance.permit(
        this.owner.address,
        this.receiver.address,
        amount,
        constants.MaxUint256,
        v,
        r,
        s,
      );

      // besu
      await tx.wait();

      expect(await this.contractInstance.nonces(this.owner.address)).to.equal(1);
      expect(await this.contractInstance.allowance(this.owner.address, this.receiver.address)).to.equal(amount);
    });

    it("rejects reused signature", async function () {
      const nonce = 0;

      const signature = await this.owner._signTypedData(
        // Domain
        {
          name: tokenName,
          version: "1",
          chainId: network.chainId,
          verifyingContract: this.contractInstance.address,
        },
        // Types
        {
          Permit: [
            { name: "owner", type: "address" },
            { name: "spender", type: "address" },
            { name: "value", type: "uint256" },
            { name: "nonce", type: "uint256" },
            { name: "deadline", type: "uint256" },
          ],
        },
        // Value
        {
          owner: this.owner.address,
          spender: this.receiver.address,
          value: amount,
          nonce,
          deadline: constants.MaxUint256,
        },
      );
      const { v, r, s } = utils.splitSignature(signature);

      await this.contractInstance.permit(
        this.owner.address,
        this.receiver.address,
        amount,
        constants.MaxUint256,
        v,
        r,
        s,
      );

      const tx = this.contractInstance.permit(
        this.owner.address,
        this.receiver.address,
        amount,
        constants.MaxUint256,
        v,
        r,
        s,
      );

      await expect(tx).to.be.revertedWith("ERC20Permit: invalid signature");
    });

    it("rejects other signature", async function () {
      const nonce = 0;

      const signature = await this.receiver._signTypedData(
        // Domain
        {
          name: tokenName,
          version: "1",
          chainId: network.chainId,
          verifyingContract: this.contractInstance.address,
        },
        // Types
        {
          Permit: [
            { name: "owner", type: "address" },
            { name: "spender", type: "address" },
            { name: "value", type: "uint256" },
            { name: "nonce", type: "uint256" },
            { name: "deadline", type: "uint256" },
          ],
        },
        // Value
        {
          owner: this.owner.address,
          spender: this.receiver.address,
          value: amount,
          nonce,
          deadline: constants.MaxUint256,
        },
      );
      const { v, r, s } = utils.splitSignature(signature);

      const tx = this.contractInstance.permit(
        this.owner.address,
        this.receiver.address,
        amount,
        constants.MaxUint256,
        v,
        r,
        s,
      );

      await expect(tx).to.be.revertedWith("ERC20Permit: invalid signature");
    });

    it("rejects expired permit", async function () {
      const nonce = 0;
      const deadline = (await time.latest()) - time.duration.weeks(1);

      const signature = await this.owner._signTypedData(
        // Domain
        {
          name: tokenName,
          version: "1",
          chainId: network.chainId,
          verifyingContract: this.contractInstance.address,
        },
        // Types
        {
          Permit: [
            { name: "owner", type: "address" },
            { name: "spender", type: "address" },
            { name: "value", type: "uint256" },
            { name: "nonce", type: "uint256" },
            { name: "deadline", type: "uint256" },
          ],
        },
        // Value
        {
          owner: this.owner.address,
          spender: this.receiver.address,
          value: amount,
          nonce,
          deadline,
        },
      );
      const { v, r, s } = utils.splitSignature(signature);

      const tx = this.contractInstance.permit(this.owner.address, this.receiver.address, amount, deadline, v, r, s);

      await expect(tx).to.be.revertedWith("ERC20Permit: expired deadline");
    });
  });
}

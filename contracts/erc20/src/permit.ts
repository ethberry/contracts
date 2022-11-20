import { expect } from "chai";
import { ethers } from "hardhat";
import { constants, Contract, utils } from "ethers";
import { time } from "@openzeppelin/test-helpers";
import { Network } from "@ethersproject/networks";

import { amount, tokenName } from "@gemunion/contracts-constants";

export function shouldPermit(factory: () => Promise<Contract>) {
  describe("permit", function () {
    let network: Network;

    before(async function () {
      network = await ethers.provider.getNetwork();
    });

    it("initial nonce is 0", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      const nonces = await contractInstance.nonces(owner.address);
      expect(nonces).to.equal(0);
    });

    it("domain separator", async function () {
      const contractInstance = await factory();

      const chainId = await contractInstance.getChainId();
      const actual = await contractInstance.DOMAIN_SEPARATOR();
      const expected = ethers.utils._TypedDataEncoder.hashDomain({
        name: tokenName,
        version: "1",
        chainId,
        verifyingContract: contractInstance.address,
      });
      expect(actual).to.equal(expected);
    });

    it("accepts owner signature", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const nonce = 0;

      const signature = await owner._signTypedData(
        // Domain
        {
          name: tokenName,
          version: "1",
          chainId: network.chainId,
          verifyingContract: contractInstance.address,
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
          owner: owner.address,
          spender: receiver.address,
          value: amount,
          nonce,
          deadline: constants.MaxUint256,
        },
      );
      const { v, r, s } = utils.splitSignature(signature);

      const tx = await contractInstance.permit(owner.address, receiver.address, amount, constants.MaxUint256, v, r, s);

      // besu
      await tx.wait();

      expect(await contractInstance.nonces(owner.address)).to.equal(1);
      expect(await contractInstance.allowance(owner.address, receiver.address)).to.equal(amount);
    });

    it("rejects reused signature", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const nonce = 0;

      const signature = await owner._signTypedData(
        // Domain
        {
          name: tokenName,
          version: "1",
          chainId: network.chainId,
          verifyingContract: contractInstance.address,
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
          owner: owner.address,
          spender: receiver.address,
          value: amount,
          nonce,
          deadline: constants.MaxUint256,
        },
      );
      const { v, r, s } = utils.splitSignature(signature);

      await contractInstance.permit(owner.address, receiver.address, amount, constants.MaxUint256, v, r, s);

      const tx = contractInstance.permit(owner.address, receiver.address, amount, constants.MaxUint256, v, r, s);

      await expect(tx).to.be.revertedWith("ERC20Permit: invalid signature");
    });

    it("rejects other signature", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const nonce = 0;

      const signature = await receiver._signTypedData(
        // Domain
        {
          name: tokenName,
          version: "1",
          chainId: network.chainId,
          verifyingContract: contractInstance.address,
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
          owner: owner.address,
          spender: receiver.address,
          value: amount,
          nonce,
          deadline: constants.MaxUint256,
        },
      );
      const { v, r, s } = utils.splitSignature(signature);

      const tx = contractInstance.permit(owner.address, receiver.address, amount, constants.MaxUint256, v, r, s);

      await expect(tx).to.be.revertedWith("ERC20Permit: invalid signature");
    });

    it("rejects expired permit", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const nonce = 0;
      const deadline = (await time.latest()) - time.duration.weeks(1);

      const signature = await owner._signTypedData(
        // Domain
        {
          name: tokenName,
          version: "1",
          chainId: network.chainId,
          verifyingContract: contractInstance.address,
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
          owner: owner.address,
          spender: receiver.address,
          value: amount,
          nonce,
          deadline,
        },
      );
      const { v, r, s } = utils.splitSignature(signature);

      const tx = contractInstance.permit(owner.address, receiver.address, amount, deadline, v, r, s);

      await expect(tx).to.be.revertedWith("ERC20Permit: expired deadline");
    });
  });
}

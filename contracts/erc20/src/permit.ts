import { expect } from "chai";
import { ethers } from "hardhat";
import { MaxUint256, Network, Signature, TypedDataEncoder } from "ethers";
import { time } from "@openzeppelin/test-helpers";

import { amount, tokenName } from "@ethberry/contracts-constants";

export function shouldBehaveLikeERC20Permit(factory: () => Promise<any>) {
  describe("permit", function () {
    let network: Network;

    before(async function () {
      network = await ethers.provider.getNetwork();
    });

    it("initial nonce is 0", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      const nonces = await contractInstance.nonces(owner);
      expect(nonces).to.equal(0);
    });

    it("domain separator", async function () {
      const contractInstance = await factory();

      const chainId = await contractInstance.getChainId();
      const actual = await contractInstance.DOMAIN_SEPARATOR();
      const expected = TypedDataEncoder.hashDomain({
        name: tokenName,
        version: "1",
        chainId,
        verifyingContract: await contractInstance.getAddress(),
      });
      expect(actual).to.equal(expected);
    });

    it("accepts owner signature", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const nonce = 0;

      const signature = await owner.signTypedData(
        // Domain
        {
          name: tokenName,
          version: "1",
          chainId: network.chainId,
          verifyingContract: await contractInstance.getAddress(),
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
          deadline: MaxUint256,
        },
      );
      const { v, r, s } = Signature.from(signature);

      const tx = await contractInstance.permit(owner, receiver, amount, MaxUint256, v, r, s);

      // besu
      await tx.wait();

      expect(await contractInstance.nonces(owner)).to.equal(1);
      expect(await contractInstance.allowance(owner, receiver)).to.equal(amount);
    });

    it("should fail: ERC2612InvalidSigner", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const nonce = 0;

      const signature = await receiver.signTypedData(
        // Domain
        {
          name: tokenName,
          version: "1",
          chainId: network.chainId,
          verifyingContract: await contractInstance.getAddress(),
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
          deadline: MaxUint256,
        },
      );
      const { v, r, s } = Signature.from(signature);

      const tx = contractInstance.permit(owner, receiver, amount, MaxUint256, v, r, s);

      await expect(tx).revertedWithCustomError(contractInstance, "ERC2612InvalidSigner").withArgs(receiver, owner);
    });

    it("should fail: ERC2612InvalidSigner (2)", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const nonce = 0;

      const signature = await owner.signTypedData(
        // Domain
        {
          name: tokenName,
          version: "1",
          chainId: network.chainId,
          verifyingContract: await contractInstance.getAddress(),
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
          deadline: MaxUint256,
        },
      );
      const { v, r, s } = Signature.from(signature);

      await contractInstance.permit(owner, receiver, amount, MaxUint256, v, r, s);

      const tx = contractInstance.permit(owner, receiver, amount, MaxUint256, v, r, s);

      await expect(tx).revertedWithCustomError(contractInstance, "ERC2612InvalidSigner");
      // spender address is just a piece of crap
      // .withArgs("0x476d091d87D416691B75cd03F28709AD2Da420de", owner);
    });

    it("should fail: ERC2612ExpiredSignature", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const nonce = 0;
      // const deadline = (await time.latest()) - time.duration.weeks(1);
      const block = await ethers.provider.getBlock("latest");
      const deadline = block!.timestamp - time.duration.weeks(1).toNumber();
      const signature = await owner.signTypedData(
        // Domain
        {
          name: tokenName,
          version: "1",
          chainId: network.chainId,
          verifyingContract: await contractInstance.getAddress(),
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
      const { v, r, s } = Signature.from(signature);

      const tx = contractInstance.permit(owner, receiver, amount, deadline, v, r, s);

      await expect(tx).to.be.revertedWithCustomError(contractInstance, "ERC2612ExpiredSignature").withArgs(deadline);
    });
  });
}

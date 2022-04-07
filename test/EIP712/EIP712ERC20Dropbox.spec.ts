import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";
import { Network } from "@ethersproject/networks";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { EIP712ERC20Dropbox, ERC20ACB } from "../../typechain-types";
import { amount, MINTER_ROLE, nonce, tokenName, tokenSymbol } from "../constants";

describe("EIP712ERC20Dropbox", function () {
  let erc20: ContractFactory;
  let erc20Instance: ERC20ACB;
  let dropbox: ContractFactory;
  let dropboxInstance: EIP712ERC20Dropbox;
  let owner: SignerWithAddress;
  let receiver: SignerWithAddress;
  let stranger: SignerWithAddress;
  let network: Network;

  beforeEach(async function () {
    erc20 = await ethers.getContractFactory("ERC20ACB");
    dropbox = await ethers.getContractFactory("EIP712ERC20Dropbox");
    [owner, receiver, stranger] = await ethers.getSigners();

    erc20Instance = (await erc20.deploy(tokenName, tokenSymbol)) as ERC20ACB;
    dropboxInstance = (await dropbox.deploy(tokenName)) as EIP712ERC20Dropbox;

    await dropboxInstance.setFactory(erc20Instance.address);
    await erc20Instance.grantRole(MINTER_ROLE, dropboxInstance.address);

    network = await ethers.provider.getNetwork();
  });

  describe("redeem", function () {
    it("should redeem", async function () {
      const signature = await owner._signTypedData(
        // Domain
        {
          name: tokenName,
          version: "1.0.0",
          chainId: network.chainId,
          verifyingContract: dropboxInstance.address,
        },
        // Types
        {
          NFT: [
            { name: "nonce", type: "bytes32" },
            { name: "account", type: "address" },
            { name: "amount", type: "uint256" },
          ],
        },
        // Value
        {
          nonce,
          account: receiver.address,
          amount,
        },
      );

      const tx1 = dropboxInstance.connect(stranger).redeem(nonce, receiver.address, amount, owner.address, signature);
      await expect(tx1)
        .to.emit(erc20Instance, "Transfer")
        .withArgs(ethers.constants.AddressZero, receiver.address, amount);
    });

    it("should fail: duplicate mint", async function () {
      const signature = await owner._signTypedData(
        // Domain
        {
          name: tokenName,
          version: "1.0.0",
          chainId: network.chainId,
          verifyingContract: dropboxInstance.address,
        },
        // Types
        {
          NFT: [
            { name: "nonce", type: "bytes32" },
            { name: "account", type: "address" },
            { name: "amount", type: "uint256" },
          ],
        },
        // Value
        {
          nonce,
          account: receiver.address,
          amount,
        },
      );

      const tx1 = dropboxInstance.connect(stranger).redeem(nonce, receiver.address, amount, owner.address, signature);
      await expect(tx1)
        .to.emit(erc20Instance, "Transfer")
        .withArgs(ethers.constants.AddressZero, receiver.address, amount);

      const tx2 = dropboxInstance.connect(stranger).redeem(nonce, receiver.address, amount, owner.address, signature);
      await expect(tx2).to.be.revertedWith("EIP712ERC20Dropbox: Expired signature");
    });

    it("should fail: invalid signature", async function () {
      const signature = await owner._signTypedData(
        // Domain
        {
          name: tokenName,
          version: "1.0.0",
          chainId: network.chainId,
          verifyingContract: dropboxInstance.address,
        },
        // Types
        {
          NFT: [
            { name: "nonce", type: "bytes32" },
            { name: "account", type: "address" },
            { name: "amount", type: "uint256" },
          ],
        },
        // Value
        {
          nonce,
          account: receiver.address,
          amount,
        },
      );

      const tx1 = dropboxInstance
        .connect(stranger)
        .redeem(nonce, receiver.address, amount, stranger.address, signature);
      await expect(tx1).to.be.revertedWith("EIP712ERC20Dropbox: Invalid signature");
    });
  });
});

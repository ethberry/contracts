import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";
import { Network } from "@ethersproject/networks";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { EIP712ERC1155Dropbox, ERC1155ACB } from "../../typechain-types";
import { amount, baseTokenURI, MINTER_ROLE, nonce, tokenId, tokenName } from "../constants";

describe("EIP712ERC1155Dropbox", function () {
  let erc721: ContractFactory;
  let erc721Instance: ERC1155ACB;
  let dropbox: ContractFactory;
  let dropboxInstance: EIP712ERC1155Dropbox;
  let owner: SignerWithAddress;
  let receiver: SignerWithAddress;
  let stranger: SignerWithAddress;
  let network: Network;

  beforeEach(async function () {
    erc721 = await ethers.getContractFactory("ERC1155ACB");
    dropbox = await ethers.getContractFactory("EIP712ERC1155Dropbox");
    [owner, receiver, stranger] = await ethers.getSigners();

    erc721Instance = (await erc721.deploy(baseTokenURI)) as ERC1155ACB;
    dropboxInstance = (await dropbox.deploy(tokenName)) as EIP712ERC1155Dropbox;

    await dropboxInstance.setFactory(erc721Instance.address);
    await erc721Instance.grantRole(MINTER_ROLE, dropboxInstance.address);

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
            { name: "tokenIds", type: "uint256[]" },
            { name: "amounts", type: "uint256[]" },
          ],
        },
        // Value
        {
          nonce,
          account: receiver.address,
          tokenIds: [tokenId],
          amounts: [amount],
        },
      );

      const tx1 = dropboxInstance
        .connect(stranger)
        .redeem(nonce, receiver.address, [tokenId], [amount], owner.address, signature);
      await expect(tx1)
        .to.emit(erc721Instance, "TransferBatch")
        .withArgs(dropboxInstance.address, ethers.constants.AddressZero, receiver.address, [tokenId], [amount]);
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
            { name: "tokenIds", type: "uint256[]" },
            { name: "amounts", type: "uint256[]" },
          ],
        },
        // Value
        {
          nonce,
          account: receiver.address,
          tokenIds: [tokenId],
          amounts: [amount],
        },
      );

      const tx1 = dropboxInstance
        .connect(stranger)
        .redeem(nonce, receiver.address, [tokenId], [amount], owner.address, signature);
      await expect(tx1)
        .to.emit(erc721Instance, "TransferBatch")
        .withArgs(dropboxInstance.address, ethers.constants.AddressZero, receiver.address, [tokenId], [amount]);

      const tx2 = dropboxInstance
        .connect(stranger)
        .redeem(nonce, receiver.address, [tokenId], [amount], owner.address, signature);
      await expect(tx2).to.be.revertedWith("EIP712ERC1155Dropbox: Expired signature");
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
            { name: "tokenIds", type: "uint256[]" },
            { name: "amounts", type: "uint256[]" },
          ],
        },
        // Value
        {
          nonce,
          account: receiver.address,
          tokenIds: [tokenId],
          amounts: [amount],
        },
      );

      const tx1 = dropboxInstance
        .connect(stranger)
        .redeem(nonce, receiver.address, [tokenId], [amount], stranger.address, signature);
      await expect(tx1).to.be.revertedWith("EIP712ERC1155Dropbox: Invalid signature");
    });
  });
});

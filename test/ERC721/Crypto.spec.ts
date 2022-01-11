import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractFactory, BigNumber } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { TypedDataUtils, signTypedMessage } from "eth-sig-util";
import * as ethereumjsutil from "ethereumjs-util";

import { CryptoTest } from "../../typechain-types";
import { baseTokenURI, MINTER_ROLE, tokenName, tokenSymbol, ZERO_ADDR } from "../constants";

describe("CryptoGemunion", function () {
  let erc721: ContractFactory;
  let erc721Instance: CryptoTest;
  let owner: SignerWithAddress;
  let receiver: SignerWithAddress;

  const EIP712Domain = [
    { name: "name", type: "string" },
    { name: "version", type: "string" },
    { name: "chainId", type: "uint256" },
    { name: "verifyingContract", type: "address" },
  ];

  beforeEach(async function () {
    erc721 = await ethers.getContractFactory("CryptoTest");
    [owner, receiver] = await ethers.getSigners();

    erc721Instance = (await erc721.deploy(tokenName, tokenSymbol, baseTokenURI)) as CryptoTest;
  });

  describe("crypto", function () {
    it("initial nonce is 0", async function () {
      expect(await erc721Instance.nonces(receiver.address)).to.equal(BigNumber.from("0"));
    });

    it("domain separator", async function () {
      const name = tokenName;
      const version = "1";
      const { chainId } = await ethers.provider.getNetwork();
      const verifyingContract = erc721Instance.address;

      const domainSeparator =
        "0x" +
        TypedDataUtils.hashStruct(
          "EIP712Domain",
          { name, version, chainId, verifyingContract },
          { EIP712Domain },
        ).toString("hex");

      expect(await erc721Instance.DOMAIN_SEPARATOR()).to.equal(domainSeparator);
    });

    it.only("should work crypto", async function () {
      const name = tokenName;
      const version = "1";
      const { chainId } = await ethers.provider.getNetwork();
      const verifyingContract = erc721Instance.address;

      const value = 42;
      const nonce = 0;

      const owneraddr = owner.address;
      const spenderaddr = receiver.address;

      const MyFunc = [
        { name: "owneraddr", type: "address" },
        { name: "spenderaddr", type: "address" },
        { name: "value", type: "uint256" },
        { name: "nonce", type: "uint256" },
      ];

      const buildData = (chainId: number, verifyingContract: string) => ({
        primaryType: "MyFunc" as const,
        types: { EIP712Domain, MyFunc },
        domain: { name, version, chainId, verifyingContract },
        message: { owneraddr, spenderaddr, value, nonce },
      });

      const data = buildData(chainId, verifyingContract);
      const pk = "ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
      const pkbuf = Buffer.from(pk, "hex");
      const signature = signTypedMessage(pkbuf, { data });

      const { v, r, s } = ethereumjsutil.fromRpcSig(signature);

      const tx = erc721Instance.execMyfunc(owner.address, receiver.address, value, v, r, s);
      await expect(tx).to.emit(erc721Instance, "Myevent").withArgs(value);

      const req = {
        to: receiver.address,
        tokenId: 0,
        nonce: 0,
      };

      const txr = erc721Instance.execute(req, { value: ethers.utils.parseEther("0.1") });
      await expect(txr).to.emit(erc721Instance, "Execevent").withArgs(req.tokenId, erc721Instance.address);

      const txr1 = erc721Instance.execute(req, { value: ethers.utils.parseEther("0.1") });
      await expect(txr1).to.be.revertedWith(`Executor: current nonce does not match request`);
    });
  });
});

import { expect } from "chai";
import { ethers } from "hardhat";
import { ZeroAddress } from "ethers";

import { deployContract, shouldSupportsInterface } from "@gemunion/contracts-utils";
import { amount, InterfaceId, tokenId } from "@gemunion/contracts-constants";
import { deployERC1363Mock, deployERC20Mock, deployERC721Mock, deployERC1155Mock } from "@gemunion/contracts-mocks";

describe("AllTypesHolder", function () {
  const factory = () => deployContract(this.title);

  it("accept ERC20 token", async function () {
    const [owner] = await ethers.getSigners();
    const contractInstance = await factory();

    const erc20Instance = await deployERC20Mock();

    const tx1 = await erc20Instance.mint(owner, amount);
    await expect(tx1).to.emit(erc20Instance, "Transfer").withArgs(ZeroAddress, owner, amount);

    const tx3 = erc20Instance.transfer(contractInstance, amount);
    await expect(tx3)
      .to.emit(erc20Instance, "Transfer")
      .withArgs(owner, contractInstance, amount)
      .to.not.emit(contractInstance, "TransferReceived");
  });

  it("accept ERC1363 token", async function () {
    const [owner] = await ethers.getSigners();
    const contractInstance = await factory();

    const erc20Instance = await deployERC1363Mock();

    const tx1 = await erc20Instance.mint(owner, amount);
    await expect(tx1).to.emit(erc20Instance, "Transfer").withArgs(ZeroAddress, owner, amount);

    const tx3 = erc20Instance.transferAndCall(contractInstance, amount);
    await expect(tx3)
      .to.emit(erc20Instance, "Transfer")
      .withArgs(owner, contractInstance, amount)
      .to.emit(contractInstance, "TransferReceived")
      .withArgs(owner, owner, amount, "0x");
  });

  it("accept ERC721 token", async function () {
    const [owner] = await ethers.getSigners();
    const contractInstance = await factory();

    const erc20Instance = await deployERC721Mock();

    const tx1 = await erc20Instance.mint(owner, tokenId);
    await expect(tx1).to.emit(erc20Instance, "Transfer").withArgs(ZeroAddress, owner, tokenId);

    const tx3 = erc20Instance.transferFrom(owner, contractInstance, tokenId);
    await expect(tx3).to.emit(erc20Instance, "Transfer").withArgs(owner, contractInstance, tokenId);
  });

  it("accept ERC1155 token", async function () {
    const [owner] = await ethers.getSigners();
    const contractInstance = await factory();

    const erc20Instance = await deployERC1155Mock();

    const tx1 = await erc20Instance.mint(owner, tokenId, amount, "0x");
    await expect(tx1).to.emit(erc20Instance, "TransferSingle").withArgs(owner, ZeroAddress, owner, tokenId, amount);

    const tx3 = erc20Instance.safeTransferFrom(owner, contractInstance, tokenId, amount, "0x");
    await expect(tx3)
      .to.emit(erc20Instance, "TransferSingle")
      .withArgs(owner, owner, contractInstance, tokenId, amount);
  });

  shouldSupportsInterface(factory)([InterfaceId.IERC165, InterfaceId.IERC1363Spender, InterfaceId.IERC1363Receiver]);
});

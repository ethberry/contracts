import { expect } from "chai";
import { ethers } from "hardhat";
import { ZeroAddress } from "ethers";

import { deployContract, shouldSupportsInterface } from "@gemunion/contracts-utils";
import { amount, InterfaceId } from "@gemunion/contracts-constants";
import { deployERC1363Mock, deployERC20Mock } from "@gemunion/contracts-mocks";

describe("CoinHolder", function () {
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

  shouldSupportsInterface(factory)([InterfaceId.IERC165, InterfaceId.IERC1363Spender, InterfaceId.IERC1363Receiver]);
});

import { expect } from "chai";
import { ethers } from "hardhat";
import { ZeroAddress } from "ethers";

import { deployContract, shouldSupportsInterface } from "@gemunion/contracts-utils";
import { InterfaceId, tokenId } from "@gemunion/contracts-constants";

import { deployERC20 } from "../../src/fixture";

describe("NftHolder", function () {
  const factory = () => deployContract(this.title);

  it("accept ERC721 token", async function () {
    const [owner] = await ethers.getSigners();
    const contractInstance = await factory();

    const erc20Instance = await deployERC20("ERC721Mock");

    const tx1 = await erc20Instance.mint(owner, tokenId);
    await expect(tx1).to.emit(erc20Instance, "Transfer").withArgs(ZeroAddress, owner.address, tokenId);

    const tx3 = erc20Instance.transferFrom(owner, contractInstance, tokenId);
    await expect(tx3)
      .to.emit(erc20Instance, "Transfer")
      .withArgs(owner.address, await contractInstance.getAddress(), tokenId);
  });

  shouldSupportsInterface(factory)([InterfaceId.IERC165, InterfaceId.IERC721Receiver]);
});

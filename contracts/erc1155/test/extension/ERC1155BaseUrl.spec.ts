import { expect, use } from "chai";
import { solidity } from "ethereum-waffle";

import { baseTokenURI, DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE, tokenId } from "@gemunion/contracts-constants";
import { shouldBeAccessible, shouldSupportsInterface } from "@gemunion/contracts-mocha";

import { shouldERC1155Burnable } from "../../src/burnable";
import { shouldMint } from "../../src/base/mint";
import { shouldMintBatch } from "../../src/base/mintBatch";
import { shouldBalanceOf } from "../../src/base/balanceOf";
import { shouldBalanceOfBatch } from "../../src/base/balanceOfBatch";
import { shouldSetApprovalForAll } from "../../src/base/setApprovalForAll";
import { shouldSafeTransferFrom } from "../../src/base/safeTransferFrom";
import { shouldSafeBatchTransferFrom } from "../../src/base/safeBatchTransferFrom";
import { deployErc1155Base } from "../../src/fixtures";

use(solidity);

describe("ERC1155BaseUrlTest", function () {
  const factory = () => deployErc1155Base(this.title);

  shouldMint(factory);
  shouldMintBatch(factory);
  shouldBalanceOf(factory);
  shouldBalanceOfBatch(factory);
  shouldSetApprovalForAll(factory);
  shouldSafeTransferFrom(factory);
  shouldSafeBatchTransferFrom(factory);

  shouldBeAccessible(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldERC1155Burnable(factory);

  describe("uri", function () {
    it("should get token uri", async function () {
      const contractInstance = await factory();

      const uri2 = await contractInstance.uri(tokenId);
      expect(uri2).to.equal(`${baseTokenURI}/${contractInstance.address.toLowerCase()}/{id}`);
    });
  });

  shouldSupportsInterface(factory)(
    InterfaceId.IERC165,
    InterfaceId.IAccessControl,
    InterfaceId.IERC1155,
    InterfaceId.IERC1155Metadata,
  );
});

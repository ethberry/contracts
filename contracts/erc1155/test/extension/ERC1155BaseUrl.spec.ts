import { expect, use } from "chai";
import { solidity } from "ethereum-waffle";

import { baseTokenURI, DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE, tokenId } from "@gemunion/contracts-constants";
import { shouldBeAccessible, shouldSupportsInterface } from "@gemunion/contracts-mocha";

import { shouldERC1155Burnable } from "../shared/burnable";
import { shouldMint } from "../shared/base/mint";
import { shouldMintBatch } from "../shared/base/mintBatch";
import { shouldBalanceOf } from "../shared/base/balanceOf";
import { shouldBalanceOfBatch } from "../shared/base/balanceOfBatch";
import { shouldSetApprovalForAll } from "../shared/base/setApprovalForAll";
import { shouldSafeTransferFrom } from "../shared/base/safeTransferFrom";
import { shouldSafeBatchTransferFrom } from "../shared/base/safeBatchTransferFrom";
import { deployErc1155Base } from "../shared/fixtures";

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

import { expect, use } from "chai";
import { solidity } from "ethereum-waffle";

import { baseTokenURI, DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE, tokenId } from "../constants";
import { shouldSupportsInterface } from "../shared/supportInterface";
import { shouldERC1155Accessible } from "../shared/accessible";
import { shouldERC1155Burnable } from "../shared/burnable";
import { deployErc1155Base } from "../shared/fixtures";
import { shouldMint } from "../shared/base/mint";
import { shouldMintBatch } from "../shared/base/mintBatch";
import { shouldBalanceOf } from "../shared/base/balanceOf";
import { shouldBalanceOfBatch } from "../shared/base/balanceOfBatch";
import { shouldSetApprovalForAll } from "../shared/base/setApprovalForAll";
import { shouldSafeTransferFrom } from "../shared/base/safeTransferFrom";
import { shouldSafeBatchTransferFrom } from "../shared/base/safeBatchTransferFrom";

use(solidity);

describe("ERC1155BaseUrl", function () {
  const name = "ERC1155BaseUrlTest";

  shouldMint(name);
  shouldMintBatch(name);
  shouldBalanceOf(name);
  shouldBalanceOfBatch(name);
  shouldSetApprovalForAll(name);
  shouldSafeTransferFrom(name);
  shouldSafeBatchTransferFrom(name);

  shouldERC1155Accessible(name)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldERC1155Burnable(name);

  describe("uri", function () {
    it("should get token uri", async function () {
      const { contractInstance } = await deployErc1155Base(name);

      const uri2 = await contractInstance.uri(tokenId);
      expect(uri2).to.equal(`${baseTokenURI}/${contractInstance.address.toLowerCase()}/{id}`);
    });
  });

  shouldSupportsInterface(name)(
    InterfaceId.IERC165,
    InterfaceId.IAccessControl,
    InterfaceId.IERC1155,
    InterfaceId.IERC1155Metadata,
  );
});

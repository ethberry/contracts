import { use } from "chai";
import { solidity } from "ethereum-waffle";

import { DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE } from "@gemunion/contracts-constants";
import { shouldBeAccessible, shouldSupportsInterface } from "@gemunion/contracts-mocha";

import {
  shouldBalanceOf,
  shouldBalanceOfBatch,
  shouldBurnable,
  shouldCustomURI,
  shouldMint,
  shouldMintBatch,
  shouldSafeBatchTransferFrom,
  shouldSafeTransferFrom,
  shouldSetApprovalForAll,
} from "../../src";
import { deployErc1155Base } from "../../src/fixtures";

use(solidity);

describe("ERC1155BaseUrlTest", function () {
  const factory = () => deployErc1155Base(this.title);

  shouldBeAccessible(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);

  // base without uri
  shouldMint(factory);
  shouldMintBatch(factory);
  shouldBalanceOf(factory);
  shouldBalanceOfBatch(factory);
  shouldSetApprovalForAll(factory);
  shouldSafeTransferFrom(factory);
  shouldSafeBatchTransferFrom(factory);

  shouldCustomURI(factory);

  shouldBurnable(factory);

  shouldSupportsInterface(factory)(
    InterfaceId.IERC165,
    InterfaceId.IAccessControl,
    InterfaceId.IERC1155,
    InterfaceId.IERC1155Metadata,
  );
});

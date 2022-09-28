import { expect, use } from "chai";
import { solidity } from "ethereum-waffle";

import { DEFAULT_ADMIN_ROLE, MINTER_ROLE } from "../constants";
import { shouldERC721Base } from "../ERC721/shared/base/enumerable";
import { shouldERC721Accessible } from "../ERC721/shared/accessible";
import { shouldERC721Burnable } from "../ERC721/shared/burnable/enumerable/burn";
import { shouldERC721Enumerable } from "../ERC721/shared/enumerable";
import { shouldERC721Royalty } from "../ERC721/shared/royalty/enumerable";
import { shouldERC721Storage } from "../ERC721/shared/storage/enumerable/storage";
import { deployErc721Base } from "../ERC721/shared/fixtures";

use(solidity);

describe("ERC998BottomUp", function () {
  const name = "ERC998BottomUp";

  shouldERC721Base(name);
  shouldERC721Accessible(name)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldERC721Burnable(name);
  shouldERC721Enumerable(name);
  shouldERC721Royalty(name);
  shouldERC721Storage(name);

  describe("supportsInterface", function () {
    it("should support all interfaces", async function () {
      const { contractInstance } = await deployErc721Base(name);

      const supportsIERC721 = await contractInstance.supportsInterface("0x80ac58cd");
      expect(supportsIERC721).to.equal(true);
      const supportsIERC721Metadata = await contractInstance.supportsInterface("0x5b5e139f");
      expect(supportsIERC721Metadata).to.equal(true);
      const supportsIERC721Enumerable = await contractInstance.supportsInterface("0x780e9d63");
      expect(supportsIERC721Enumerable).to.equal(true);
      const supportsIERC165 = await contractInstance.supportsInterface("0x01ffc9a7");
      expect(supportsIERC165).to.equal(true);
      const supportsIAccessControl = await contractInstance.supportsInterface("0x7965db0b");
      expect(supportsIAccessControl).to.equal(true);
      const supportsERC998 = await contractInstance.supportsInterface("0xa1b23002");
      expect(supportsERC998).to.equal(true);
      const supportsInvalidInterface = await contractInstance.supportsInterface("0xffffffff");
      expect(supportsInvalidInterface).to.equal(false);
    });
  });
});

import { expect, use } from "chai";
import { solidity } from "ethereum-waffle";

import { DEFAULT_ADMIN_ROLE, MINTER_ROLE } from "../../constants";
import { shouldERC721Accessible } from "../shared/accessible";
import { shouldERC721Burnable } from "../shared/enumerable/burn";
import { shouldERC721Capped } from "../shared/enumerable/capped";
import { shouldERC721Base } from "../shared/enumerable/base";
import { shouldERC721Royalty } from "../shared/enumerable/royalty";
import { shouldERC721Enumerable } from "../shared/enumerable/enumerable";
import { deployErc721Base } from "../shared/fixtures";

use(solidity);

describe("ERC721ABCER", function () {
  const name = "ERC721ABCER";

  shouldERC721Base(name);
  shouldERC721Accessible(name)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldERC721Burnable(name);
  shouldERC721Capped(name);
  shouldERC721Enumerable(name);
  shouldERC721Royalty(name);

  describe("supportsInterface", function () {
    it("should support all interfaces", async function () {
      const { contractInstance } = await deployErc721Base(name);

      const supportsIERC721 = await contractInstance.supportsInterface("0x80ac58cd");
      expect(supportsIERC721).to.equal(true);
      const supportsIERC721Metadata = await contractInstance.supportsInterface("0x5b5e139f");
      expect(supportsIERC721Metadata).to.equal(true);
      const supportsIERC721Enumerable = await contractInstance.supportsInterface("0x780e9d63");
      expect(supportsIERC721Enumerable).to.equal(true);
      const supportsIERC721Royalty = await contractInstance.supportsInterface("0x2a55205a");
      expect(supportsIERC721Royalty).to.equal(true);
      const supportsIERC165 = await contractInstance.supportsInterface("0x01ffc9a7");
      expect(supportsIERC165).to.equal(true);
      const supportsIAccessControl = await contractInstance.supportsInterface("0x7965db0b");
      expect(supportsIAccessControl).to.equal(true);
      const supportsInvalidInterface = await contractInstance.supportsInterface("0xffffffff");
      expect(supportsInvalidInterface).to.equal(false);
    });
  });
});

import { expect, use } from "chai";
import { solidity } from "ethereum-waffle";

import { DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE } from "@gemunion/contracts-constants";
import { shouldBehaveLikeAccessControl, shouldSupportsInterface } from "@gemunion/contracts-mocha";

import { shouldBehaveLikeERC721, shouldBehaveLikeERC721Burnable, shouldBehaveLikeERC721Royalty } from "../../src";
import { deployERC721 } from "../../src/fixtures";

use(solidity);

describe("ERC721ConsecutiveTest", function () {
  const factory = () => deployERC721(this.title);

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);

  shouldBehaveLikeERC721(factory);
  shouldBehaveLikeERC721Burnable(factory);
  shouldBehaveLikeERC721Royalty(factory);

  describe("Consecutive", function () {
    it("ownerOf", async function () {
      const contractInstance = await factory();

      for (const e of new Array(100).fill(null).map((_e, i) => i)) {
        const ownerOf = await contractInstance.ownerOf(e);
        expect(ownerOf).to.equal("0x000000000000000000000000000000000000dEaD");
      }
    });

    it("balanceOf", async function () {
      const contractInstance = await factory();

      const balance = await contractInstance.balanceOf("0x000000000000000000000000000000000000dEaD");
      expect(balance).to.equal(100);
    });
  });

  shouldSupportsInterface(factory)(
    InterfaceId.IERC165,
    InterfaceId.IAccessControl,
    InterfaceId.IERC721,
    InterfaceId.IERC721Metadata,
    InterfaceId.IRoyalty,
  );
});

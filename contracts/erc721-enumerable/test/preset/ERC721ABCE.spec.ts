import { DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE } from "@gemunion/contracts-constants";
import { shouldBehaveLikeAccessControl, shouldSupportsInterface } from "@gemunion/contracts-mocha";

import {
  shouldBehaveLikeERC721,
  shouldBehaveLikeERC721Burnable,
  shouldBehaveLikeERC721Capped,
  shouldBehaveLikeERC721Enumerable,
} from "../../src";
import { deployERC721 } from "../../src/fixtures";
import { Contract, Signer } from "ethers";

describe("ERC721ABCE", function () {
  const factory = () => deployERC721(this.title);

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);

  shouldBehaveLikeERC721(factory, {
    // In case if it is mintCommin that supports safeMint
    safeMint: (contractInstance: Contract, signer: Signer, receiver: string) => {
      return contractInstance.connect(signer).safeMint(receiver) as Promise<any>;
    },
  });
  shouldBehaveLikeERC721Burnable(factory);
  shouldBehaveLikeERC721Capped(factory);
  shouldBehaveLikeERC721Enumerable(factory);

  shouldSupportsInterface(factory)(
    InterfaceId.IERC165,
    InterfaceId.IAccessControl,
    InterfaceId.IERC721,
    InterfaceId.IERC721Metadata,
    InterfaceId.IERC721Enumerable,
  );
});

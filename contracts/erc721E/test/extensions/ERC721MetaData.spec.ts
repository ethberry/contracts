import {
  DEFAULT_ADMIN_ROLE,
  InterfaceId,
  METADATA_ROLE,
  MINTER_ROLE,
  TEMPLATE_ID,
} from "@ethberry/contracts-constants";
import { shouldBehaveLikeAccessControl } from "@ethberry/contracts-access";
import { shouldSupportsInterface } from "@ethberry/contracts-utils";

import {
  shouldBehaveLikeERC721,
  shouldBehaveLikeERC721Burnable,
  shouldBehaveLikeERC721Metadata,
  shouldBehaveLikeERC721Royalty,
} from "../../src";
import { deployERC721 } from "../../src/fixtures";
import { templateId } from "../../src/contants";

describe("ERC721MetaDataTest", function () {
  const factory = () => deployERC721(this.title);

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE, METADATA_ROLE);

  shouldBehaveLikeERC721(factory);
  shouldBehaveLikeERC721Burnable(factory);
  shouldBehaveLikeERC721Royalty(factory);
  shouldBehaveLikeERC721Metadata(factory, {}, [{ key: TEMPLATE_ID, value: templateId }]);

  shouldSupportsInterface(factory)([
    InterfaceId.IERC165,
    InterfaceId.IAccessControl,
    InterfaceId.IERC721,
    InterfaceId.IERC721Metadata,
    InterfaceId.IRoyalty,
  ]);
});

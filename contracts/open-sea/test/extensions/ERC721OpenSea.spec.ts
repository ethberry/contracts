import { DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE } from "@gemunion/contracts-constants";
import { shouldBehaveLikeAccessControl, shouldSupportsInterface } from "@gemunion/contracts-mocha";
import { deployContract } from "@gemunion/contracts-mocks";
import { shouldBehaveLikeERC721 } from "@gemunion/contracts-erc721e";

import { deployERC721 } from "../../src/fixtures";
import { ERC721OpenSeaTest, ProxyRegistry } from "../../typechain-types";

describe("ERC721OpenSeaTest", function () {
  const factory = () => deployERC721<ERC721OpenSeaTest>(this.title);

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);

  shouldBehaveLikeERC721(async () => {
    const instance = await factory();
    const proxyRegistryInstance = await deployContract<ProxyRegistry>("ProxyRegistry");
    await instance.setProxyRegistry(proxyRegistryInstance.address);
    return instance;
  });

  shouldSupportsInterface(factory)([
    InterfaceId.IERC165,
    InterfaceId.IAccessControl,
    InterfaceId.IERC721,
    InterfaceId.IERC721Metadata,
    InterfaceId.IRoyalty,
  ]);
});

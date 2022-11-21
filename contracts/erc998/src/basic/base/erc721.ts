import { Contract } from "ethers";

import {
  shouldBehaveLikeERC721,
  shouldBehaveLikeERC721Burnable,
  shouldBehaveLikeERC721Enumerable,
  shouldBehaveLikeERC721Royalty,
  shouldBehaveLikeERC721UriStorage,
} from "@gemunion/contracts-erc721-enumerable";

export function shouldBehaveLikeERC721BERS(factory: () => Promise<Contract>) {
  shouldBehaveLikeERC721(factory);
  shouldBehaveLikeERC721Burnable(factory);
  shouldBehaveLikeERC721Enumerable(factory);
  shouldBehaveLikeERC721Royalty(factory);
  shouldBehaveLikeERC721UriStorage(factory);
}

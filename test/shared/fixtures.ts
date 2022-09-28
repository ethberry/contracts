import { deployErc20Base } from "../ERC20/shared/fixtures";
import { deployErc721Base } from "../ERC721/shared/fixtures";
import { deployErc1155Base } from "../ERC1155/shared/fixtures";

export async function deployTokenBase(name: string): Promise<any> {
  const [preset] = name.split("Test");
  switch (true) {
    case preset.substring(0, 5) === "ERC20":
      return deployErc20Base(name);
    case preset.substring(0, 6) === "ERC721":
      return deployErc721Base(name);
    case preset.substring(0, 6) === "ERC998":
      return deployErc721Base(name);
    case preset.substring(0, 7) === "ERC1155":
      return deployErc1155Base(name);
    default:
      throw new Error("Unrecognized token");
  }
}

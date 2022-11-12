import { shouldSetUser } from "./setUser";
import { shouldUserOf } from "./userOf";
import { shouldUserExprires } from "./userExpires";

export function shouldERC721User(name: string) {
  shouldSetUser(name);
  shouldUserOf(name);
  shouldUserExprires(name);
}

import { Contract } from "ethers";

import { shouldSetUser } from "./setUser";
import { shouldUserOf } from "./userOf";
import { shouldUserExprires } from "./userExpires";

export function shouldUser(factory: () => Promise<Contract>) {
  shouldSetUser(factory);
  shouldUserOf(factory);
  shouldUserExprires(factory);
}

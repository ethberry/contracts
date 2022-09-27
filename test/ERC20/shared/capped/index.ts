import { shouldMint } from "./mint";

export function shouldERC20Capped(name: string) {
  shouldMint(name);
}

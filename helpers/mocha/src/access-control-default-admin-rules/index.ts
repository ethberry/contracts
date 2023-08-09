import "@nomicfoundation/hardhat-toolbox";

import { shouldBehaveLikeAccessControl } from "../access-control";
import { IAccessControlOptions } from "../shared/interfaces";

export function shouldBehaveLikeAccessControlDefaultAdminRules(
  factory: () => Promise<any>,
  options?: IAccessControlOptions,
) {
  return (...roles: Array<string>) => {
    shouldBehaveLikeAccessControl(factory, options)(...roles);

    // TODO test rest of the methods
  };
}

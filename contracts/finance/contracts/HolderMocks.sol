// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.20;

import {NativeReceiver, NativeRejector, CoinHolder, NftHolder, SemiCoinHolder, SemiNftHolder, AllTypesHolder} from "./Holder.sol";

contract NativeReceiverMock is NativeReceiver {}

contract NativeRejectorMock is NativeRejector {}

contract CoinHolderMock is CoinHolder {}

contract NftHolderMock is NftHolder {}

contract SemiCoinHolderMock is SemiCoinHolder {}

contract SemiNftHolderMock is SemiNftHolder {}

contract AllTypesHolderMock is AllTypesHolder {}

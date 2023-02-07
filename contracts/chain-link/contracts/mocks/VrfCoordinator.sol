// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "@chainlink/contracts/src/v0.8/VRFRequestIDBase.sol";

contract VRFCoordinatorMock is VRFRequestIDBase {
  LinkTokenInterface public LINK;

  event RandomnessRequest(address indexed sender, bytes32 indexed keyHash, uint256 indexed seed);
  event RandomnessRequestId(bytes32 _requestID, address indexed _sender);

  constructor(address linkAddress) {
    LINK = LinkTokenInterface(linkAddress);
  }

  mapping(bytes32 /* provingKey */ => mapping(address /* consumer */ => uint256)) private nonces;

  function onTokenTransfer(address sender, uint256, bytes memory _data) public onlyLINK {
    (bytes32 keyHash, uint256 seed) = abi.decode(_data, (bytes32, uint256));

    emit RandomnessRequest(sender, keyHash, seed);
    uint256 vRFSeed = uint256(keccak256(abi.encode(keyHash, seed, address(sender), nonces[keyHash][sender])));
    bytes32 _requestId = keccak256(abi.encodePacked(keyHash, vRFSeed));

    emit RandomnessRequestId(_requestId, sender);

    nonces[keyHash][sender] = nonces[keyHash][sender] + 1;

    // it doesn't work in the same transaction
    // callBackWithRandomness(_requestId, uint256(keccak256(abi.encode(123))), sender);
  }
  function callBackWithRandomness(bytes32 requestId, uint256 randomness, address consumerContract) public {
    VRFConsumerBase v = VRFConsumerBase(consumerContract);
    bytes memory resp = abi.encodeWithSelector(v.rawFulfillRandomness.selector, requestId, randomness);
    uint256 b = 206000;
    require(gasleft() >= b, "not enough gas for consumer");
    (bool success, ) = consumerContract.call(resp);
    (success);
    // v.rawFulfillRandomness(requestId, randomness);
  }

  modifier onlyLINK() {
    require(msg.sender == address(LINK), "Must use LINK token");
    _;
  }
}

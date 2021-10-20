// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import "@chainlink/contracts/src/v0.8/VRFRequestIDBase.sol";

abstract contract VRFConsumerBaseUpgradable is Initializable, VRFRequestIDBase
{
    using SafeMathUpgradeable for uint256;

    event GotRandomness(bytes32 requestId, uint256 randomness);

    function fulfillRandomness(bytes32 requestId, uint256 randomness)
    internal virtual;

    function requestRandomness(bytes32 _keyHash, uint256 _fee, uint256 _seed)
    internal returns (bytes32 requestId)
    {
        LINK.transferAndCall(vrfCoordinator, _fee, abi.encode(_keyHash, _seed));
        uint256 vRFSeed  = makeVRFInputSeed(_keyHash, _seed, address(this), nonces[_keyHash]);
        nonces[_keyHash] = nonces[_keyHash].add(1);
        return makeRequestId(_keyHash, vRFSeed);
    }

    // removed immutable keyword <--
    LinkTokenInterface internal LINK;
    // removed immutable keyword <--
    address private vrfCoordinator;

    mapping(bytes32 /* keyHash */ => uint256 /* nonce */) private nonces;

    // replaced constructor with initializer <--
    function __VRFConsumerBaseUpgradable_init(address _vrfCoordinator, address _link) internal initializer {
        vrfCoordinator = _vrfCoordinator;
        LINK = LinkTokenInterface(_link);
    }

    function rawFulfillRandomness(bytes32 requestId, uint256 randomness) external {
        emit GotRandomness(requestId, randomness);
        require(msg.sender == vrfCoordinator, "Only VRFCoordinator can fulfill");
        fulfillRandomness(requestId, randomness);
    }

}
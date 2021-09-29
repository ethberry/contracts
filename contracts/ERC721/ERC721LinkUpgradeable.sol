// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import "@chainlink/contracts/src/v0.8/VRFRequestIDBase.sol";

abstract contract ERC721LinkUpgradeable is Initializable, ContextUpgradeable, VRFRequestIDBase {
    using SafeMathUpgradeable for uint256;

    LinkTokenInterface internal LINK;

    address private vrfCoordinator;
    bytes32 internal keyHash;
    uint256 internal fee;
    mapping(bytes32 /* keyHash */ => uint256 /* nonce */) private nonces;

    event Random(uint256 id);

    function __ERC721LinkUpgradeable_init() public initializer {
        __Context_init_unchained();
        __ERC721LinkUpgradeable_init_unchained();
    }

    // MUMBAI
    function __ERC721LinkUpgradeable_init_unchained() public initializer {
        fee = 0.0001 * 10 ** 18;
        vrfCoordinator = 0x8C7382F9D8f56b33781fE506E897a4F1e2d17255;
        LINK = LinkTokenInterface(0x326C977E6efc84E512bB9C30f76E30c160eD06FB);
        keyHash = 0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4;
    }

    function getRandomNumber(uint256 userProvidedSeed) public returns (bytes32 requestId) {
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK - fill contract with faucet");
        return requestRandomness(keyHash, fee, userProvidedSeed);
    }

    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal {
        uint256 d6Result = randomness.mod(6).add(1);
        emit Random(d6Result);
    }

    function requestRandomness(bytes32 _keyHash, uint256 _fee, uint256 _seed) internal returns (bytes32 requestId){
        LINK.transferAndCall(vrfCoordinator, _fee, abi.encode(_keyHash, _seed));
        uint256 vRFSeed  = makeVRFInputSeed(_keyHash, _seed, address(this), nonces[_keyHash]);
        nonces[_keyHash] = nonces[_keyHash].add(1);
        return makeRequestId(_keyHash, vRFSeed);
    }

    function rawFulfillRandomness(bytes32 requestId, uint256 randomness) external {
        require(_msgSender() == vrfCoordinator, "Only VRFCoordinator can fulfill");
        fulfillRandomness(requestId, randomness);
    }


}
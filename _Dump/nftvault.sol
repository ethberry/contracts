 /**
  *Submitted for verification at Etherscan.io on 2021-06-29
 */

 // Sources flattened with hardhat v2.0.11 https://hardhat.org

 // File contracts/solidity/interface/INFTXEligibility.sol

 // SPDX-License-Identifier: MIT

 pragma solidity ^0.8.0;

 interface INFTXEligibility {
     // Read functions.
     function name() external pure returns (string memory);
     function finalized() external view returns (bool);
     function targetAsset() external pure returns (address);
     function checkAllEligible(uint256[] calldata tokenIds)
         external
         view
         returns (bool);
     function checkEligible(uint256[] calldata tokenIds)
         external
         view
         returns (bool[] memory);
     function checkAllIneligible(uint256[] calldata tokenIds)
         external
         view
         returns (bool);
     function checkIsEligible(uint256 tokenId) external view returns (bool);

     // Write functions.
     function __NFTXEligibility_init_bytes(bytes calldata configData) external;
     function beforeMintHook(uint256[] calldata tokenIds) external;
     function afterMintHook(uint256[] calldata tokenIds) external;
     function beforeRedeemHook(uint256[] calldata tokenIds) external;
     function afterRedeemHook(uint256[] calldata tokenIds) external;
 }


 // File contracts/solidity/proxy/IBeacon.sol



 pragma solidity ^0.8.0;

 /**
  * @dev This is the interface that {BeaconProxy} expects of its beacon.
  */
 interface IBeacon {
     /**
      * @dev Must return an address that can be used as a delegate call target.
      *
      * {BeaconProxy} will check that this address is a contract.
      */
     function childImplementation() external view returns (address);
     function upgradeChildTo(address newImplementation) external;
 }


 // File contracts/solidity/interface/INFTXVaultFactory.sol



 pragma solidity ^0.8.0;

 interface INFTXVaultFactory is IBeacon {
   // Read functions.
   function numVaults() external view returns (uint256);
   function zapContract() external view returns (address);
   function feeDistributor() external view returns (address);
   function eligibilityManager() external view returns (address);
   function vault(uint256 vaultId) external view returns (address);
   function vaultsForAsset(address asset) external view returns (address[] memory);
   function isLocked(uint256 id) external view returns (bool);

   event NewFeeDistributor(address oldDistributor, address newDistributor);
   event NewZapContract(address oldZap, address newZap);
   event NewEligibilityManager(address oldEligManager, address newEligManager);
   event NewVault(uint256 indexed vaultId, address vaultAddress, address assetAddress);

   // Write functions.
   function __NFTXVaultFactory_init(address _vaultImpl, address _feeDistributor) external;
   function createVault(
       string calldata name,
       string calldata symbol,
       address _assetAddress,
       bool is1155,
       bool allowAllItems
   ) external returns (uint256);
   function setFeeDistributor(address _feeDistributor) external;
   function setEligibilityManager(address _eligibilityManager) external;
   function setZapContract(address _zapContract) external;
 }


 // File contracts/solidity/interface/INFTXVault.sol



 pragma solidity ^0.8.0;


 interface INFTXVault {
     function manager() external returns (address);
     function assetAddress() external returns (address);
     function vaultFactory() external returns (INFTXVaultFactory);
     function eligibilityStorage() external returns (INFTXEligibility);

     function is1155() external returns (bool);
     function allowAllItems() external returns (bool);
     function enableMint() external returns (bool);
     function enableRandomRedeem() external returns (bool);
     function enableTargetRedeem() external returns (bool);

     function vaultId() external returns (uint256);
     function nftIdAt(uint256 holdingsIndex) external view returns (uint256);
     function mintFee() external returns (uint256);
     function randomRedeemFee() external returns (uint256);
     function targetRedeemFee() external returns (uint256);

     event VaultInit(
         uint256 indexed vaultId,
         address assetAddress,
         bool is1155,
         bool allowAllItems
     );

     event ManagerSet(address manager);
     event EligibilityDeployed(uint256 moduleIndex, address eligibilityAddr);
     // event CustomEligibilityDeployed(address eligibilityAddr);

     event EnableMintUpdated(bool enabled);
     event EnableRandomRedeemUpdated(bool enabled);
     event EnableTargetRedeemUpdated(bool enabled);

     event MintFeeUpdated(uint256 mintFee);
     event RandomRedeemFeeUpdated(uint256 randomRedeemFee);
     event TargetRedeemFeeUpdated(uint256 targetRedeemFee);

     event Minted(uint256[] nftIds, uint256[] amounts, address to);
     event Redeemed(uint256[] nftIds, uint256[] specificIds, address to);
     event Swapped(
         uint256[] nftIds,
         uint256[] amounts,
         uint256[] specificIds,
         uint256[] redeemedIds,
         address to
     );

     function __NFTXVault_init(
         string calldata _name,
         string calldata _symbol,
         address _assetAddress,
         bool _is1155,
         bool _allowAllItems
     ) external;

     function finalizeVault() external;

     function setVaultFeatures(
         bool _enableMint,
         bool _enableRandomRedeem,
         bool _enableTargetRedeem
     ) external;

     function setFees(
         uint256 _mintFee,
         uint256 _randomRedeemFee,
         uint256 _targetRedeemFee
     ) external;

     // This function allows for an easy setup of any eligibility module contract from the EligibilityManager.
     // It takes in ABI encoded parameters for the desired module. This is to make sure they can all follow
     // a similar interface.
     function deployEligibilityStorage(
         uint256 moduleIndex,
         bytes calldata initData
     ) external returns (address);

     // The manager has control over options like fees and features
     function setManager(address _manager) external;

     function mint(
         uint256[] calldata tokenIds,
         uint256[] calldata amounts /* ignored for ERC721 vaults */
     ) external returns (uint256);

     function mintTo(
         uint256[] calldata tokenIds,
         uint256[] calldata amounts, /* ignored for ERC721 vaults */
         address to
     ) external returns (uint256);

     function redeem(uint256 amount, uint256[] calldata specificIds)
         external
         returns (uint256[] calldata);

     function redeemTo(
         uint256 amount,
         uint256[] calldata specificIds,
         address to
     ) external returns (uint256[] calldata);

     function swap(
         uint256[] calldata tokenIds,
         uint256[] calldata amounts, /* ignored for ERC721 vaults */
         uint256[] calldata specificIds
     ) external returns (uint256[] calldata);

     function swapTo(
         uint256[] calldata tokenIds,
         uint256[] calldata amounts, /* ignored for ERC721 vaults */
         uint256[] calldata specificIds,
         address to
     ) external returns (uint256[] calldata);

     function allValidNFTs(uint256[] calldata tokenIds)
         external
         view
         returns (bool);
 }


 // File contracts/solidity/interface/INFTXEligibilityManager.sol



 pragma solidity ^0.8.0;

 interface INFTXEligibilityManager {
     function nftxVaultFactory() external returns (address);
     function eligibilityImpl() external returns (address);

     function deployEligibility(uint256 vaultId, bytes calldata initData)
         external
         returns (address);
 }


 // File contracts/solidity/interface/INFTXFeeDistributor.sol



 pragma solidity ^0.8.0;

 interface INFTXFeeDistributor {

   struct FeeReceiver {
     uint256 allocPoint;
     address receiver;
     bool isContract;
   }

   function nftxVaultFactory() external returns (address);
   function lpStaking() external returns (address);
   function treasury() external returns (address);
   function defaultTreasuryAlloc() external returns (uint256);
   function defaultLPAlloc() external returns (uint256);
   function allocTotal(uint256 vaultId) external returns (uint256);
   function specificTreasuryAlloc(uint256 vaultId) external returns (uint256);

   // Write functions.
   function __FeeDistributor__init__(address _lpStaking, address _treasury) external;
   function rescueTokens(address token) external;
   function distribute(uint256 vaultId) external;
   function addReceiver(uint256 _vaultId, uint256 _allocPoint, address _receiver, bool _isContract) external;
   function initializeVaultReceivers(uint256 _vaultId) external;
   function changeMultipleReceiverAlloc(
     uint256[] memory _vaultIds,
     uint256[] memory _receiverIdxs,
     uint256[] memory allocPoints
   ) external;

   function changeMultipleReceiverAddress(
     uint256[] memory _vaultIds,
     uint256[] memory _receiverIdxs,
     address[] memory addresses,
     bool[] memory isContracts
   ) external;
   function changeReceiverAlloc(uint256 _vaultId, uint256 _idx, uint256 _allocPoint) external;
   function changeReceiverAddress(uint256 _vaultId, uint256 _idx, address _address, bool _isContract) external;
   function removeReceiver(uint256 _vaultId, uint256 _receiverIdx) external;

   // Configuration functions.
   function setTreasuryAddress(address _treasury) external;
   function setDefaultTreasuryAlloc(uint256 _allocPoint) external;
   function setSpecificTreasuryAlloc(uint256 _vaultId, uint256 _allocPoint) external;
   function setLPStakingAddress(address _lpStaking) external;
   function setNFTXVaultFactory(address _factory) external;
   function setDefaultLPAlloc(uint256 _allocPoint) external;
 }


 // File contracts/solidity/interface/IERC165.sol



 pragma solidity ^0.8.0;

 /**
  * @dev Interface of the ERC165 standard, as defined in the
  * https://eips.ethereum.org/EIPS/eip-165[EIP].
  *
  * Implementers can declare support of contract interfaces, which can then be
  * queried by others ({ERC165Checker}).
  *
  * For an implementation, see {ERC165}.
  */
 interface IERC165 {
     /**
      * @dev Returns true if this contract implements the interface defined by
      * `interfaceId`. See the corresponding
      * https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified[EIP section]
      * to learn more about how these ids are created.
      *
      * This function call must use less than 30 000 gas.
      */
     function supportsInterface(bytes4 interfaceId) external view returns (bool);
 }


 // File contracts/solidity/interface/IERC3156.sol



 pragma solidity ^0.8.0;

 /**
  * @dev Interface of the ERC3156 FlashBorrower, as defined in
  * https://eips.ethereum.org/EIPS/eip-3156[ERC-3156].
  */
 interface IERC3156FlashBorrower {
     /**
      * @dev Receive a flash loan.
      * @param initiator The initiator of the loan.
      * @param token The loan currency.
      * @param amount The amount of tokens lent.
      * @param fee The additional amount of tokens to repay.
      * @param data Arbitrary data structure, intended to contain user-defined parameters.
      * @return The keccak256 hash of "ERC3156FlashBorrower.onFlashLoan"
      */
     function onFlashLoan(
         address initiator,
         address token,
         uint256 amount,
         uint256 fee,
         bytes calldata data
     ) external returns (bytes32);
 }

 /**
  * @dev Interface of the ERC3156 FlashLender, as defined in
  * https://eips.ethereum.org/EIPS/eip-3156[ERC-3156].
  */
 interface IERC3156FlashLender {
     /**
      * @dev The amount of currency available to be lended.
      * @param token The loan currency.
      * @return The amount of `token` that can be borrowed.
      */
     function maxFlashLoan(
         address token
     ) external view returns (uint256);

     /**
      * @dev The fee to be charged for a given loan.
      * @param token The loan currency.
      * @param amount The amount of tokens lent.
      * @return The amount of `token` to be charged for the loan, on top of the returned principal.
      */
     function flashFee(
         address token,
         uint256 amount
     ) external view returns (uint256);

     /**
      * @dev Initiate a flash loan.
      * @param receiver The receiver of the tokens in the loan, and the receiver of the callback.
      * @param token The loan currency.
      * @param amount The amount of tokens lent.
      * @param data Arbitrary data structure, intended to contain user-defined parameters.
      */
     function flashLoan(
         IERC3156FlashBorrower receiver,
         address token,
         uint256 amount,
         bytes calldata data
     ) external returns (bool);
  }


 // File contracts/solidity/token/IERC20.sol



 pragma solidity ^0.8.0;

 /**
  * @dev Interface of the ERC20 standard as defined in the EIP.
  */
 interface IERC20 {
     /**
      * @dev Returns the amount of tokens in existence.
      */
     function totalSupply() external view returns (uint256);

     /**
      * @dev Returns the amount of tokens owned by `account`.
      */
     function balanceOf(address account) external view returns (uint256);

     /**
      * @dev Moves `amount` tokens from the caller's account to `recipient`.
      *
      * Returns a boolean value indicating whether the operation succeeded.
      *
      * Emits a {Transfer} event.
      */
     function transfer(address recipient, uint256 amount) external returns (bool);

     /**
      * @dev Returns the remaining number of tokens that `spender` will be
      * allowed to spend on behalf of `owner` through {transferFrom}. This is
      * zero by default.
      *
      * This value changes when {approve} or {transferFrom} are called.
      */
     function allowance(address owner, address spender) external view returns (uint256);

     /**
      * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
      *
      * Returns a boolean value indicating whether the operation succeeded.
      *
      * IMPORTANT: Beware that changing an allowance with this method brings the risk
      * that someone may use both the old and the new allowance by unfortunate
      * transaction ordering. One possible solution to mitigate this race
      * condition is to first reduce the spender's allowance to 0 and set the
      * desired value afterwards:
      * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
      *
      * Emits an {Approval} event.
      */
     function approve(address spender, uint256 amount) external returns (bool);

     /**
      * @dev Moves `amount` tokens from `sender` to `recipient` using the
      * allowance mechanism. `amount` is then deducted from the caller's
      * allowance.
      *
      * Returns a boolean value indicating whether the operation succeeded.
      *
      * Emits a {Transfer} event.
      */
     function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

     /**
      * @dev Emitted when `value` tokens are moved from one account (`from`) to
      * another (`to`).
      *
      * Note that `value` may be zero.
      */
     event Transfer(address indexed from, address indexed to, uint256 value);

     /**
      * @dev Emitted when the allowance of a `spender` for an `owner` is set by
      * a call to {approve}. `value` is the new allowance.
      */
     event Approval(address indexed owner, address indexed spender, uint256 value);
 }


 // File contracts/solidity/token/IERC20Metadata.sol



 pragma solidity ^0.8.0;

 /**
  * @dev Interface for the optional metadata functions from the ERC20 standard.
  *
  * _Available since v4.1._
  */
 interface IERC20Metadata is IERC20 {
     /**
      * @dev Returns the name of the token.
      */
     function name() external view returns (string memory);

     /**
      * @dev Returns the symbol of the token.
      */
     function symbol() external view returns (string memory);

     /**
      * @dev Returns the decimals places of the token.
      */
     function decimals() external view returns (uint8);
 }


 // File contracts/solidity/proxy/Initializable.sol



 // solhint-disable-next-line compiler-version
 pragma solidity ^0.8.0;

 /**
  * @dev This is a base contract to aid in writing  contracts, or any kind of contract that will be deployed
  * behind a proxy. Since a proxied contract can't have a constructor, it's common to move constructor logic to an
  * external initializer function, usually called `initialize`. It then becomes necessary to protect this initializer
  * function so it can only be called once. The {initializer} modifier provided by this contract will have this effect.
  *
  * TIP: To avoid leaving the proxy in an uninitialized state, the initializer function should be called as early as
  * possible by providing the encoded function call as the `_data` argument to {ERC1967Proxy-constructor}.
  *
  * CAUTION: When used with inheritance, manual care must be taken to not invoke a parent initializer twice, or to ensure
  * that all initializers are idempotent. This is not verified automatically as constructors are by Solidity.
  */
 abstract contract Initializable {

     /**
      * @dev Indicates that the contract has been initialized.
      */
     bool private _initialized;

     /**
      * @dev Indicates that the contract is in the process of being initialized.
      */
     bool private _initializing;

     /**
      * @dev Modifier to protect an initializer function from being invoked twice.
      */
     modifier initializer() {
         require(_initializing || !_initialized, "Initializable: contract is already initialized");

         bool isTopLevelCall = !_initializing;
         if (isTopLevelCall) {
             _initializing = true;
             _initialized = true;
         }

         _;

         if (isTopLevelCall) {
             _initializing = false;
         }
     }
 }


 // File contracts/solidity/util/Context.sol



 pragma solidity ^0.8.0;

 /*
  * @dev Provides information about the current execution context, including the
  * sender of the transaction and its data. While these are generally available
  * via msg.sender and msg.data, they should not be accessed in such a direct
  * manner, since when dealing with meta-transactions the account sending and
  * paying for execution may not be the actual sender (as far as an application
  * is concerned).
  *
  * This contract is only required for intermediate, library-like contracts.
  */
 abstract contract Context is Initializable {
     function __Context_init() internal initializer {
         __Context_init_unchained();
     }

     function __Context_init_unchained() internal initializer {
     }
     function _msgSender() internal view virtual returns (address) {
         return msg.sender;
     }

     function _msgData() internal view virtual returns (bytes calldata) {
         this; // silence state mutability warning without generating bytecode - see https://github.com/ethereum/solidity/issues/2691
         return msg.data;
     }
     uint256[50] private __gap;
 }




 // Authors: @0xKiwi_ and @alexgausman.

 contract NFTXVault is
     Ownable,
     ERC20FlashMint,
     ReentrancyGuard,
     ERC721Holder,
     ERC1155Holder,
     INFTXVault
 {
     using EnumerableSet for EnumerableSet.UintSet;

     uint256 constant base = 10**18;

     uint256 public override vaultId;
     address public override manager;
     address public override assetAddress;
     INFTXVaultFactory public override vaultFactory;
     INFTXEligibility public override eligibilityStorage;

     uint256 randNonce;
     uint256 public override mintFee;
     uint256 public override randomRedeemFee;
     uint256 public override targetRedeemFee;

     bool public override is1155;
     bool public override allowAllItems;
     bool public override enableMint;
     bool public override enableRandomRedeem;
     bool public override enableTargetRedeem;

     EnumerableSet.UintSet holdings;
     mapping(uint256 => uint256) quantity1155;

     function __NFTXVault_init(
         string memory _name,
         string memory _symbol,
         address _assetAddress,
         bool _is1155,
         bool _allowAllItems
     ) public override virtual initializer {
         __Ownable_init();
         __ERC20_init(_name, _symbol);
         require(_assetAddress != address(0), "Asset != address(0)");
         assetAddress = _assetAddress;
         vaultFactory = INFTXVaultFactory(msg.sender);
         vaultId = vaultFactory.numVaults();
         is1155 = _is1155;
         allowAllItems = _allowAllItems;
         emit VaultInit(vaultId, _assetAddress, _is1155, _allowAllItems);
         setVaultFeatures(true /*enableMint*/, true /*enableRandomRedeem*/, true /*enableTargetRedeem*/);
         setFees(0.01 ether /*mintFee*/, 0 /*randomRedeemFee*/, 0.05 ether /*targetRedeemFee*/);
     }

     function finalizeVault() external override virtual {
         setManager(address(0));
     }

     function setVaultFeatures(
         bool _enableMint,
         bool _enableRandomRedeem,
         bool _enableTargetRedeem
     ) public override virtual {
         onlyPrivileged();
         enableMint = _enableMint;
         enableRandomRedeem = _enableRandomRedeem;
         enableTargetRedeem = _enableTargetRedeem;

         emit EnableMintUpdated(_enableMint);
         emit EnableRandomRedeemUpdated(_enableRandomRedeem);
         emit EnableTargetRedeemUpdated(_enableTargetRedeem);
     }

     function setFees(
         uint256 _mintFee,
         uint256 _randomRedeemFee,
         uint256 _targetRedeemFee
     ) public override virtual {
         onlyPrivileged();
         require(_mintFee <= base, "Cannot > 1 ether");
         require(_randomRedeemFee <= base, "Cannot > 1 ether");
         require(_targetRedeemFee <= base, "Cannot > 1 ether");
         mintFee = _mintFee;
         randomRedeemFee = _randomRedeemFee;
         targetRedeemFee = _targetRedeemFee;

         emit MintFeeUpdated(_mintFee);
         emit RandomRedeemFeeUpdated(_randomRedeemFee);
         emit TargetRedeemFeeUpdated(_targetRedeemFee);
     }

     // This function allows for an easy setup of any eligibility module contract from the EligibilityManager.
     // It takes in ABI encoded parameters for the desired module. This is to make sure they can all follow
     // a similar interface.
     function deployEligibilityStorage(
         uint256 moduleIndex,
         bytes calldata initData
     ) external override virtual returns (address) {
         onlyPrivileged();
         require(
             address(eligibilityStorage) == address(0),
             "NFTXVault: eligibility already set"
         );
         INFTXEligibilityManager eligManager = INFTXEligibilityManager(
             vaultFactory.eligibilityManager()
         );
         address _eligibility = eligManager.deployEligibility(
             moduleIndex,
             initData
         );
         eligibilityStorage = INFTXEligibility(_eligibility);
         // Toggle this to let the contract know to check eligibility now.
         allowAllItems = false;
         emit EligibilityDeployed(moduleIndex, _eligibility);
         return _eligibility;
     }

     // // This function allows for the manager to set their own arbitrary eligibility contract.
     // // Once eligiblity is set, it cannot be unset or changed.
     // Disabled for launch.
     // function setEligibilityStorage(address _newEligibility) public virtual {
     //     onlyPrivileged();
     //     require(
     //         address(eligibilityStorage) == address(0),
     //         "NFTXVault: eligibility already set"
     //     );
     //     eligibilityStorage = INFTXEligibility(_newEligibility);
     //     // Toggle this to let the contract know to check eligibility now.
     //     allowAllItems = false;
     //     emit CustomEligibilityDeployed(address(_newEligibility));
     // }

     // The manager has control over options like fees and features
     function setManager(address _manager) public override virtual {
         onlyPrivileged();
         manager = _manager;
         emit ManagerSet(_manager);
     }

     function mint(
         uint256[] calldata tokenIds,
         uint256[] calldata amounts /* ignored for ERC721 vaults */
     ) external override virtual returns (uint256) {
         return mintTo(tokenIds, amounts, msg.sender);
     }

     function mintTo(
         uint256[] memory tokenIds,
         uint256[] memory amounts, /* ignored for ERC721 vaults */
         address to
     ) public override virtual nonReentrant returns (uint256) {
         onlyOwnerIfPaused(1);
         require(enableMint, "Minting not enabled");
         // Take the NFTs.
         uint256 count = receiveNFTs(tokenIds, amounts);

         // Mint to the user.
         _mint(to, base * count);
         uint256 totalFee = mintFee * count;
         _chargeAndDistributeFees(totalFee);

         emit Minted(tokenIds, amounts, to);
         return count;
     }

     function redeem(uint256 amount, uint256[] calldata specificIds)
         external
         override
         virtual
         returns (uint256[] memory)
     {
         return redeemTo(amount, specificIds, msg.sender);
     }

     function redeemTo(uint256 amount, uint256[] memory specificIds, address to)
         public
         override
         virtual
         nonReentrant
         returns (uint256[] memory)
     {
         onlyOwnerIfPaused(2);
         require(enableRandomRedeem || enableTargetRedeem, "Redeeming not enabled");

         // We burn all from sender and mint to fee receiver to reduce costs.
         _burn(msg.sender, base * amount);
         // Pay the tokens + toll.
         uint256 totalFee = (targetRedeemFee * specificIds.length) + (
             randomRedeemFee * (amount - specificIds.length)
         );
         _chargeAndDistributeFees(totalFee);

         // Withdraw from vault.
         uint256[] memory redeemedIds = withdrawNFTsTo(amount, specificIds, to);
         emit Redeemed(redeemedIds, specificIds, to);
         return redeemedIds;
     }

     function swap(
         uint256[] calldata tokenIds,
         uint256[] calldata amounts, /* ignored for ERC721 vaults */
         uint256[] calldata specificIds
     ) external override virtual returns (uint256[] memory) {
         return swapTo(tokenIds, amounts, specificIds, msg.sender);
     }

     function swapTo(
         uint256[] memory tokenIds,
         uint256[] memory amounts, /* ignored for ERC721 vaults */
         uint256[] memory specificIds,
         address to
     ) public override virtual nonReentrant returns (uint256[] memory) {
         onlyOwnerIfPaused(3);
         require(enableMint && (enableRandomRedeem || enableTargetRedeem), "NFTXVault: Mint & Redeem enabled");
         // Take the NFTs first, so the user has a chance of rerolling the same.
         // This is intentional so this action mirrors how minting/redeeming manually would work.
         uint256 count = receiveNFTs(tokenIds, amounts);

         // Pay the toll. Mint and Redeem fees here since its a swap.
         // We burn all from sender and mint to fee receiver to reduce costs.
         uint256 redeemFee = (targetRedeemFee * specificIds.length) + (
             randomRedeemFee * (count - specificIds.length)
         );
         uint256 totalFee = (mintFee * count) + redeemFee;
         _chargeAndDistributeFees(totalFee);

         // Withdraw from vault.
         uint256[] memory ids = withdrawNFTsTo(count, specificIds, to);
         emit Swapped(tokenIds, amounts, specificIds, ids, to);
         return ids;
     }

     function flashLoan(
         IERC3156FlashBorrower receiver,
         address token,
         uint256 amount,
         bytes memory data
     ) public override virtual returns (bool) {
         onlyOwnerIfPaused(4);
         return super.flashLoan(receiver, token, amount, data);
     }

     function allValidNFTs(uint256[] memory tokenIds)
         public
         view
         override
         virtual
         returns (bool)
     {
         if (allowAllItems) {
             return true;
         }

         INFTXEligibility _eligibilityStorage = eligibilityStorage;
         if (address(_eligibilityStorage) == address(0)) {
             return false;
         }
         return _eligibilityStorage.checkAllEligible(tokenIds);
     }

     function nftIdAt(uint256 holdingsIndex) external view override virtual returns (uint256) {
         return holdings.at(holdingsIndex);
     }

     // We set a hook to the eligibility module (if it exists) after redeems in case anything needs to be modified.
     function afterRedeemHook(uint256[] memory tokenIds) internal virtual {
         INFTXEligibility _eligibilityStorage = eligibilityStorage;
         if (address(_eligibilityStorage) == address(0)) {
             return;
         }
         _eligibilityStorage.afterRedeemHook(tokenIds);
     }

     function receiveNFTs(uint256[] memory tokenIds, uint256[] memory amounts)
         internal
         virtual
         returns (uint256)
     {
         require(allValidNFTs(tokenIds), "NFTXVault: not eligible");
         if (is1155) {
             // This is technically a check, so placing it before the effect.
             IERC1155(assetAddress).safeBatchTransferFrom(
                 msg.sender,
                 address(this),
                 tokenIds,
                 amounts,
                 ""
             );

             uint256 count;
             for (uint256 i = 0; i < tokenIds.length; i++) {
                 uint256 tokenId = tokenIds[i];
                 uint256 amount = amounts[i];
                 require(amount > 0, "NFTXVault: transferring < 1");
                 if (quantity1155[tokenId] == 0) {
                     holdings.add(tokenId);
                 }
                 quantity1155[tokenId] += amount;
                 count += amount;
             }
             return count;
         } else {
             address _assetAddress = assetAddress;
             for (uint256 i = 0; i < tokenIds.length; i++) {
                 uint256 tokenId = tokenIds[i];
                 transferFromERC721(_assetAddress, tokenId);
                 holdings.add(tokenId);
             }
             return tokenIds.length;
         }
     }

     function withdrawNFTsTo(
         uint256 amount,
         uint256[] memory specificIds,
         address to
     ) internal virtual returns (uint256[] memory) {
         require(
             amount == specificIds.length || enableRandomRedeem,
             "NFTXVault: Random redeem not enabled"
         );
         require(
             specificIds.length == 0 || enableTargetRedeem,
             "NFTXVault: Target redeem not enabled"
         );

         bool _is1155 = is1155;
         address _assetAddress = assetAddress;
         uint256[] memory redeemedIds = new uint256[](amount);
         for (uint256 i = 0; i < amount; i++) {
             // This will always be fine considering the validations made above.
             uint256 tokenId = i < specificIds.length ?
                 specificIds[i] : getRandomTokenIdFromVault();
             redeemedIds[i] = tokenId;

             if (_is1155) {
                 quantity1155[tokenId] -= 1;
                 if (quantity1155[tokenId] == 0) {
                     holdings.remove(tokenId);
                 }

                 IERC1155(_assetAddress).safeTransferFrom(
                     address(this),
                     to,
                     tokenId,
                     1,
                     ""
                 );
             } else {
                 holdings.remove(tokenId);
                 transferERC721(_assetAddress, to, tokenId);
             }
         }
         afterRedeemHook(redeemedIds);
         return redeemedIds;
     }

     function _chargeAndDistributeFees(uint256 amount) internal virtual {
         // Mint fees directly to the distributor and distribute.
         if (amount > 0) {
             _burn(msg.sender, amount);
             address feeDistributor = vaultFactory.feeDistributor();
             _mint(feeDistributor, amount);
             INFTXFeeDistributor(feeDistributor).distribute(vaultId);
         }
     }

     function transferERC721(address assetAddr, address to, uint256 tokenId) internal virtual {
         address kitties = 0x06012c8cf97BEaD5deAe237070F9587f8E7A266d;
         address punks = 0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB;
         bytes memory data;
         if (assetAddr == kitties) {
             data = abi.encodeWithSignature("transferFrom(address,address,uint256)", address(this), to, tokenId);
         } else if (assetAddr == punks) {
             // CryptoPunks.
             data = abi.encodeWithSignature("transferPunk(address,uint256)", to, tokenId);
         } else {
             // Default.
             data = abi.encodeWithSignature("safeTransferFrom(address,address,uint256)", address(this), to, tokenId);
         }
         (bool success,) = address(assetAddr).call(data);
         require(success);
     }

     function transferFromERC721(address assetAddr, uint256 tokenId) internal virtual {
         address kitties = 0x06012c8cf97BEaD5deAe237070F9587f8E7A266d;
         address punks = 0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB;
         bytes memory data;
         if (assetAddr == kitties) {
             // Cryptokitties.
             data = abi.encodeWithSignature("transferFrom(address,address,uint256)", msg.sender, address(this), tokenId);
         } else if (assetAddr == punks) {
             // CryptoPunks.
             bytes memory punkIndexToAddress = abi.encodeWithSignature("punkIndexToAddress(uint256)", tokenId);
             (bool checkSuccess, bytes memory result) = address(assetAddr).staticcall(punkIndexToAddress);
             (address owner) = abi.decode(result, (address));
             require(checkSuccess && owner == msg.sender, "Not the owner");
             data = abi.encodeWithSignature("buyPunk(uint256)", tokenId);
         } else {
             // Default.
             data = abi.encodeWithSignature("safeTransferFrom(address,address,uint256)", msg.sender, address(this), tokenId);
         }
         (bool success, bytes memory resultData) = address(assetAddr).call(data);
         require(success, string(resultData));
     }

     function getRandomTokenIdFromVault() internal virtual returns (uint256) {
         uint256 randomIndex = uint256(
             keccak256(
                 abi.encodePacked(
                     blockhash(block.number - 1),
                     randNonce,
                     block.coinbase,
                     block.difficulty,
                     block.timestamp
                 )
             )
         ) % holdings.length();
         randNonce += 1;
         return holdings.at(randomIndex);
     }

     function onlyPrivileged() internal view {
         if (manager == address(0)) {
             require(msg.sender == owner(), "Not owner");
         } else {
             require(msg.sender == manager, "Not manager");
         }
     }

     function onlyOwnerIfPaused(uint256 lockId) internal view {
         require(!vaultFactory.isLocked(lockId) || msg.sender == owner(), "Paused");
     }
 }
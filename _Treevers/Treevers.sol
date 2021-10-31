contract Treeverse is ERC721Enumerable, Ownable {

    using Strings for uint256;

    struct Collection {
        uint128 tokenPriceInWei;
        uint32 tokensMinted;
        uint32 maxTokensAvailable;
        uint32 collectionNumber;
        bool created;
        bool locked;
        bool active;
        string name;
        string description;
        string baseURI;
    }

    mapping(uint256 => Collection) public collections;

    uint256 constant ONE_MILLION = 1_000_000;
    uint256 public nextCollectionNumber = 1;
    string public customURI;

    constructor(string memory _customURI) ERC721("Treeverse", "TRV"){
        customURI = _customURI;
    }

    modifier ifCollectionExists(uint256 _collectionNumber) {
        require(collections[_collectionNumber].created, "Collection has not been created yet");
        _;
    }

    modifier ifCollectionActive(uint256 _collectionNumber) {
        require(collections[_collectionNumber].active, "The collection is not active");
        _;
    }

    modifier ifCollectionNotLocked(uint256 _collectionNumber){
        require(!collections[_collectionNumber].locked, "The collection is locked");
        _;
    }

    function withdraw() public onlyOwner {
        uint balance = address(this).balance;
        payable(msg.sender).transfer(balance);
    }

    function createCollection(
        string memory _name,
        string memory _description,
        string memory _collectionBaseURI,
        uint128 _tokenPriceInWei,
        uint32 _maxTokensAvailable,
        uint32 _collectionNumber
    ) public onlyOwner
    {

        require(!collections[_collectionNumber].created, "A collection with this collection number already exists");
        require(_maxTokensAvailable < ONE_MILLION, "The maximum number of tokens available per collection must be less than 1 million");
        require(_collectionNumber == nextCollectionNumber, "You are trying to create a collection that doesn't match the nextCollectionNumber");
        Collection memory newCollection = Collection({
        name: _name,
        description: _description,
        baseURI: _collectionBaseURI,
        tokenPriceInWei: _tokenPriceInWei,
        maxTokensAvailable: _maxTokensAvailable,
        collectionNumber: _collectionNumber,
        created: true,
        locked: false,
        active: false,
        tokensMinted: 0
        });
        collections[nextCollectionNumber++] = newCollection;
    }

    function changeName(uint256 _collectionNumber, string memory _name) public onlyOwner ifCollectionExists(_collectionNumber) ifCollectionNotLocked(_collectionNumber)  {
        collections[_collectionNumber].name = _name;
    }

    function changeDescription(uint256 _collectionNumber, string memory _description) public onlyOwner ifCollectionExists(_collectionNumber) ifCollectionNotLocked(_collectionNumber) {
        collections[_collectionNumber].description = _description;
    }

    function changeBaseURI(uint256 _collectionNumber, string memory _collectionBaseURI) public onlyOwner ifCollectionExists(_collectionNumber)  ifCollectionNotLocked(_collectionNumber){
        collections[_collectionNumber].baseURI = _collectionBaseURI;
    }

    function changeTokenPriceInWei(uint256 _collectionNumber, uint128 _tokenPriceInWei) public onlyOwner ifCollectionExists(_collectionNumber) ifCollectionNotLocked(_collectionNumber) {
        collections[_collectionNumber].tokenPriceInWei = _tokenPriceInWei;
    }

    function changeMaxTokensAvailable(uint256 _collectionNumber, uint32 _maxTokensAvailable) public onlyOwner ifCollectionExists(_collectionNumber) ifCollectionNotLocked(_collectionNumber) {
        collections[_collectionNumber].maxTokensAvailable = _maxTokensAvailable;
    }

    function lockCollection(uint256 _collectionNumber) public onlyOwner ifCollectionExists(_collectionNumber) ifCollectionNotLocked(_collectionNumber) {
        collections[_collectionNumber].locked = true;
    }

    function toggleActive(uint256 _collectionNumber) public onlyOwner ifCollectionExists(_collectionNumber) ifCollectionNotLocked(_collectionNumber) {
        collections[_collectionNumber].active = !collections[_collectionNumber].active;
    }

    function purchaseNft(uint256 _collectionNumber, uint256 _quantity)
    public
    payable
    ifCollectionExists(_collectionNumber)
    ifCollectionActive(_collectionNumber)
    ifCollectionNotLocked(_collectionNumber)
    {
        require(_quantity > 0 ,  "Number of tokens to purchase must be greater than 0");
        Collection storage collection = collections[_collectionNumber];

        require(collection.tokensMinted + _quantity <= collection.maxTokensAvailable, "This transaction would exceed the maximum number of tokens in this collection");
        require(msg.value == _quantity * collection.tokenPriceInWei, "You did not send the correct amount of ether");
        for(uint256 i=0; i< _quantity; i++){
            _mintNft(msg.sender, _collectionNumber);
        }
    }

    function devMint(uint256 _collectionNumber, address _to, uint256 _quantity)
    public
    onlyOwner
    ifCollectionExists(_collectionNumber)
    ifCollectionNotLocked(_collectionNumber)
    {
        require(_quantity > 0 ,  "Number of tokens to mint must be greater than 0");
        Collection storage collection = collections[_collectionNumber];
        require(collection.tokensMinted + _quantity <= collection.maxTokensAvailable, "This transaction would exceed the maximum number of tokens in this collection");
        for(uint256 i=0; i< _quantity; i++){
            _mintNft(_to, _collectionNumber);
        }
    }

    function _mintNft(address _to, uint256 _collectionNumber) internal{
        uint256 tokenIdToMint = (_collectionNumber * ONE_MILLION) + (++collections[_collectionNumber].tokensMinted);
        _safeMint(_to, tokenIdToMint);
    }

    function tokenURI(uint256 _tokenId) public view override returns (string memory) {
        require(_exists(_tokenId), "ERC721Metadata: URI query for nonexistent token");
        string memory baseURI = collections[_tokenId/ONE_MILLION].baseURI;
        return bytes(baseURI).length > 0
        ? string(abi.encodePacked(baseURI, _tokenId.toString()))
        : '';
    }

    function changeCustomURI(string memory _newUri) public onlyOwner {
        customURI = _newUri;
    }

    function customTokenURI(uint256 _tokenId) public view returns (string memory){
        require(_exists(_tokenId), "ERC721Metadata: URI query for nonexistent token");
        return bytes(customURI).length > 0
        ? string(abi.encodePacked(customURI, _tokenId.toString()))
        : '';
    }

    function getOwnedTokenIds(address _owner) public view returns(uint256[] memory tokenIds) {
        uint256 balanceOfOwner = balanceOf(_owner);

        tokenIds = new uint256[](balanceOfOwner);

        for(uint256 index = 0; index < balanceOfOwner; index++){
            tokenIds[index] = tokenOfOwnerByIndex(_owner, index);
        }
    }

    function getTokenIdsInCollection(uint256 _collectionNumber) public view returns(uint256[] memory tokenIds) {

        Collection storage collection = collections[_collectionNumber];
        require(collection.created, "Collection does not exist");

        uint256 totalMinted = collection.tokensMinted;

        tokenIds = new uint256[](totalMinted);

        for(uint256 index=0; index < totalMinted; index++){
            tokenIds[index] = (_collectionNumber * ONE_MILLION) + index + 1;
        }
    }
}
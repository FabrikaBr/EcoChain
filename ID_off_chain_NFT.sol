// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract BioGerminaNFT is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    struct UserIdentity {
        string encryptedID;
        uint256 joinDate;
        uint256 activityCount;
    }
    
    struct ActivityRecord {
        uint256 userId;
        string activityType; // "tree_registration", "seed_collection", "planting"
        uint256 timestamp;
        string locationHash;
        string photoIPFS;
    }
    
    mapping(uint256 => UserIdentity) public userIdentities;
    mapping(uint256 => ActivityRecord) public activityRecords;
    mapping(string => uint256) public userIdToToken; // Mapeamento de ID off-chain para NFT
    
    address private admin;
    
    constructor() ERC721("BioGerminaUser", "BGU") {
        admin = msg.sender;
    }
    
    // Cria NFT de identidade para novo usuário
    function mintUserIdentity(string memory encryptedID) public returns (uint256) {
        require(bytes(encryptedID).length > 0, "Invalid ID");
        
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        _mint(msg.sender, newTokenId);
        
        userIdentities[newTokenId] = UserIdentity({
            encryptedID: encryptedID,
            joinDate: block.timestamp,
            activityCount: 0
        });
        
        return newTokenId;
    }
    
    // Registra uma nova atividade no blockchain
    function recordActivity(
        uint256 userId,
        string memory activityType,
        string memory locationHash,
        string memory photoIPFS
    ) public returns (uint256) {
        require(_exists(userId), "User does not exist");
        
        uint256 activityId = userIdentities[userId].activityCount + 1;
        string memory compositeId = string(abi.encodePacked(
            Strings.toString(userId), 
            "-", 
            Strings.toString(activityId)
        ));
        
        activityRecords[activityId] = ActivityRecord({
            userId: userId,
            activityType: activityType,
            timestamp: block.timestamp,
            locationHash: locationHash,
            photoIPFS: photoIPFS
        });
        
        userIdentities[userId].activityCount++;
        
        return activityId;
    }
    
    // Função para associar ID off-chain com NFT
    function linkUserId(string memory userId, uint256 tokenId) public {
        require(msg.sender == admin, "Only admin");
        userIdToToken[userId] = tokenId;
    }
}
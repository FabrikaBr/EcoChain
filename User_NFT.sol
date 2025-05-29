// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract UserNFT is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Mapeamento: userID (off-chain) -> tokenID
    mapping(string => uint256) public userIdToTokenId;

    // Evento emitido quando um novo NFT de usuário é criado
    event UserNFTCreated(string indexed userId, uint256 tokenId);

    constructor() ERC721("BioGerminaUser", "BGUSER") {}

    function mintUserNFT(string memory userId) public returns (uint256) {
        require(userIdToTokenId[userId] == 0, "User already has NFT");
        
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        _mint(msg.sender, newTokenId);
        userIdToTokenId[userId] = newTokenId;
        
        emit UserNFTCreated(userId, newTokenId);
        return newTokenId;
    }
}
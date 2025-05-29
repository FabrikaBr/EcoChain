// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ActivityNFT is ERC1155 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Estrutura da atividade
    struct Activity {
        string activityId;  // ID off-chain
        string activityType; // "tree_registration", "seed_collection"
        uint256 timestamp;
    }

    // Mapeamento: tokenID -> Activity
    mapping(uint256 => Activity) public activities;

    // Evento emitido quando uma nova atividade é registrada
    event ActivityRecorded(
        string indexed activityId,
        string activityType,
        uint256 tokenId
    );

    constructor() ERC1155("https://biogermina.app/api/activity/{id}.json") {}

    function recordActivity(
        string memory activityId,
        string memory activityType,
        uint256 timestamp
    ) public returns (uint256) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        activities[newTokenId] = Activity(activityId, activityType, timestamp);
        
        // Mint de 1 unidade do NFT para o chamador
        _mint(msg.sender, newTokenId, 1, "");
        
        emit ActivityRecorded(activityId, activityType, newTokenId);
        return newTokenId;
    }
}
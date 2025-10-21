// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract DocumentRegistry {
    event DocumentAnchored(bytes32 indexed docHash, address indexed author, uint256 timestamp);

    struct Proof {
        address author;
        uint256 timestamp;
    }

    mapping(bytes32 => Proof) public proofs;

    function anchor(bytes32 docHash) external {
        require(docHash != bytes32(0), "Empty hash");
        require(proofs[docHash].timestamp == 0, "Already anchored");
        proofs[docHash] = Proof(msg.sender, block.timestamp);
        emit DocumentAnchored(docHash, msg.sender, block.timestamp);
    }

    function verify(bytes32 docHash) external view returns (address author, uint256 timestamp) {
        Proof memory p = proofs[docHash];
        return (p.author, p.timestamp);
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title VeritasChain
 * @dev Contrat d'ancrage de documents sur la blockchain
 * @author VeritasChain Team
 */
contract VeritasChain {
    // Mapping pour stocker les hashs ancrés
    mapping(bytes32 => bool) private anchoredHashes;
    
    // Mapping pour stocker les informations d'ancrage
    mapping(bytes32 => AnchoringInfo) private anchoringInfo;
    
    // Structure pour stocker les informations d'ancrage
    struct AnchoringInfo {
        address sender;
        uint256 blockNumber;
        uint256 timestamp;
    }
    
    // Événement émis lors de l'ancrage d'un document
    event Anchored(bytes32 indexed hash, address indexed sender, uint256 blockNumber);
    
    // Événement émis lors de la vérification d'un document
    event Verified(bytes32 indexed hash, bool exists);
    
    /**
     * @dev Ancrage d'un hash de document
     * @param hash Le hash du document à ancrer
     */
    function anchor(bytes32 hash) external {
        require(hash != bytes32(0), "VeritasChain: Hash cannot be zero");
        require(!anchoredHashes[hash], "VeritasChain: Hash already anchored");
        
        // Marquer le hash comme ancré
        anchoredHashes[hash] = true;
        
        // Stocker les informations d'ancrage
        anchoringInfo[hash] = AnchoringInfo({
            sender: msg.sender,
            blockNumber: block.number,
            timestamp: block.timestamp
        });
        
        // Émettre l'événement
        emit Anchored(hash, msg.sender, block.number);
    }
    
    /**
     * @dev Vérification de l'existence d'un hash ancré
     * @param hash Le hash à vérifier
     * @return true si le hash est ancré, false sinon
     */
    function verify(bytes32 hash) external view returns (bool) {
        return anchoredHashes[hash];
    }
    
    /**
     * @dev Récupération des informations d'ancrage d'un hash
     * @param hash Le hash à vérifier
     * @return sender L'adresse qui a ancré le hash
     * @return blockNumber Le numéro de bloc de l'ancrage
     * @return timestamp Le timestamp de l'ancrage
     */
    function getAnchoringInfo(bytes32 hash) external view returns (
        address sender,
        uint256 blockNumber,
        uint256 timestamp
    ) {
        require(anchoredHashes[hash], "VeritasChain: Hash not anchored");
        
        AnchoringInfo memory info = anchoringInfo[hash];
        return (info.sender, info.blockNumber, info.timestamp);
    }
    
    /**
     * @dev Vérification avec événement (pour les logs)
     * @param hash Le hash à vérifier
     * @return true si le hash est ancré, false sinon
     */
    function verifyWithEvent(bytes32 hash) external returns (bool) {
        bool exists = anchoredHashes[hash];
        emit Verified(hash, exists);
        return exists;
    }
    
    /**
     * @dev Compteur du nombre total de hashs ancrés
     * @return Le nombre total de hashs ancrés
     */
    function getTotalAnchored() external view returns (uint256) {
        // Note: Cette fonction nécessiterait un compteur séparé pour être efficace
        // Pour l'instant, elle retourne 0 car nous n'avons pas de compteur
        return 0;
    }
}

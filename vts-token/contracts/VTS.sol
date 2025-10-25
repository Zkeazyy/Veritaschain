// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title Veritas Token (VTS)
 * @dev ERC-20 token with fixed supply for VeritasChain ecosystem
 * @author VeritasChain Team
 */
contract VTS is ERC20 {
    // Fixed supply: 1,000,000 VTS tokens
    uint256 public constant TOTAL_SUPPLY = 1_000_000 * 10**18;
    
    /**
     * @dev Constructor that mints the total supply to the deployer
     */
    constructor() ERC20("Veritas Token", "VTS") {
        _mint(msg.sender, TOTAL_SUPPLY);
    }
    
    /**
     * @dev Returns the number of decimals used to get its user representation
     * @return The number of decimals (18)
     */
    function decimals() public pure override returns (uint8) {
        return 18;
    }
    
    /**
     * @dev Returns the total supply of tokens
     * @return The total supply (1,000,000 VTS)
     */
    function totalSupply() public pure override returns (uint256) {
        return TOTAL_SUPPLY;
    }
}

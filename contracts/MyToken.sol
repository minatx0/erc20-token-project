// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title MyToken
 * @dev Implementation of an ERC20 token with additional features like minting, burning, and pausing.
 */
contract MyToken {
    // State variables
    string public name = "MyToken";
    string public symbol = "MTK";
    uint8 public decimals = 18;
    uint256 private totalSupply_;

    address public owner;
    bool public isTransferPaused = false;

    mapping(address => uint256) private balances;
    mapping(address => mapping(address => uint256)) private allowed;
    mapping(address => bool) public minters; 
    mapping(address => mapping(address => uint256)) public delegatedBalances; 

    // Events
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event Paused();
    event Resumed();
    event MinterAuthorized(address indexed minter); 
    event MinterRevoked(address indexed minter); 
    event Burned(address indexed from, uint256 value);
    event Delegation(address indexed from, address indexed to, uint256 value); 

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier whenNotPaused() {
        require(!isTransferPaused, "Transfers paused");
        _;
    }

    modifier canMint() {
        require(minters[msg.sender], "Not authorized to mint");
        _;
    }

    // Constructor
    constructor(uint256 initialSupply) {
        owner = msg.sender;
        totalSupply_ = initialSupply * 10**uint256(decimals);
        balances[msg.sender] = totalSupply_;
        minters[msg.sender] = true;
    }

    // Functions
    function getTotalSupply() external view returns (uint256) {
        return totalSupply_;
    }

    function getBalance(address account) external view returns (uint256) {
        return balances[account];
    }

    function transfer(address to, uint256 amount) external whenNotPaused returns (bool) {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        
        balances[msg.sender] -= amount;
        balances[to] += amount;
        
        emit Transfer(msg.sender, to, amount);
        return true;
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external whenNotPaused returns (bool) {
        require(amount <= balances[from], "Insufficient balance");
        require(amount <= allowed[from][msg.sender], "Not authorized");
        
        balances[from] -= amount;
        balances[to] += amount;
        allowed[from][msg.sender] -= amount;
        
        emit Transfer(from, to, amount);
        return true;
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        allowed[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function getAllowance(address tokenOwner, address spender) external view returns (uint256) {
        return allowed[tokenOwner][spender];
    }

    function mint(address to, uint256 amount) external canMint returns (bool) {
        totalSupply_ += amount;
        balances[to] += amount;
        emit Transfer(address(0), to, amount);
        return true;
    }

    function burn(uint256 amount) external returns (bool) {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        
        totalSupply_ -= amount;
        balances[msg.sender] -= amount;
        
        emit Burned(msg.sender, amount);
        emit Transfer(msg.sender, address(0), amount);
        return true;
    }

    function pauseTransfers() external onlyOwner {
        isTransferPaused = true;
        emit Paused();
    }

    function resumeTransfers() external onlyOwner {
        isTransferPaused = false;
        emit Resumed();
    }

    function authorizeMinter(address minter) external onlyOwner {
        minters[minter] = true;
        emit MinterAuthorized(minter);
    }

    function revokeMinter(address minter) external onlyOwner {
        minters[minter] = false;
        emit MinterRevoked(minter);
    }

    function delegate(address to, uint256 amount) external returns (bool) {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        require(to != address(0), "Invalid delegatee");
        
        balances[msg.sender] -= amount;
        delegatedBalances[msg.sender][to] += amount;
        
        emit Delegation(msg.sender, to, amount);
        return true;
    }

    function getDelegatedBalance(address owner, address delegatee) external view returns (uint256) {
        return delegatedBalances[owner][delegatee];
    }
}
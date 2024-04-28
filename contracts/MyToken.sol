pragma solidity ^0.8.0;

contract MyToken {
    string public tokenName = "MyToken";
    string public tokenSymbol = "MTK";
    uint8 public decimalUnits = 18;
    uint256 private totalTokenSupply;

    address public contractOwner;
    bool public isPaused = false;

    mapping(address => uint256) private addressToBalance;
    mapping(address => mapping(address => uint256)) private allowances;
    mapping(address => bool) public authorizedMinters;

    event TokenTransfer(address indexed from, address indexed to, uint256 value);
    event ApprovalGranted(address indexed tokenOwner, address indexed spender, uint256 value);
    event TransferPaused();
    event TransferResumed();
    event MinterAdded(address indexed minterAddress);
    event MinterRemoved(address indexed minterAddress);
    event TokenBurned(address indexed tokenHolder, uint256 value);

    modifier onlyContractOwner() {
        require(msg.sender == contractOwner, "Not owner");
        _;
    }

    modifier whenNotPaused() {
        require(!isPaused, "Contract is paused");
        _;
    }

    modifier hasMintPermission() {
        require(authorizedMinters[msg.sender], "Cannot mint");
        _;
    }

    constructor(uint256 initialSupply) {
        contractOwner = msg.sender;
        totalTokenSupply = initialSupply * 10**uint256(decimalUnits);
        addressToBalance[msg.sender] = totalTokenSupply;
        authorizedMinters[msg.sender] = true;
    }

    function getTotalSupply() external view returns (uint256) {
        return totalTokenSupply;
    }

    function getBalance(address userDetails) external view returns (uint256 balance) {
        return addressToBalance[userDetails];
    }

    function transferTokens(address recipient, uint256 amount) external whenNotPaused returns (bool success) {
        require(addressToBalance[msg.sender] >= amount, "Insufficient balance");
        addressToBalance[msg.sender] -= amount;
        addressToBalance[recipient] += amount;
        emit TokenTransfer(msg.sender, recipient, amount);
        return true;
    }

    function transferFrom(address sender, address recipient, uint256 amount) external whenNotPaused returns (bool success) {
        require(amount <= addressToBalance[sender], "Insufficient balance");
        require(amount <= allowances[sender][msg.sender], "Not authorized");
        
        addressToBalance[sender] -= amount;
        addressToBalance[recipient] += amount;
        allowances[sender][msg.sender] -= amount;
        
        emit TokenTransfer(sender, recipient, amount);
        return true;
    }

    function approveSpender(address spender, uint256 amount) external returns (bool success) {
        allowances[msg.sender][spender] = amount;
        emit ApprovalGranted(msg.sender, spender, amount);
        return true;
    }

    function getAllowance(address owner, address spender) external view returns (uint256 remaining) {
        return allowances[owner][spender];
    }

    function mintTokens(address recipient, uint256 amount) external hasMintPermission returns (bool) {
        totalTokenSupply += amount;
        addressToBalance[recipient] += amount;
        emit TokenTransfer(address(0), recipient, amount);
        return true;
    }

    function burnTokens(uint256 amount) external returns (bool) {
        require(addressToBalance[msg.sender] >= amount, "Insufficient balance");
        totalTokenSupply -= amount;
        addressToBalance[msg.sender] -= amount;
        emit TokenBurned(msg.sender, amount);
        emit TokenTransfer(msg.sender, address(0), amount);
        return true;
    }

    function pauseTransfers() external onlyContractOwner {
        isPaused = true;
        emit TransferPaused();
    }

    function resumeTransfers() external onlyContractOwner {
        isPaused = false;
        emit TransferResumed();
    }

    function authorizeMinter(address minterAddress) external onlyContractOwner {
        authorizedMinters[minterAddress] = true;
        emit MinterAdded(minterAddress);
    }

    function revokeMinter(address minterAddress) external onlyContractOwner {
        authorizedMinters[minterAddress] = false;
        emit MinterRemoved(minterAddress);
    }
}
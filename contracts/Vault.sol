// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract Vault is AccessControl {

    event Deposit(address indexed sender, uint amount, uint balance);
    event SubmitTransaction(address indexed owner, uint indexed txIndex, address indexed to, uint value, bytes data);
    event ConfirmTransaction(address indexed owner, uint indexed txIndex);
    event RevokeConfirmation(address indexed owner, uint indexed txIndex);
    event ExecuteTransaction(address indexed owner, uint indexed txIndex);
    event ApprovedTransaction(address indexed governanceAddress, uint indexed txIndex);

    bytes32 public constant CUSTODIAN_ROLE = keccak256("VAULT_CUSTODIAN");
    bytes32 public constant GOVERNANCE_ROLE = keccak256("VAULT_GOVERNANCE");

    address[] public custodians;
    
    uint public numConfirmationsRequired;
    IERC20 public tokenAddress;
    address public governanceAddress;

    struct Transaction {
        address to;
        uint value;
        bytes data;
        bool executed;
        uint numConfirmatons;
    }

    // mapping from tx index => owner => bool
    mapping(uint => mapping(address => bool)) public isConfirmed;
    // mapping from tx index => governanceContract => bool
    mapping(uint => mapping(address => bool)) public isApproved;

    Transaction[] public transactions;

    modifier onlyCustodian() {
        require(hasRole(CUSTODIAN_ROLE, msg.sender), "not custodian");
        _;
    }

    modifier txExists(uint _txIndex) {
        require(_txIndex < transactions.length, "tx does not exist");
        _;
    }

    modifier notApproved(uint _txIndex) {
        require(!isApproved[_txIndex][governanceAddress], "tx approved by governance");
        _;
    }

    modifier approvedTransaction(uint _txIndex) {
        require(isApproved[_txIndex][governanceAddress], "tx not approved");
        _;
    }

    modifier notExecuted(uint _txIndex) {
        require(!transactions[_txIndex].executed, "tx already executed");
        _;
    }
    modifier onlyGovernance() {
        require(hasRole(GOVERNANCE_ROLE, msg.sender), "not governance contract");
        _;
    }
    modifier notConfirmed(uint _txIndex) {
        require(!isConfirmed[_txIndex][msg.sender], "tx already confirmed");
        _;
    }

    constructor(address _tokenAddress, address[] memory _custodians, uint _numConfirmationsRequired, address _governanceContract) {
        require(_custodians.length > 0, "custodians required");
        require(_numConfirmationsRequired > 0 && _numConfirmationsRequired <= _custodians.length, "invalid number of required confirmations");
        require(_tokenAddress != address(0), "blackhole token address");

        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);

        for (uint i = 0; i < _custodians.length; i++) {
            address owner = _custodians[i];

            require(owner != address(0), "invalid owner");

            grantRole(CUSTODIAN_ROLE, owner);
            custodians.push(owner);
        }
        numConfirmationsRequired = _numConfirmationsRequired;
        governanceAddress = _governanceContract;
        tokenAddress = IERC20(_tokenAddress);
    }

    receive() external payable {
        emit Deposit(msg.sender, msg.value, address(this).balance);
    }

    function submitTransaction(address _to, uint _txIndex, uint _value, bytes memory _data) onlyCustodian public {
        require(isApproved[_txIndex][governanceAddress], "transaction not approved by governance");
        
        transactions.push(Transaction({
            to: _to,
            value: _value,
            data: _data,
            executed: false,
            numConfirmatons: 0
        }));

        emit SubmitTransaction(msg.sender, _txIndex, _to, _value, _data);
    }

    function confirmTransaction(uint _txIndex) public onlyCustodian txExists(_txIndex) notExecuted(_txIndex) notConfirmed(_txIndex) {
        require(isApproved[_txIndex][governanceAddress], "transaction not approved by governance");

        Transaction storage transaction = transactions[_txIndex];
        transaction.numConfirmatons += 1;
        isConfirmed[_txIndex][msg.sender] = true;

        emit ConfirmTransaction(msg.sender, _txIndex);
    }

    function approveTransaction(uint _txIndex) public onlyGovernance()  notApproved(_txIndex) {
        isApproved[_txIndex][msg.sender] = true;
        emit ApprovedTransaction(msg.sender, _txIndex);
    }

    function executeTransaction(uint _txIndex) public onlyCustodian txExists(_txIndex) notExecuted(_txIndex) {
        Transaction storage transaction = transactions[_txIndex];
        require(transaction.numConfirmatons >= numConfirmationsRequired, "cannot execute tx");
        require(isApproved[_txIndex][governanceAddress], "transaction not approved by DAO");
        require(transaction.value <= tokenAddress.balanceOf(address(this)), "amount execceds the available balance");
        
        transaction.executed = true;

        bool success = tokenAddress.transfer(transaction.to, transaction.value);
        require(success, "tx failed");

        isApproved[_txIndex][governanceAddress] = false;

        emit ExecuteTransaction(msg.sender, _txIndex);
    }

    function revokeConfimration(uint _txIndex) public onlyCustodian txExists(_txIndex) notExecuted(_txIndex) {
        require(isConfirmed[_txIndex][msg.sender], "tx not confirmed");
        require(isApproved[_txIndex][governanceAddress], "transaction not approved");

        Transaction storage transaction = transactions[_txIndex];

        transaction.numConfirmatons -= 1;
        isConfirmed[_txIndex][msg.sender] = false;

        emit RevokeConfirmation(msg.sender, _txIndex);
    }

    function getCustodians() public view returns (address[] memory) {
        return custodians;
    }

    function getTransactonCount() public view returns (uint) {
        return transactions.length;
    }

    function getTransaction(uint _txIndex) public view returns (address to, uint value, bytes memory data, bool executed, uint numConfirmations) {
        Transaction storage transaction = transactions[_txIndex];
        return (transaction.to, transaction.value, transaction.data, transaction.executed, transaction.numConfirmatons);
    }
}
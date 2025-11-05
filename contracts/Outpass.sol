
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Outpass {
    address public owner;

    enum OutpassStatus { Pending, Approved, Rejected, Cancelled, Expired, Used }

    struct EmergencyContact {
        string name;
        string phone;
    }

    struct OutpassData {
        uint id;
        address student;
        string reason;
        string destination;
        uint256 outDate;
        uint256 expectedReturnDate;
        OutpassStatus status;
        EmergencyContact emergencyContact;
    }

    mapping(uint => OutpassData) public outpasses;
    mapping(address => uint[]) public studentOutpasses;
    uint public outpassCount;

    event OutpassRequested(uint id, address student);
    event OutpassStatusChanged(uint id, OutpassStatus status);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function requestOutpass(
        string memory _reason,
        string memory _destination,
        uint256 _outDate,
        uint256 _expectedReturnDate,
        string memory _emergencyName,
        string memory _emergencyPhone
    ) public {
        outpassCount++;
        outpasses[outpassCount] = OutpassData(
            outpassCount,
            msg.sender,
            _reason,
            _destination,
            _outDate,
            _expectedReturnDate,
            OutpassStatus.Pending,
            EmergencyContact(_emergencyName, _emergencyPhone)
        );
        studentOutpasses[msg.sender].push(outpassCount);
        emit OutpassRequested(outpassCount, msg.sender);
    }

    function generateDayOutpass(
        string memory _purpose,
        string memory _destination,
        uint256 _fromTime,
        uint256 _toTime,
        string memory _emergencyName,
        string memory _emergencyPhone
    ) public {
        require(_fromTime >= block.timestamp, "Exit time cannot be in the past");
        require(_toTime > _fromTime, "Return time must be after exit time");

        // Additional checks for same-day can be more complex on-chain without oracle
        
        outpassCount++;
        outpasses[outpassCount] = OutpassData(
            outpassCount,
            msg.sender,
            _purpose,
            _destination,
            _fromTime,
            _toTime,
            OutpassStatus.Approved, // Auto-approved for day pass
            EmergencyContact(_emergencyName, _emergencyPhone)
        );
        studentOutpasses[msg.sender].push(outpassCount);
        emit OutpassRequested(outpassCount, msg.sender);
        emit OutpassStatusChanged(outpassCount, OutpassStatus.Approved);
    }

    function getOutpass(uint _id) public view returns (OutpassData memory) {
        return outpasses[_id];
    }

    function getMyOutpasses() public view returns (uint[] memory) {
        return studentOutpasses[msg.sender];
    }

    function cancelOutpass(uint _id) public {
        require(outpasses[_id].student == msg.sender, "Not your outpass");
        require(outpasses[_id].status == OutpassStatus.Pending, "Can only cancel pending outpasses");
        outpasses[_id].status = OutpassStatus.Cancelled;
        emit OutpassStatusChanged(_id, OutpassStatus.Cancelled);
    }

    function approveOutpass(uint _id) public onlyOwner {
        outpasses[_id].status = OutpassStatus.Approved;
        emit OutpassStatusChanged(_id, OutpassStatus.Approved);
    }

    function rejectOutpass(uint _id) public onlyOwner {
        outpasses[_id].status = OutpassStatus.Rejected;
        emit OutpassStatusChanged(_id, OutpassStatus.Rejected);
    }

    function expireOutpass(uint _id) public onlyOwner {
        outpasses[_id].status = OutpassStatus.Expired;
        emit OutpassStatusChanged(_id, OutpassStatus.Expired);
    }

    function markAsUsed(uint _id) public {
        require(outpasses[_id].student == msg.sender, "Not your outpass");
        require(outpasses[_id].status == OutpassStatus.Approved, "Outpass not approved");
        outpasses[_id].status = OutpassStatus.Used;
        emit OutpassStatusChanged(_id, OutpassStatus.Used);
    }
}

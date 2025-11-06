
export const contractAddress = "0x1a8b92B00Ff5aF797d69356332Bd17cb92D6b9D0";
export const contractABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "student",
        "type": "address"
      }
    ],
    "name": "OutpassRequested",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "enum Outpass.OutpassStatus",
        "name": "status",
        "type": "uint8"
      }
    ],
    "name": "OutpassStatusChanged",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      }
    ],
    "name": "approveOutpass",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      }
    ],
    "name": "cancelOutpass",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      }
    ],
    "name": "expireOutpass",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_purpose",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_destination",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_fromTime",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_toTime",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_emergencyName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_emergencyPhone",
        "type": "string"
      }
    ],
    "name": "generateDayOutpass",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getMyOutpasses",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      }
    ],
    "name": "getOutpass",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "student",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "reason",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "destination",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "outDate",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "expectedReturnDate",
            "type": "uint256"
          },
          {
            "internalType": "enum Outpass.OutpassStatus",
            "name": "status",
            "type": "uint8"
          },
          {
            "components": [
              {
                "internalType": "string",
                "name": "name",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "phone",
                "type": "string"
              }
            ],
            "internalType": "struct Outpass.EmergencyContact",
            "name": "emergencyContact",
            "type": "tuple"
          }
        ],
        "internalType": "struct Outpass.OutpassData",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      }
    ],
    "name": "markAsUsed",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "outpassCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "outpasses",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "student",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "reason",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "destination",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "outDate",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "expectedReturnDate",
        "type": "uint256"
      },
      {
        "internalType": "enum Outpass.OutpassStatus",
        "name": "status",
        "type": "uint8"
      },
      {
        "components": [
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "phone",
            "type": "string"
          }
        ],
        "internalType": "struct Outpass.EmergencyContact",
        "name": "emergencyContact",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      }
    ],
    "name": "rejectOutpass",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_reason",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_destination",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_outDate",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_expectedReturnDate",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_emergencyName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_emergencyPhone",
        "type": "string"
      }
    ],
    "name": "requestOutpass",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "studentOutpasses",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]

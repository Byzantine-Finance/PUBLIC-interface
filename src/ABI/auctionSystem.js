const auctionAddress = "0x10a50c363FE4e8c17196B889Caf9047408C78C2e"; //sepolia
const auctionABI = [{
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "BadPermissions",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [{
                "indexed": true,
                "internalType": "address",
                "name": "bidder",
                "type": "address"
            },
            {
                "components": [{
                        "internalType": "uint128",
                        "name": "durationInDays",
                        "type": "uint128"
                    },
                    {
                        "internalType": "uint256",
                        "name": "dailyVcPrice",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint8",
                        "name": "clusterSize",
                        "type": "uint8"
                    },
                    {
                        "internalType": "uint256",
                        "name": "auctionScore",
                        "type": "uint256"
                    }
                ],
                "indexed": false,
                "internalType": "struct AuctionContract.Bid",
                "name": "bid",
                "type": "tuple"
            }
        ],
        "name": "NewBid",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [{
            "indexed": true,
            "internalType": "address",
            "name": "operator",
            "type": "address"
        }],
        "name": "OpJustJoined",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [{
            "indexed": true,
            "internalType": "address",
            "name": "operator",
            "type": "address"
        }],
        "name": "OpJustLeft",
        "type": "event"
    },
    {
        "inputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "name": "auctionSet",
        "outputs": [{
                "internalType": "address",
                "name": "operator",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "auctionScore",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "expectedValidatorReturn",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{
            "internalType": "address",
            "name": "offendingOperator",
            "type": "address"
        }],
        "name": "failedToSign",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{
            "internalType": "address",
            "name": "operator",
            "type": "address"
        }],
        "name": "getOperatorDetails",
        "outputs": [{
            "components": [{
                    "internalType": "enum AuctionContract.OperatorStatus",
                    "name": "opStat",
                    "type": "uint8"
                },
                {
                    "components": [{
                            "internalType": "uint128",
                            "name": "durationInDays",
                            "type": "uint128"
                        },
                        {
                            "internalType": "uint256",
                            "name": "dailyVcPrice",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint8",
                            "name": "clusterSize",
                            "type": "uint8"
                        },
                        {
                            "internalType": "uint256",
                            "name": "auctionScore",
                            "type": "uint256"
                        }
                    ],
                    "internalType": "struct AuctionContract.Bid",
                    "name": "bid",
                    "type": "tuple"
                },
                {
                    "internalType": "address",
                    "name": "assignedToStrategyModule",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "lastDvtKick",
                    "type": "uint256"
                }
            ],
            "internalType": "struct AuctionContract.OperatorDetails",
            "name": "",
            "type": "tuple"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{
            "internalType": "address",
            "name": "operator",
            "type": "address"
        }],
        "name": "getOperatorEscrowBalance",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{
            "internalType": "address",
            "name": "operator",
            "type": "address"
        }],
        "name": "getStatus",
        "outputs": [{
            "internalType": "enum AuctionContract.OperatorStatus",
            "name": "",
            "type": "uint8"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "joinProtocol",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "leaveProtocol",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "maxDiscountRate",
        "outputs": [{
            "internalType": "uint8",
            "name": "",
            "type": "uint8"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "minDuration",
        "outputs": [{
            "internalType": "uint8",
            "name": "",
            "type": "uint8"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{
            "internalType": "address",
            "name": "",
            "type": "address"
        }],
        "name": "operatorDetails",
        "outputs": [{
                "internalType": "enum AuctionContract.OperatorStatus",
                "name": "opStat",
                "type": "uint8"
            },
            {
                "components": [{
                        "internalType": "uint128",
                        "name": "durationInDays",
                        "type": "uint128"
                    },
                    {
                        "internalType": "uint256",
                        "name": "dailyVcPrice",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint8",
                        "name": "clusterSize",
                        "type": "uint8"
                    },
                    {
                        "internalType": "uint256",
                        "name": "auctionScore",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct AuctionContract.Bid",
                "name": "bid",
                "type": "tuple"
            },
            {
                "internalType": "address",
                "name": "assignedToStrategyModule",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "lastDvtKick",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [{
            "internalType": "contract ByzantineFinance",
            "name": "",
            "type": "address"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{
            "internalType": "address[]",
            "name": "operators",
            "type": "address[]"
        }],
        "name": "processOperatorBids",
        "outputs": [],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{
            "internalType": "uint256",
            "name": "numberOfOps",
            "type": "uint256"
        }],
        "name": "requestOperators",
        "outputs": [{
            "internalType": "address[]",
            "name": "operators",
            "type": "address[]"
        }],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{
                "internalType": "uint128",
                "name": "duration",
                "type": "uint128"
            },
            {
                "internalType": "uint256",
                "name": "discountRate",
                "type": "uint256"
            }
        ],
        "name": "setBid",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [{
            "internalType": "uint256",
            "name": "aprPercentageTimesAThousand",
            "type": "uint256"
        }],
        "name": "updateExpectedReturn",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{
            "internalType": "uint8",
            "name": "newMaxDiscount",
            "type": "uint8"
        }],
        "name": "updateMaxDiscount",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{
            "internalType": "uint8",
            "name": "newMinDuration",
            "type": "uint8"
        }],
        "name": "updateMinDuration",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

export { auctionAddress, auctionABI };
export const abi = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_index",
				"type": "uint256"
			}
		],
		"name": "claimFund",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_index",
				"type": "uint256"
			}
		],
		"name": "claimRefund",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_desc",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_creatorName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_projectLink",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_cid",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_fundingGoal",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_duration",
				"type": "uint256"
			},
			{
				"internalType": "enum CrowdfundingStorage.Category",
				"name": "_category",
				"type": "uint8"
			},
			{
				"internalType": "enum CrowdfundingStorage.RefundPolicy",
				"name": "_refundPolicy",
				"type": "uint8"
			}
		],
		"name": "createNewProject",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_index",
				"type": "uint256"
			}
		],
		"name": "fundProject",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "InvalidInitialization",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "NotInitializing",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "OwnableInvalidOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "OwnableUnauthorizedAccount",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint64",
				"name": "version",
				"type": "uint64"
			}
		],
		"name": "Initialized",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
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
		"name": "addressFundingList",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "projectIndex",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalAmount",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
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
		"name": "addressProjectsList",
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
		"inputs": [],
		"name": "getAllProjectsDetail",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "projectName",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "projectDescription",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "creatorName",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "cid",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "fundingGoal",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "amountRaised",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "totalContributors",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "creationTime",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "duration",
						"type": "uint256"
					},
					{
						"internalType": "enum CrowdfundingStorage.Category",
						"name": "category",
						"type": "uint8"
					}
				],
				"internalType": "struct CrowdfundingStorage.ProjectMetadata[]",
				"name": "allProjects",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "creator",
				"type": "address"
			}
		],
		"name": "getCreatorProjects",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "createdProjects",
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
				"name": "_index",
				"type": "uint256"
			}
		],
		"name": "getProject",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "projectName",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "projectDescription",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "creatorName",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "projectLink",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "cid",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "fundingGoal",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "duration",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "creationTime",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "creatorAddress",
						"type": "address"
					},
					{
						"internalType": "enum CrowdfundingStorage.Category",
						"name": "category",
						"type": "uint8"
					},
					{
						"internalType": "enum CrowdfundingStorage.RefundPolicy",
						"name": "refundPolicy",
						"type": "uint8"
					},
					{
						"internalType": "uint256[]",
						"name": "amount",
						"type": "uint256[]"
					},
					{
						"components": [
							{
								"internalType": "address[]",
								"name": "contributors",
								"type": "address[]"
							},
							{
								"internalType": "bool[]",
								"name": "refundClaimed",
								"type": "bool[]"
							},
							{
								"internalType": "bool",
								"name": "claimedAmount",
								"type": "bool"
							},
							{
								"internalType": "uint256",
								"name": "amountRaised",
								"type": "uint256"
							}
						],
						"internalType": "struct CrowdfundingStorage.ProjectStatus",
						"name": "status",
						"type": "tuple"
					}
				],
				"internalType": "struct CrowdfundingStorage.Project",
				"name": "project",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256[]",
				"name": "_indexList",
				"type": "uint256[]"
			}
		],
		"name": "getProjectsDetail",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "projectName",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "projectDescription",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "creatorName",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "cid",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "fundingGoal",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "amountRaised",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "totalContributors",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "creationTime",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "duration",
						"type": "uint256"
					},
					{
						"internalType": "enum CrowdfundingStorage.Category",
						"name": "category",
						"type": "uint8"
					}
				],
				"internalType": "struct CrowdfundingStorage.ProjectMetadata[]",
				"name": "projectsList",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "contributor",
				"type": "address"
			}
		],
		"name": "getUserFundings",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "projectIndex",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "totalAmount",
						"type": "uint256"
					}
				],
				"internalType": "struct CrowdfundingStorage.Funded[]",
				"name": "fundedProjects",
				"type": "tuple[]"
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
				"name": "",
				"type": "uint256"
			}
		],
		"name": "projects",
		"outputs": [
			{
				"internalType": "string",
				"name": "projectName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "projectDescription",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "creatorName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "projectLink",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "cid",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "fundingGoal",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "duration",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "creationTime",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "creatorAddress",
				"type": "address"
			},
			{
				"internalType": "enum CrowdfundingStorage.Category",
				"name": "category",
				"type": "uint8"
			},
			{
				"internalType": "enum CrowdfundingStorage.RefundPolicy",
				"name": "refundPolicy",
				"type": "uint8"
			},
			{
				"components": [
					{
						"internalType": "address[]",
						"name": "contributors",
						"type": "address[]"
					},
					{
						"internalType": "bool[]",
						"name": "refundClaimed",
						"type": "bool[]"
					},
					{
						"internalType": "bool",
						"name": "claimedAmount",
						"type": "bool"
					},
					{
						"internalType": "uint256",
						"name": "amountRaised",
						"type": "uint256"
					}
				],
				"internalType": "struct CrowdfundingStorage.ProjectStatus",
				"name": "status",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]
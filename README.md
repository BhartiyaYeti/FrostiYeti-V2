# EdBucks - Empowering Crowdfunding on Educational Grant with Avalanche Blockchain

## Introduction

Edbucks represents a pioneering venture in the realm of blockchain-based crowdfunding, specifically tailored to revolutionize the funding landscape for research and educational grants. In a world where traditional crowdfunding platforms grapple with challenges such as high fees, lack of transparency, and geographical limitations, Edbucks emerges as a beacon of innovation and inclusivity. By harnessing the transformative power of blockchain technology, Edbucks aims to democratize access to capital, empower creators, and drive positive social impact across the education sector.
At its core, Edbucks leverages the immutable and decentralized nature of blockchain to establish a transparent and efficient crowdfunding platform. Built on the Avalanche blockchain, Edbucks operates as a decentralized application (DApp), enabling creators to submit grant proposals for research projects, educational initiatives, and academic endeavors. Through the seamless integration of blockchain technology, Edbucks eliminates the need for intermediaries, reducing costs, enhancing transparency, and fostering trust between creators and backers.
This tutorial will show you how to use an Avalanche C-Chain dApp to create a crowdfunding platform.

## Audience

To get the most out of this tutorial, you will need to have a basic understanding of React, TailWind, Solidity, and how to develop dApps in Avalanche. If you do not yet know about these topics, see the Resources section at the end for links to learn more.

## Dependencies

- [Node.js](https://nodejs.org/en/download/releases/) v16.0.0 or later
- [Tailwind CSS](https://tailwindcss.com/) library, which can be installed with `npm install -D tailwindcss`
- [Ethers.js](https://docs.ethers.org/v6/) library, which can be installed with `npm install ethers`

## Requirements

- Metamask needs to be installed on your browser, and you need to be connected to the Avalanche Fuji test network (for this tutorial).
- Tailwind CSS needs to be configured. You need to create a 'tailwind.config.js' file by using the following command `npx tailwindcss init`. Next, you have to configure your template paths in the config file. Here is a simple code snippet for reference,

```
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

## Implementing the smart contract

Now we will build the smart contract of our application. Let's start by creating a contract named **crowdfunding**.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract crowdfunding {
}
```

Let's define the structures and enums that are required for the contract state. We will make two enums: **Category**, which can have four values representing the category to which the project belongs, and **RefundPolicy**, which can have two values.

- _REFUNDABLE_:- This type of project returns the amount funded by the investor when the project fails to achieve the goal amount within the duration.
- _NONREFUNDABLE_:- For this type of project, the creator can claim the amount even if it doesn't achieve the funding goal.

Next, we declare our structures, we will create three **Project**, **ProjectMetadata**, and **Funded**.

```solidity
// The category values
enum Category{
    DESIGNANDTECH,
    EDUCATION,
    RESEARCH
}

enum RefundPolicy{
    REFUNDABLE,
    NONREFUNDABLE
}

// Structure of each project in our dApp
struct Project {
    string projectName;             // Stores the project's name
    string projectDescription;      // Stores the project's description
    string creatorName;             // Stores the project creator name
    string projectLink;             // Stores project link if any
    string cid;                     // Stores the ipfs link to project's image
    uint256 fundingGoal;            // Stores the funding goal
    uint256 duration;               // Stores the duration of project in minutes
    uint256 creationTime;           // Stores the project creation time
    uint256 amountRaised;           // Stores the amount contributed to this project
    address creatorAddress;         // Stores the creator's address
    Category category;              // Stores the project category
    RefundPolicy refundPolicy;      // Stores the refund policy
    address[] contributors;         // Stores the contributors of this project
    uint256[] amount;               // Stores the amount contributed by conrtibutors at corresponding index at contributors array
    bool[] refundClaimed;           // Keeps record if the contributors claimed refund at cooresponding index at contributors array
    bool claimedAmount;             // Keeps record if creator claimed raised funds
}

// Structure used to return metadata of each project
struct ProjectMetadata {
    string projectName;             // Stores the project's name
    string projectDescription;      // Stores the project's description
    string creatorName;             // Stores the project creator name
    string cid;                     // Stores Ipfs link to project's image
    uint256 fundingGoal;            // Stores the goal amount
    uint256 amountRaised;           // Stores raised funds
    uint256 totalContributors;      // Stores the length of contributors array
    uint256 creationTime;           // Stores the creation time
    uint256 duration;               // Stores duration for which project can be funded
    Category category;              // Stores the project category
}

// Each user funding gets recorded in Funded structure
struct Funded {
	uint256 projectIndex;           // Stores the project index of project that's funded
	uint256 totalAmount;            // Stores the amount funded
}
```

Now let's define the state variables.

```solidity
// Stores all the projects
Project[] projects;

// Stores the indexes of projects created on projects list by an address
mapping(address => uint256[]) addressProjectsList;

// Stores the list of fundings  by an address
mapping(address => Funded[]) addressFundingList;
```

Now, we define a modifier that will help to check if the parameter passed is a valid index in the project's array.

```solidity
// Checks if an index is a valid index in projects array
modifier isValidIndex(uint256 _index) {
        require(_index < projects.length, "Invalid Project Id");
        _;
    }
```

Now we will define a function that will create a new project.

```solidity
// Create a new project and updates the addressProjectsList and projects array
// Create a new project and updates the addressProjectsList and projects array
    function createNewProject(
        string memory _name,
        string memory _desc,
        string memory _creatorName,
        string memory _projectLink,
        string memory _cid,
        uint256 _fundingGoal,
        uint256 _duration,
        Category _category,
        RefundPolicy _refundPolicy
    ) external {
        projects.push(Project({
            creatorAddress: msg.sender,
            projectName: _name,
            projectDescription: _desc,
            creatorName: _creatorName,
            projectLink: _projectLink,
            cid: _cid,
            fundingGoal: _fundingGoal * 10**18,
            duration: _duration * (1 minutes),
            creationTime: block.timestamp,
            category: _category,
            refundPolicy: _refundPolicy,
            amountRaised: 0,
            contributors: new address[](0),
            amount: new uint256[](0),
            claimedAmount: false,
            refundClaimed: new bool[](0)
        }));
        addressProjectsList[msg.sender].push(projects.length - 1);
        emit ProjectCreated(msg.sender, projects.length - 1);
    }
```

We will now create three functions to retrieve the project details. `getAllProjectsDetail` function helps to retrieve all the project's metadata.
Next, `getProjectsDetail` accepts an array of project indexes and returns the metadata of all the projects whose indexes are present in the array.`getProject` accepts an index and retrieves the project details at that index of **projects** array.

```solidity
// Returns the project metadata of all entries in projects
function getAllProjectsDetail() external view returns(ProjectMetadata[] memory allProjects) {
    ProjectMetadata[] memory newList = new ProjectMetadata[](projects.length);
    for(uint256 i = 0; i < projects.length; i++){
        newList[i] = ProjectMetadata(
            projects[i].projectName,
            projects[i].projectDescription,
            projects[i].creatorName,
            projects[i].cid,
            projects[i].fundingGoal,
            projects[i].amountRaised,
            projects[i].contributors.length,
            projects[i].creationTime,
            projects[i].duration,
            projects[i].category
        );
    }
    return newList;
}

// Takes array of indexes as parameter
// Returns array of metadata of project at respective indexes
function getProjectsDetail(uint256[] memory _indexList) external view returns(ProjectMetadata[] memory projectsList) {
    ProjectMetadata[] memory newList = new ProjectMetadata[](_indexList.length);
    for(uint256 index = 0; index < _indexList.length; index++) {
        if(_indexList[index] < projects.length) {
            uint256 i = _indexList[index];
            newList[index] = ProjectMetadata(
                projects[i].projectName,
                projects[i].projectDescription,
                projects[i].creatorName,
                projects[i].cid,
                projects[i].fundingGoal,
                projects[i].amountRaised,
                projects[i].contributors.length,
                projects[i].creationTime,
                projects[i].duration,
                projects[i].category
            );
        } else {
            newList[index] = ProjectMetadata(
                "Invalid Project",
                "Invalid Project",
                "Invalid Project",
                "Invalid Project",
                0,
                0,
                0,
                0,
                0,
                Category.DESIGNANDTECH
            );
        }
    }
    return newList;
}

// Returns the project at the given index
function getProject(uint256 _index) external view validIndex(_index) returns(Project memory project) {
    return projects[_index];
}
```

Now we create two functions `getCreatorProjects` and `getUserFundings`.

```solidity
// Returns array of indexes of projects created by creator
function getCreatorProjects(address creator) external view returns(uint256[] memory createdProjects) {
    return addressProjectsList[creator];
}

// Returns array of details of fundings by the contributor
function getUserFundings(address contributor) external view returns(Funded[] memory fundedProjects) {
    return addressFundingList[contributor];
}
```

Time to implement the function to fund a project. The functions `addContribution` and `addToFundingList` are helper functions for the `fundProject` function. `addContribution` checks if the contributor already exists and updates the amount, if not then it adds the contribution amount and contributor to the project. Similarly `addToFundingList` checks if there is a previous contribution and then updates the amount, if not found then add a new struct `Funded` to keep the contribution details in the mapping `addressFundingList`.

```solidity
// Helper function adds details of Funding to addressFundingList
function addToFundingList(uint256 _index) internal validIndex(_index) {
    for(uint256 i = 0; i < addressFundingList[msg.sender].length; i++) {
        if(addressFundingList[msg.sender][i].projectIndex == _index) {
            addressFundingList[msg.sender][i].totalAmount += msg.value;
            return;
        }
    }
    addressFundingList[msg.sender].push(Funded(_index, msg.value));
}

// Helper fundtion adds details of funding to the project in projects array
function addContribution(uint256 _index) internal validIndex(_index)  {
    for(uint256 i = 0; i < projects[_index].contributors.length; i++) {
        if(projects[_index].contributors[i] == msg.sender) {
            projects[_index].amount[i] += msg.value;
            addToFundingList(_index);
            return;
        }
    }
    projects[_index].contributors.push(msg.sender);
    projects[_index].amount.push(msg.value);
    if(projects[_index].refundPolicy == RefundPolicy.REFUNDABLE) {
        projects[_index].refundClaimed.push(false);
    }
    addToFundingList(_index);
}

// Funds the projects at given index
function fundProject(uint256 _index) payable external isValidIndex(_index)  {
        require(projects[_index].creatorAddress != msg.sender, "You are the project owner");
        require(block.timestamp <= projects[_index].duration + projects[_index].creationTime, "Project Funding Time Expired");
        addContribution(_index);
        projects[_index].amountRaised += msg.value;
        emit ProjectFunded(msg.sender, _index, msg.value);
    }
```

The `claimFund` function transfers the amount raised to the project creator in two cases.

- The project funding duration is over and the amount raised is more than the funding goal.
- The project funding duration is over and the amount raised is not more than the funding goal, but the project refund policy is **NON-REFUNDABLE**.

```solidity
// Helps project creator to transfer the raised funds to his address
function claimFund(uint256 _index) isValidIndex(_index) external {
        require(projects[_index].creatorAddress == msg.sender, "You are not Project Owner");
        require(block.timestamp >= projects[_index].duration + projects[_index].creationTime, "Project Funding Time Not Expired");
        require(projects[_index].refundPolicy == RefundPolicy.NONREFUNDABLE
                    || projects[_index].amountRaised >= projects[_index].fundingGoal, "Funding goal not reached");
        require(!projects[_index].claimedAmount, "Already claimed raised funds");
        projects[_index].claimedAmount = true;
        payable(msg.sender).transfer(projects[_index].amountRaised);
        emit FundsClaimed(msg.sender, _index, projects[_index].amountRaised);
    }
```

When **REFUNDABLE** project is not able to achieve its funding goal, the contributors can get their refund with the help of `claimRefund` function. `getContributorIndex` is a helper function to retrieve the `msg.sender` index in the **contributors** array if they have contributed otherwise returns -1.

```solidity
// Helper function to get the contributor index in the projects' contributor's array
function getContributorIndex(uint256 _index) validIndex(_index) internal view returns(int256) {
    int256 contributorIndex = -1;
    for(uint256 i = 0; i < projects[_index].contributors.length; i++) {
        if(msg.sender == projects[_index].contributors[i]) {
            contributorIndex = int256(i);
            break;
        }
    }
    return contributorIndex;
}

// Enables the contributors to claim refund when refundable project doesn't reach its goal
function claimRefund(uint256 _index) isValidIndex(_index) external {
        require(block.timestamp >= projects[_index].duration + projects[_index].creationTime, "Project Funding Time Not Expired");
        require(projects[_index].refundPolicy == RefundPolicy.REFUNDABLE
                    && projects[_index].amountRaised < projects[_index].fundingGoal, "Funding goal not reached");

        int256 index = getContributorIndex(_index);
        require(index != -1, "You did not contribute to this project");

        uint256 contributorIndex = uint256(index);
        require(!projects[_index].refundClaimed[contributorIndex], "Already claimed refund amount");

        projects[_index].refundClaimed[contributorIndex] = true;
        payable(msg.sender).transfer(projects[_index].amount[contributorIndex]);
    }
```

We have now completed the smart contract implementation. Now let's move to contract deployment.

## Deploying the smart contract

### Setting up Metamask

Log in to Metamask -> Click the Network drop-down -> Select custom RPC

![image of metamask](https://github.com/BhartiyaYeti/FrostiYeti-V2/blob/readme/readme-demo-image/Metamask.png)

#### FUJI Tesnet Settings:

- **Network name:** Avalanche FUJI C-Chain
- **New RPC URL:** [https://api.avax-test.network/ext/bc/C/rpc](https://api.avax-test.network/ext/bc/C/rpc)
- **ChainID:** `43113`
- **Symbol:** `C-AVAX`
- **Explorer:** [https://cchain.explorer.avax-test.network](https://cchain.explorer.avax-test.network)

Fund your address from the Avalanche testnet [faucet](https://faucet.avax-test.network/).

### Deploy using Remix

Open [Remix](https://remix.ethereum.org/) --> Select Solidity

![Picture of Remix site](https://github.com/BhartiyaYeti/FrostiYeti-V2/blob/readme/readme-demo-image/Remix.png)

Create a `crowdfunding.sol` file in the Remix file explorer and add the functions explained above.

Now, navigate to the solidity contract compiler tab on the left side navigation bar and click the blue button to compile `crowdfunding.sol` contract. Also, make note of the location of the `ABI` after compilation is completed.

Navigate to deploy tab and open the "ENVIRONMENT" drop-down. Select "Injected Web3" (make sure metamask is loaded) and click the "deploy" button.

Approve the transaction on Metamask pop-up interface. Once our contract is deployed successfully, make note of the deployed `contract address`.

## Creating a frontend in React

Now, we are going to create a react app and set up the frontend of the application.  
Open a terminal and navigate to the directory where we will create the application.

```text
cd /path/to/directory
```

Now, clone the github repository, move into the newly created `crowdfunding-platform-avalanche` directory and install all dependencies.

```text
git clone https://github.com/BhartiyaYeti/FrostiYeti-V2.git
cd FrostiYeti-V2
npm install
```

In our React application we keep all the React components in the `src/components` directory.

### ConnectWallet

This component renders the first page of the site. It contains a **Connect to metamask** button, which allows you to connect your Metamask account to the dApp.

### HomeComponent

It renders the home page of the dApp. The home page displays various projects which are being posted on the dApp for funding. The home page has three sections, mainly a featured project section, a recommended project section, and a recent upload section. The recommended project section recommends some projects for you to check out. The recent upload section displays projects which were uploaded recently for funding. Also, at the top of the home page, the total number of projects posted on the site is displayed along with the total amount of AVAX funded to date and also the number of unique users who funded the projects.

### CreateProjectComponent

It renders a form for creating a new project. The form has various inputs, required to create a new project such as project category, project name, project description, creator name, image, project site link, funding goal, duration of the funding, refund policy. The project details are sent to the smart contract upon submission of the form. The image provided in the form is then uploaded to IPFS before sending the project details to the smart contract. Thus, the smart contract doesn't contain the image itself, but an IPFS link to the image.

### ProjectComponent

The project component renders all the details about an individual project. At the top, it displays the project name and image, then the total funding it received till now, the number of unique people who funded the project and a button for a user to fund the project with AVAX. After that, it displays the project description and other project information such as project owner name, project link, refund policy, project category and creation date. At the bottom, a table is rendered, listing all the contributors who contributed to the project to date and the amount they contributed, sorted in the descending order of amount contributed.

### PaymentModal

This component renders the modal for payment upon clicking the **back this project** button. The modal has an input for the amount of AVAX you want to fund and a **fund** button to send the fund to the contract. The modal automatically closes once the transfer of the AVAX token is successful.

### ProfileComponent

This component renders the profile information of a user. This component has three sections, namely **Ongoing projects** section, **Completed projects** section and **Projects funded** section. The **Ongoing projects** section displays all the projects that the user has created and the funding period for which hasn't ended yet. The **Completed projects** section displays all the projects that the user has created and the funding period for which is over. **Projects funded** section displays all the projects to which the user has provided some funding. The **Projects funded** section isn't rendered if you visit some other user's profile.  
To visit your profile, click the account address displayed on the right end of the navbar.

### DiscoverComponent

This component renders a list of projects posted on the site, based on the project category selected. There are four categories, namely Design & tech, Film, Arts and Games.

### ScrollShowbarComponent

This component renders a carousel which is used by various other components to display a list of projects.

Don't forget to change the contract address in `App.js` file before starting up the React app.

## Walkthrough

You can check out the live demo of the dApp [here](https://edulinkv1.vercel.app/)

## DevOps Architecture

![Image displaying DevOps_architecture](https://github.com/BhartiyaYeti/FrostiYeti-V2/blob/readme/readme-demo-image/Devops%20Architecture.png)

The above image displays the architecture of the CI/CD implementation of the project.

## Conclusion

Congratulations! We have successfully developed a working decentralized crowdfunding application where users can create projects, fund various projects and even claim refunds if possible. As a next step, you can try adding new features to the dApp, such as Account Abstraction, Proof of Impact or KYC Verification.

## References

[Deploy a smart contract on Avalanche using Remix and Metamask](https://docs.avax.network/build/tutorials/smart-contracts/deploy-a-smart-contract-on-avalanche-using-remix-and-metamask/)

[Create a React App](https://create-react-app.dev/docs/getting-started)

[Implement Tailwind with React](https://tailwindcss.com/docs/guides/create-react-app)

[Interact with the smart contract from front-end using Ethers.js Library](https://docs.ethers.org/v6/)

[Read our project report for a in-depth knowledge on Edbucks](https://docs.google.com/document/d/1i6nr0wlfbIXPYR4l1d97f1mRLYBbXOqW2-WKtfkunyA/)

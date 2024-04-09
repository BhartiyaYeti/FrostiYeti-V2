import "./style.css";
import NavbarComponent from "./components/NavbarComponent";
import HomeComponent from "./components/HomeComponent";
import FooterComponent from "./components/FooterComponent";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CreateProjectComponent from "./components/CreateProjectComponent";
import ConnectWallet from "./components/ConnectWallet";
import DiscoverComponent from "./components/DiscoverComponent";
import ProjectComponent from "./components/ProjectComponent";
import ProfileComponent from "./components/ProfileComponent";
import { useState } from "react";
import { ethers } from "ethers";
import { abi } from "./abi";
import Snow from "./components/Snow";
// const CONTRACT_ADDRESS = "0x1609bDd9c4e1e6cD3cAd9D1859bb86809ffF99F7";
// const CONTRACT_ADDRESS = "0xe68d23BdebEEDc27e00655C26f6A160d511A93D0";
const CONTRACT_ADDRESS = "0x781df2b1C540027Df6e118184D4dDaF80b7a32d6";

function App() {
  const [myContract, setMyContract] = useState(null);
  const [address, setAddress] = useState();
  let provider, signer, add;

  async function changeNetwork() {
    // switch network to avalanche
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0xa869" }],
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0xa869",
                chainName: "Avalanche Fuji Testnet",
                nativeCurrency: {
                  name: "Avalanche",
                  symbol: "AVAX",
                  decimals: 18,
                },
                rpcUrls: ["https://api.avax-test.network/ext/bc/C/rpc"],
              },
            ],
          });
        } catch (addError) {
          alert("Error in add avalanche FUJI testnet");
        }
      }
    }
  }

  // Connects to Metamask and sets the myContract state with a new instance of the contract
  async function connect() {
    let res = await connectToMetamask();
    if (res === true) {
      await changeNetwork();
      provider = new ethers.providers.Web3Provider(window.ethereum);
      signer = provider.getSigner();
      add = await signer.getAddress();
      setAddress(add);

      try {
        const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
        setMyContract(contract);
        sessionStorage.setItem("IsContractThere", contract);
      } catch (err) {
        alert("CONTRACT_ADDRESS not set properly");
        console.log(err);
      }
    } else {
      alert("Couldn't connect to Metamask");
    }
  }

  // Helps open Metamask
  async function connectToMetamask() {
    try {
      await window.ethereum.enable();
      return true;
    } catch (err) {
      return false;
    }
  }
  const checkConnected = (component) => {
    return !myContract ? (
      <>
        <ConnectWallet connectMetamask={connect} />
      </>
    ) : (
      component
    );
  };

  return (
    <>
      <div className="app">
        <BrowserRouter basename={process.env.PUBLIC_URL}>
          {myContract && <NavbarComponent address={address} />}

          <Routes>
            <Route
              path="/"
              element={checkConnected(<HomeComponent contract={myContract} />)}
            />
            <Route
              path="create_project"
              element={checkConnected(
                <CreateProjectComponent contract={myContract} />
              )}
            />
            <Route
              path="discover"
              element={checkConnected(
                <DiscoverComponent contract={myContract} />
              )}
            />
            <Route
              path="profile"
              element={checkConnected(
                <ProfileComponent contract={myContract} userAddress={address} />
              )}
            />
            <Route
              path="project"
              element={checkConnected(
                <ProjectComponent contract={myContract} userAddress={address} />
              )}
            />
          </Routes>
          {myContract && <FooterComponent />}
        </BrowserRouter>
      </div>
      <Snow />
    </>
  );
}

export default App;

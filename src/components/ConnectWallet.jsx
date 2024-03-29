import HeroLogo from "../assets/logo.png";

export default function ConnectWallet(props) {
  return (
    <>
      <div className="p-5 px-10">
        <div className="flex justify-between">
          {/* <h1 className="text-3xl text-white font-bold">Chain4Scholars</h1> */}
          <div></div>
          <hr class="text-end w-52 h-[0.1px] my-4 bg-gray-100 border-0 roundeddark:bg-white"></hr>
        </div>
        <div className="flex my-52 justify-center gap-14">
          <div>
            <img src={HeroLogo} alt="" className="w-[300px] " />
          </div>
          <div className="my-auto w-[600px]">
            <h1 className="text-5xl font-bold mb-3 typing">
              Chain4Scholars
            </h1>
            <span className="text-white">
              Experience the power of blockchain in student financing:
              Effortlessly fund your education, shaping tomorrow's leaders
              today...
            </span>
            <div>
              <button
                className="walletButton mt-10"
                onClick={props.connectMetamask}
              >
                Connect to Metamask //{" "}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
    // <div className="connectWallet">
    //   <div className="typingContainer">
    //     <div className="typing">Chain4Scholars</div>
    //   </div>

    //   <div className="walletButtonContainer">
    //     <button className="walletButton" onClick={props.connectMetamask}>
    //       Connect to Metamask
    //     </button>
    //   </div>
    // </div>
  );
}

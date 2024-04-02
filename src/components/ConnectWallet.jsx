import HeroLogo from "../assets/Frame.png";
import SubNav from "./SubNav";

export default function ConnectWallet(props) {
  return (
    <>
      {/* <div className="p-5 px-10">
        <div className="flex justify-between">
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
      </div> */}

      <div>
        <SubNav connectMetamask={props} />
        <div className="px-44 h-[80vh] flex items-center justify-between">
          <div>
            <h1 className="text-white text-6xl w-[750px] font-extrabold">
              <span className="inline-block mb-5">Now</span>
              <br></br>
              <span className="inline-block mb-5 text-[#55C8ED]">
                Everyone <span className="text-white"> Get</span>
              </span>
              <span className="inline-block mb-8">Chance to Learn🚀</span>
            </h1>

            <h4 className="text-white w-[700px] mb-10 font-medium text-xl">
              Spark academic dreams with our blockchain-powered Studentfunding
              DApp, igniting innovation and empowering student success!
            </h4>
            <div className="flex align-baseline justify-start gap-10 items-center">
              <button className="text-black bg-[#55C8ED] py-3 px-10 hover:bg-white transition ease-in-out font-bold">
                Contact Us
              </button>
              <h4 className="text-white underline hover:cursor-pointer">
                Learn More
              </h4>
            </div>
          </div>
          <div className="">
            <img
              src={HeroLogo}
              alt=""
              className="absolute bottom-0 right-0 px-20"
            />
          </div>
        </div>
      </div>
    </>
  );
}

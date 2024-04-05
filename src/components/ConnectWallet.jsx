import HeroLogo from "../assets/Frame.png";
import SubNav from "./SubNav";
import { motion } from "framer-motion";
export default function ConnectWallet(props) {
  return (
    <>
      <div>
        <SubNav connectMetamask={props} />
        <div className="px-44 h-[80vh] flex items-center justify-between">
          <motion.div
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 1 }}
            variants={{
              visible: { opacity: 1, x: 0 },
              hidden: { opacity: 0, x: -150 },
            }}
          >
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
          </motion.div>
          <motion.div
            className=""
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 1.5 }}
            variants={{
              visible: { opacity: 1 },
              hidden: { opacity: 0 },
            }}
          >
            <img
              src={HeroLogo}
              alt=""
              className="absolute bottom-0 right-0 px-20"
            />
          </motion.div>
        </div>
      </div>
    </>
  );
}

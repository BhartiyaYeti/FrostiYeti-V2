import React from "react";
import { motion } from "framer-motion";
import EdbucksLogo from "../assets/edBucksLogo.svg";


const SubNav = (props) => {
  console.log(props.connectMetamask.connectMetamask);
  return (
    <nav className="flex justify-between items-center px-16 py-8 ">
      <motion.div
        initial="hidden"
        whileInView="visible"
        transition={{ duration: 1 }}
        variants={{
          visible: { opacity: 1, x: 0 },
          hidden: { opacity: 0, x: -150 },
        }}
        className="text-white text-4xl font-bold"
      >
          <img src={EdbucksLogo} alt="" className="h-[3rem]"/>
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        transition={{ duration: 1 }}
        variants={{
          visible: { opacity: 1, x: 0 },
          hidden: { opacity: 0, x: 50 },
        }}>
        <button
          className="text-black bg-[#55C8ED] py-3 px-10 hover:bg-white transition ease-in-out font-bold"
          onClick={props.connectMetamask.connectMetamask}
        >
          Connect Wallet
        </button>
      </motion.div>
    </nav>
  );
};

export default SubNav;

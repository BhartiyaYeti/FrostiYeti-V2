import React from "react";

const SubNav = (props) => {
  console.log(props.connectMetamask.connectMetamask);
  return (
    <nav className="flex justify-between px-16 py-5">
      <div className="text-white text-4xl font-bold">EduLink</div>
      <div>
        <button
          className="text-black bg-[#55C8ED] py-3 px-10 hover:bg-white transition ease-in-out font-bold"
          onClick={props.connectMetamask.connectMetamask}
        >
          Connect Wallet
        </button>
      </div>
    </nav>
  );
};

export default SubNav;

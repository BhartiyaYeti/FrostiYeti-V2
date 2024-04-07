import { useState } from "react";
import { ethers } from "ethers";
import { AiOutlineClose } from "react-icons/ai";
import Loader from "./Loader";
import Modal from "./Modal";

function PaymentModal(props) {
  let [amount, setAmount] = useState();
  const [showLoader, setShowLoader] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalText, setModalText] = useState("")
  const PRECISION = 10 ** 18;

  // sets the modalShow state to false to disable rendering of modal
  function closeModal() {
    props.setModalShow(false);
  }

  // set the value of input element to state variable upon change
  function handleChange(e) {
    setAmount(e.target.value);
  }

  // call function in the smart contract to send AVAX token
  // to fund the project
  async function sendFund() {
    console.log("Sending fund...");
    if (amount <= 0) {
      alert("Amount is less than or equal to 0");
      return;
    }
    try {
      setShowLoader(true)
      let fund = { value: ethers.utils.parseEther(amount.toString()) };
      let txn = await props.contract.fundProject(props.index, fund);
      await txn.wait();
      setShowLoader(false)
      setModalText(`${amount} AVAX Succesfully funded`)
      setShowModal(true)
      // alert(`${amount} AVAX Succesfully funded`);

      setAmount(1);
      closeModal();
    } catch (error) {
      console.log("Funding error: ");
      console.log(error);
      console.log("................");
      // alert("Error Sending AVAX");
      setShowLoader(false)
      setModalText("Error Sending AVAX")
      setShowModal(true)
    }
  }

  return (
    <div className="flex items-center justify-center  ">
      <div className="bg-[#55C8ED] w-[400px] p-5 ">
        <div className="flex justify-between">
          <div></div>
          <AiOutlineClose
            onClick={props.close}
            className="hover:cursor-pointer"
          />
        </div>
        <h1 className="text-center font-bold text-3xl">Payment</h1>
        <hr className="h-px my-1 bg-gray-200 border-0 dark:bg-gray-700" />
        <div className="text-center">
          <h1 className="my-3 text-lg">Enter Amount in AVAX</h1>
          <input
            type="number"
            name="payment"
            id="payment"
            className="w-[150px]"
            placeholder="  Enter AVAX"
            min="1"
            step="1"
            value={amount}
            onChange={handleChange}
            required
          />
          <br />
          <button
            className="bg-[#111] text-white px-6 py-2 mt-5 hover:bg-white hover:text-black"
            onClick={() => sendFund()}
          >
            Fund
          </button>
          {showLoader && <Loader loaderText="Please be patient! We are processing your transaction..." />}
          {showModal && <Modal modalInfoText={modalText} setShowModal={setShowModal} /> }
        </div>
      </div>
    </div>
  );
}

export default PaymentModal;

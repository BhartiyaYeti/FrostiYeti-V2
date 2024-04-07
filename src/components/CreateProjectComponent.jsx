import { useState } from "react";
import { create } from "ipfs-http-client";
import { Web3Storage } from "web3.storage";
import Loader from "./Loader";
import Modal from "./Modal";

function CreateProjectComponent(props) {
  const [formInput, setFormInput] = useState({
    category: "",
    projectName: "",
    description: "",
    creatorName: "",
    image: "",
    link: "",
    goal: 0.00001,
    duration: 1,
    refundPolicy: "",
  });

  const [inputImage, setInputImage] = useState(null);
  const [showLoader, setShowLoader] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalText, setModalText] = useState("")

  // set the form input state if input changes
  function handleChange(e) {
    let name = e.target.name;
    let value = e.target.value;
    formInput[name] = value;
    setFormInput(formInput);
  }

  // read the input image file provided and set its corresponding state
  // async function handleImageChange(e) {
  //   // read the file content on change
  //   setInputImage(document.querySelector('input[type="file"]'));
  //   console.log(document.querySelector('input[type="file"]'));
  // }

  // return category code
  function getCategoryCode() {
    let categoryCode = {
      "design and tech": 0,
      "education": 1,
      "research": 2
    };
    return categoryCode[formInput["category"]];
  }

  // return refund policy code
  function getRefundPolicyCode() {
    let refundCode = {
      refundable: 0,
      "non-refundable": 1,
    };
    return refundCode[formInput["refundPolicy"]];
  }

  // submit the form input data to smart contract
  async function submitProjectData(e) {
    // handle the submit action of the form
    const client = new Web3Storage({
      token: "z6MkggnbesoaFXVn9K22Xtvzv9hB5ETa3ubYbGCBxLqWMZBG",
    });
    // if (inputImage) {
    //   try {
    //     console.log("InputImages", inputImage.files);
    //     const cid = await client.put(inputImage.files, {
    //       name: "Project Image",
    //       maxRetries: 3,
    //     });
    //     console.log(cid);
    //     formInput["image"] = `ipfs.io/ipfs/${cid}/${inputImage.files[0].name}`;
    //   } catch (error) {
    //     alert("Uploading file error: " + error);
    //     console.log(error);
    //     // return since if selected image doesn't get uploaded to ipfs
    //     return;
    //   }
    // }

    // check for double submit (since the formInput['category']) is changed to integer on first submit
    // if not checked, second submit gives undefined value since getCategoryCode() doesn't have any mapping for integer code.
    e.preventDefault();
    setShowLoader(true)
    if (!Number.isInteger(formInput["category"])) {
      formInput["category"] = getCategoryCode();
    }
    // same reason as above
    if (!Number.isInteger(formInput["refundPolicy"])) {
      formInput["refundPolicy"] = getRefundPolicyCode();
    }

    formInput["duration"] = parseFloat(formInput["duration"]);
    formInput["goal"] = parseFloat(formInput["goal"]);

    console.log(formInput);

    // upload form data to contract
    let txn;
    try {
      txn = await props.contract.createNewProject(
        formInput["projectName"],
        formInput["description"],
        formInput["creatorName"],
        formInput["link"],
        formInput["image"],
        formInput["goal"],
        formInput["duration"],
        formInput["category"],
        formInput["refundPolicy"]
      );
      
      await txn.wait(txn);
      setShowLoader(false)
      // alert("Project creation complete!!");
      setModalText("Project creation complete!!")
      setShowModal(true)
      document.getElementById("project-form").reset();
      // return false;
    } catch (error) {
      setShowLoader(false)
      setModalText("Error on calling function: " + error)
      setShowModal(true)
      // alert("Error on calling function: " + error);
      console.log(error);
    }
  }

  return (
    <>
      <h1 className="text-3xl text-center font-bold text-white">
        Create Campaign
      </h1>
      <center>
        <form className="bg-[#f5f7f8] w-[50%] my-10 rounded-2xl" id="project-form">
          <div className="flex gap-10  p-10 rounded-3xl text-start">
            <div className="w-full ">
              <div className="mb-4">
                <h3 className="mb-1">Campaign Name:</h3>
                <input
                  name="projectName"
                  placeholder="  Enter The Campaign Name"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <h3 className="mb-1">Campaign Story:</h3>
                <textarea
                  name="description"
                  placeholder="  Write Back Story..."
                  cols="50"
                  rows="5"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <h3 className="mb-1">Campaign Category:</h3>
                <select name="category" required onChange={handleChange}>
                  <option value="" selected disabled hidden>
                    Select category
                  </option>
                  <option value="design and tech">Design and Tech</option>
                  <option value="education">Education</option>
                  <option value="research">Research</option>
                </select>
              </div>
              <div className="mb-4">
                <h3 className="mb-1">Campaign Link:</h3>
                <input
                  type="url"
                  name="link"
                  placeholder="  Enter link to the project"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="w-full">
              <div className="mb-4">
                <h3 className="mb-1">Creator Name:</h3>
                <input
                  name="creatorName"
                  placeholder="  Enter Creator Name"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <h3 className="mb-1">Funding Goal(AVAX)</h3>
                <input
                  type="number"
                  step="any"
                  name="goal"
                  placeholder=" Enter the funding goal"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <h3 className="mb-1">Duration in Minutes</h3>
                <input
                  type="number"
                  name="duration"
                  placeholder=" Enter the duration"
                  min="1"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <h3 className="mb-1">Refund Policy</h3>
                <select name="refundPolicy" required onChange={handleChange}>
                  <option value="" selected disabled hidden>
                    Select Refund type
                  </option>
                  <option value="refundable">Refundable</option>
                  <option value="non-refundable">Non-Refundable</option>
                </select>
              </div>
            </div>
          </div>
          <button
            onClick={submitProjectData}
            className="bg-[#55C8ED] px-6 py-2 my-5 hover:bg-[#111] hover:text-white"
          >
            Save
          </button>
          
        </form>
      </center>
      {showLoader && <Loader loaderText="Your project is being created" />}
      {showModal && <Modal modalInfoText={modalText} setShowModal={setShowModal} /> }
    </>
  );
}

export default CreateProjectComponent;

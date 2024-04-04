import PaymentModal from "./PaymentModal";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import dummyPic from "../assets/placeholderImage.jpg";
import { MdOutlineCategory } from "react-icons/md";
import Popup from "reactjs-popup";
import { GiPayMoney } from "react-icons/gi";
// import "reactjs-popup/dist/index.css";
function ProjectComponent(props) {
  const [modalShow, setModalShow] = useState(false);
  const [projectDetails, setProjectDetails] = useState({
    amountRaised: 0,
    cid: "",
    creatorName: "",
    fundingGoal: 0,
    projectDescription: "",
    projectName: "",
    contributors: [],
    creationTime: 0,
    duration: 0,
    projectLink: "",
    amount: [],
    creatorAddress: "",
    category: "",
  });
  const [timerString, setTimerString] = useState("");
  const [isOver, setIsOver] = useState(false);
  const location = useLocation();
  const { index } = location.state;
  const PRECISION = 10 ** 18;

  // func to update the progress bar everytime getProjectDetails() executes.
  // function updateProgressBar() {
  //   let progressBar = document.getElementsByClassName("progressBar")[0];
  //   progressBar.max = projectDetails.fundingGoal / PRECISION;
  //   progressBar.value = projectDetails.amountRaised / PRECISION;
  // }

  // fetch the project details from the smart contract
  async function getProjectDetails() {
    try {
      // fetching project information from the contract
      let res = await props.contract.getProject(parseInt(index)).then((res) => {
        let {
          amountRaised,
          cid,
          creatorName,
          fundingGoal,
          projectDescription,
          projectName,
          contributors,
          creationTime,
          duration,
          projectLink,
          amount,
          creatorAddress,
          refundPolicy,
          category,
          refundClaimed,
          claimedAmount,
        } = { ...res };

        let tmp = [];
        for (const index in contributors) {
          tmp.push({
            contributor: contributors[index],
            amount: amount[index],
            refundClaimed: refundClaimed[index],
          });
        }

        tmp.sort((a, b) => {
          return b.amount - a.amount;
        });

        let contributorsCopy = [];
        let amountCopy = [];
        let refundClaimedCopy = [];
        for (const index in tmp) {
          contributorsCopy.push(tmp[index].contributor);
          amountCopy.push(tmp[index].amount);
          refundClaimedCopy.push(tmp[index].refundClaimed);
        }

        setProjectDetails({
          amountRaised: amountRaised,
          cid: cid,
          creatorName: creatorName,
          fundingGoal: fundingGoal,
          projectDescription: projectDescription,
          projectName: projectName,
          contributors: contributorsCopy,
          creationTime: creationTime * 1,
          duration: duration,
          projectLink: projectLink,
          amount: amountCopy,
          creatorAddress: creatorAddress,
          refundPolicy: refundPolicy,
          category: category,
          refundClaimed: refundClaimedCopy,
          claimedAmount: claimedAmount,
        });
      });
    } catch (error) {
      alert("Error fetching details");
      console.log(error);
    }
  }

  useEffect(() => {
    getProjectDetails();
  }, []);

  useEffect(() => {
    getProjectDetails();
  }, [modalShow]);

  // useEffect hook to handle the countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = new Date().getTime() / 1000;
      const remainingTime =
        Number(projectDetails.creationTime) +
        Number(projectDetails.duration) -
        currentTime;
      const days = Math.floor(remainingTime / (60 * 60 * 24));
      const hours = Math.floor((remainingTime % (60 * 60 * 24)) / (60 * 60));
      const minutes = Math.floor((remainingTime % (60 * 60)) / 60);
      const seconds = Math.floor(remainingTime % 60);

      setTimerString(`${days}d ${hours}h ${minutes}m ${seconds}s`);

      if (remainingTime < 0) {
        setTimerString("0d 0h 0m 0s");
        clearInterval(interval);
        // this condition is set because at initial render, creationTime and duration state are not set
        // so remaining time turns out to be negative
        if (projectDetails.creationTime > 0) {
          setIsOver(true);
        }
      }
    }, 1000);

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [projectDetails.creationTime, projectDetails.duration]);

  // sets the condition true for payment modal to render
  function onClickPayment() {
    setModalShow(true);
  }

  // return category code
  function getCategoryFromCode(val) {
    let categoryCode = ["Design & Tech", "Film", "Arts", "Games"];
    if (val >= 0 && val < 4) return categoryCode[val];
  }

  // convert epoch time format to dd/mm/yyyy format
  function displayDate(val) {
    let date = new Date(val * 1000);
    return (
      date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
    );
  }

  // check if user is the project owner
  function isOwner() {
    return props.userAddress === projectDetails.creatorAddress;
  }

  // check if claiming fund is possible for the project owner
  function claimFundCheck() {
    return projectDetails.refundPolicy
      ? projectDetails.amountRaised / PRECISION
      : projectDetails.amountRaised >= projectDetails.fundingGoal;
  }

  // claim fund by calling function in the smart contract
  async function claimFund() {
    let txn;
    try {
      txn = await props.contract.claimFund(parseInt(index));
      await txn.wait(txn);
      alert("Fund succesfully claimed");

      setProjectDetails({
        amountRaised: projectDetails.amountRaised,
        cid: projectDetails.cid,
        creatorName: projectDetails.creatorName,
        fundingGoal: projectDetails.fundingGoal,
        projectDescription: projectDetails.projectDescription,
        projectName: projectDetails.projectName,
        contributors: projectDetails.contributors,
        creationTime: projectDetails.creationTime * 1,
        duration: projectDetails.duration,
        projectLink: projectDetails.projectLink,
        amount: projectDetails.amount,
        creatorAddress: projectDetails.creatorAddress,
        refundPolicy: projectDetails.refundPolicy,
        category: projectDetails.category,
        refundClaimed: projectDetails.refundClaimed,
        claimedAmount: true,
      });
    } catch (error) {
      alert("Error claiming fund: " + error);
      console.log(error);
    }
  }

  // check if the user is a contributor to the project
  function checkIfContributor() {
    let idx = getContributorIndex();
    return idx < 0 ? false : true;
  }

  // get the contributor index of the user in the contributor[]
  function getContributorIndex() {
    let idx = projectDetails.contributors.indexOf(props.userAddress);
    return idx;
  }

  // check if claiming refund is possible for the user
  function claimRefundCheck() {
    return projectDetails.refundPolicy
      ? false
      : projectDetails.amountRaised < projectDetails.fundingGoal;
  }

  // claim refund by calling the function in the smart contract
  async function claimRefund() {
    let txn;
    try {
      txn = await props.contract.claimRefund(parseInt(index));
      await txn.wait(txn);
      alert("Refund claimed succesfully");
      let refundClaimedCopy = [...projectDetails.refundClaimed];
      refundClaimedCopy[getContributorIndex()] = true;

      setProjectDetails({
        amountRaised: projectDetails.amountRaised,
        cid: projectDetails.cid,
        creatorName: projectDetails.creatorName,
        fundingGoal: projectDetails.fundingGoal,
        projectDescription: projectDetails.projectDescription,
        projectName: projectDetails.projectName,
        contributors: projectDetails.contributors,
        creationTime: projectDetails.creationTime * 1,
        duration: projectDetails.duration,
        projectLink: projectDetails.projectLink,
        amount: projectDetails.amount,
        creatorAddress: projectDetails.creatorAddress,
        refundPolicy: projectDetails.refundPolicy,
        category: projectDetails.category,
        refundClaimed: refundClaimedCopy,
        claimedAmount: true,
      });
    } catch (error) {
      alert("Error claiming refund: " + error);
      console.log(error);
    }
  }

  return (
    <>
      <div className="px-16 my-10">
        <div className="flex gap-14 bg-[#f5f7f8] p-10 rounded-3xl">
          <img
            className="bg-no-repeat bg-contain bg-center h-[450px] rounded-3xl"
            src={
              projectDetails.cid
                ? `url(${"https://" + projectDetails.cid})`
                : dummyPic
            }
            alt="Project_Picture"
          />
          <div className="w-full">
            <h1 className="text-[#111] text-3xl font-bold first-letter:uppercase">
              {projectDetails?.projectName}
            </h1>
            <h3 className="mt-1 text-sm">
              Checkout Campaign:{" "}
              <a
                className="projectLink"
                target="_blank"
                href={projectDetails.projectLink}
                rel="noreferrer"
              >
                {projectDetails.projectLink.slice(0, 40) + "..."}
              </a>{" "}
            </h3>
            <div className="text-[#111] first-letter:uppercase text-xl mt-4 w-[100%]">
              <div>
                <div class="mb-2 w-[80%] flex justify-between items-center">
                  <h3 class="text-base font-semibold text-gray-800 dark:text-[#111]">
                    Funds Collected (
                    {(
                      (projectDetails?.amountRaised /
                        projectDetails?.fundingGoal) *
                      100
                    ).toFixed(2) + "%"}
                    )
                  </h3>
                  <div>
                    <span class="text-base text-gray-800 dark:text-[#111]">
                      {Number(projectDetails?.amountRaised / PRECISION)} raised
                      out of {Number(projectDetails?.fundingGoal / PRECISION)}{" "}
                      AVAX
                    </span>
                  </div>
                </div>
                <div
                  className="flex w-[80%] h-3 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700"
                  role="progressbar"
                  aria-valuenow="25"
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  <div
                    className="flex flex-col justify-center rounded-full overflow-hidden bg-blue-600 text-xs text-[#111] text-center whitespace-nowrap transition duration-500 dark:bg-blue-500"
                    style={{
                      width: `${(
                        (projectDetails?.amountRaised /
                          projectDetails?.fundingGoal) *
                        100
                      ).toFixed(2)}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="mt-2 flex justify-between w-[80%] items-center">
              <p className=" flex items-center gap-1 text-lg">
                <MdOutlineCategory /> Category:{" "}
                {getCategoryFromCode(projectDetails.category)}
              </p>
              <p className="projectLinkLabel">
                Created On:{" "}
                <span className="font-bold">
                  {displayDate(projectDetails.creationTime)}
                </span>
              </p>
            </div>
            <div className="mt-5 flex justify-between w-[80%]">
              <h4>
                Backed by :{" "}
                <span className="font-bold">
                  {projectDetails?.contributors?.length}
                </span>
              </h4>
              <h2>
                {!isOver ? (
                  <>
                    <span className="font-bold">{timerString}</span> Time Left
                  </>
                ) : (
                  "Funding duration over!!"
                )}
              </h2>
            </div>

            <p className="projectLinkLabel">
              Refund Policy:{" "}
              {projectDetails.refundPolicy ? "Non-Refundable " : "Refundable"}
            </p>

            <p className="projectLinkLabel">
              Owner:
              <Link
                className="projectLinkLabel"
                to="/profile"
                state={{
                  address: projectDetails.creatorAddress,
                  name: projectDetails.creatorName,
                }}
              >
                {" " + projectDetails.creatorName}
              </Link>
            </p>
            {!isOver ? (
              !isOwner() && (
                <Popup
                  trigger={
                    <button className="bg-[#55C8ED] px-6 py-2 mt-5 hover:bg-[#111] hover:text-white flex items-center">
                      Fund this Campaign <GiPayMoney />
                    </button>
                  }
                  modal
                >
                  {(close) => (
                    <PaymentModal
                      setModalShow={setModalShow}
                      contract={props.contract}
                      index={index}
                      projectDetails={projectDetails}
                      setProjectDetails={setProjectDetails}
                      userAddress={props.userAddress}
                      close={close}
                    />
                  )}
                </Popup>
              )
            ) : isOwner() ? (
              claimFundCheck() && !projectDetails.claimedAmount ? (
                <button
                  className="bg-[#55C8ED] px-6 py-2 mt-5 hover:bg-[#111] hover:text-white"
                  onClick={() => claimFund()}
                >
                  Claim Fund
                </button>
              ) : projectDetails.claimedAmount ? (
                <h2 className="text-red-600 text-2xl my-2 font-bold">
                  Fund claimed!
                </h2>
              ) : (
                ""
              )
            ) : checkIfContributor() &&
              claimRefundCheck() &&
              !projectDetails.refundClaimed[getContributorIndex()] ? (
              <button
                className="bg-[#55C8ED] px-6 py-2 mt-5 hover:bg-[#111] hover:text-white"
                onClick={() => claimRefund()}
              >
                Claim Refund
              </button>
            ) : projectDetails.refundClaimed[getContributorIndex()] ? (
              <h2 className="text-red-600 text-2xl my-2 font-bold">
                Refund Claimed!
              </h2>
            ) : (
              ""
            )}
          </div>
        </div>
        {modalShow && (
          <PaymentModal
            setModalShow={setModalShow}
            contract={props.contract}
            index={index}
            projectDetails={projectDetails}
            setProjectDetails={setProjectDetails}
            userAddress={props.userAddress}
          />
        )}
      </div>

      <div className="px-16 my-10 text-[#EEE]">
        <div className="flex justify-center">
          <div className="w-[50%]">
            <h1 className="text-2xl font-bold mb-4">Story 📝</h1>
            <p className="italic text-lg ms-5">
              {projectDetails?.projectDescription}
            </p>
          </div>
          <div className="w-[50%]">
            <div className="text-2xl font-bold mb-4">Contributors💲</div>
            {projectDetails.contributors.length > 0 ? (
              <table className="w-full text-center ">
                <thead className="bg-white text-[#111]">
                  <th className="pb-2">Sr No.</th>
                  <th className="pb-2">Suppoters</th>
                  <th className="pb-2">Amount</th>
                </thead>
                <tbody>
                  {projectDetails.contributors.length > 0 ? (
                    projectDetails.contributors.map((contributor, idx) => (
                      <tr className="border-b border-blue-gray-200">
                        <td className="p-1">{idx + 1}</td>
                        <td className="p-1">{contributor}</td>
                        <td className="p-1">
                          {projectDetails.amount[idx] / PRECISION}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <div className="noProjects">No contributors yet</div>
                  )}
                </tbody>
              </table>
            ) : (
              <div className="noProjects">No contributors yet</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ProjectComponent;

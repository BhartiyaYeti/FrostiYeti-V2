import PaymentModal from "./PaymentModal";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import dummyPic from "../assets/placeholderImage.jpg";

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
            <h1 className="text-[#111] text-4xl uppercase">
              {projectDetails?.projectName}
            </h1>
            <div className="text-[#111] first-letter:uppercase text-xl mt-8 w-[100%]">
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
                  <span class="text-base text-gray-800 dark:text-[#111]">
                    {Number(projectDetails?.amountRaised / PRECISION)} raised
                    out of {Number(projectDetails?.fundingGoal / PRECISION)}{" "}
                    AVAX
                  </span>
                </div>
                <div
                  className="flex w-[80%] h-2 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700"
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
            <h4 className="mt-5">
              Backed by : {projectDetails?.contributors?.length}
            </h4>
            <p className="projectLinkLabel">
              Category: {getCategoryFromCode(projectDetails.category)}
            </p>
            <p className="projectLinkLabel">
              Creation date: {displayDate(projectDetails.creationTime)}
            </p>
            <p className="projectLinkLabel">
              Refund Policy:{" "}
              {projectDetails.refundPolicy ? "Non-Refundable " : "Refundable"}
            </p>
            <p className="projectLinkLabel">
              Project link:
              <a
                className="projectLink"
                target="_blank"
                href={projectDetails.projectLink}
              >
                {projectDetails.projectLink}
              </a>
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
            <div className="remainingDaysContainer">
              <h2>{!isOver ? timerString : "Funding duration over!!"}</h2>
            </div>
            {!isOver && (
              <p className="afterRemainingDaysContainer">
                time left for funding
              </p>
            )}
            {!isOver ? (
              !isOwner() && (
                <div className="supportButtonContainer">
                  <button
                    className="supportButton"
                    onClick={() => onClickPayment()}
                  >
                    Back this project
                  </button>
                </div>
              )
            ) : isOwner() ? (
              claimFundCheck() && !projectDetails.claimedAmount ? (
                <div className="supportButtonContainer">
                  <button className="supportButton" onClick={() => claimFund()}>
                    Claim Fund
                  </button>
                </div>
              ) : projectDetails.claimedAmount ? (
                <h2 style={{ color: "red" }}>Fund claimed!</h2>
              ) : (
                ""
              )
            ) : checkIfContributor() &&
              claimRefundCheck() &&
              !projectDetails.refundClaimed[getContributorIndex()] ? (
              <div className="supportButtonContainer">
                <button className="supportButton" onClick={() => claimRefund()}>
                  Claim Refund
                </button>
              </div>
            ) : projectDetails.refundClaimed[getContributorIndex()] ? (
              <h2 style={{ color: "red" }}>Refund Claimed!</h2>
            ) : (
              ""
            )}
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
        </div>
      </div>

      <div className="px-16 my-10 text-[#EEE]">
        <div className="projectBottomContainer">
          <div className="aboutContainer">
            <h1 className="about">About</h1>
            <p className="description">{projectDetails?.projectDescription}</p>
          </div>
        </div>
        <div className="contributorHeader">Contributors</div>
        <div className="contributors">
          <div className="tableRow header">
            <div className="item border" style={{ width: "80px" }}>
              Sno.
            </div>
            <div className="item border">Address</div>
            <div className="item border">Amount</div>
          </div>
          {projectDetails.contributors.length > 0 ? (
            projectDetails.contributors.map((contributor, idx) => (
              <div
                className={
                  "tableRow " + (idx % 2 === 0 ? "darkRow" : "lightRow")
                }
                key={idx}
              >
                <div className="item border" style={{ width: "80px" }}>
                  {idx + 1 + "."}
                </div>
                <div className="item border">{contributor}</div>
                <div className="item border">
                  {projectDetails.amount[idx] / PRECISION}
                </div>
              </div>
            ))
          ) : (
            <div className="noProjects">No contributors yet</div>
          )}
        </div>
      </div>
    </>
  );
}

export default ProjectComponent;

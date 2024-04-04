import { useEffect, useState } from "react";
import CategoryComponent from "./CategoryComponent";
import ScrollShowbarComponent from "./ScrollShowbarComponent";
import { Link } from "react-router-dom";
import dummyPic from "../assets/placeholderImage.jpg";
import $ from "jquery";
export default function HomeComponent(props) {
  const PRECISION = 10 ** 18;
  const [stats, setStats] = useState({
    projects: 0,
    fundings: 0,
    contributors: 0,
  });
  const [featuredRcmd, setFeaturedRcmd] = useState([]);
  const [recentUploads, setRecentUploads] = useState([]);
  const getAllProjects = async () => {
    try {
      let res = await props.contract.getAllProjectsDetail().then((res) => {
        let tmp = [];
        let amount = 0,
          contrib = 0;
        for (const index in res) {
          let {
            amountRaised,
            cid,
            creatorName,
            fundingGoal,
            projectDescription,
            projectName,
            totalContributors,
          } = { ...res[index] };
          tmp.push({
            amountRaised,
            cid,
            creatorName,
            fundingGoal,
            projectDescription,
            projectName,
            totalContributors,
            index,
          });
          amount += Number(amountRaised / PRECISION);
          contrib += Number(totalContributors);
        }
        setStats({
          projects: tmp.length,
          fundings: amount,
          contributors: contrib,
        });
        return tmp;
      });
      res.sort((a, b) => {
        return b.totalContributors * 1 - a.totalContributors * 1;
      });
      setFeaturedRcmd(res.slice(0, 4));
      setRecentUploads(res.slice(4, 24));
    } catch (err) {
      alert(err);
      console.log(err);
    }
  };

  const renderRecommendations = (val) => {
    return val.map((project, index) => {
      return (
        <div className="flex justify-center">
          <div
            className=" rounded-xl hover:scale-105"
            key={index}
            style={
              index % 2 === 0
                ? { background: "#55C8ED" }
                : { background: "#EEEEEE" }
            }
          >
            <Link to="/project" state={{ index: project.index }}>
              <img
                className="w-[300px] rounded-t-xl"
                src={
                  project.cid ? `url(${"https://" + project.cid})` : dummyPic
                }
                alt="Project_Image"
              />
            </Link>
            <div className="px-5 py-2">
              <h1 className="font-bold text-xl">{project.projectName}</h1>
              <div className="">
                {((project.amountRaised / project.fundingGoal) * 100).toFixed(
                  2
                ) + "% Funded"}
              </div>
              <div className="">{"- By " + project.creatorName}</div>
              <Link to="/project" state={{ index: project.index }}>
                <p className="underline">View More Details💸</p>
              </Link>
            </div>
          </div>
        </div>
      );
    });
  };

  useEffect(() => {
    getAllProjects();
  }, []);

  console.log(featuredRcmd[0]);
  return (
    <>
      <CategoryComponent isHome={true} />
      {/* siteStats */}
      <div className="">
        <div className="text-white text-center my-10 text-3xl">
          Empowering Every <span className="text-[#55C8ED] ">Student's </span>
          Dream, One{" "}
          <span className="decoration-sky-500 underline">Fundraiser</span> At a
          Time.
        </div>

        <div className="flex gap-20 justify-center mt-14">
          <div className="bg-[#EEEEEE] text-black w-[200px] h-[120px] flex-col text-center py-6 rounded-md hover:scale-105 hover:cursor-pointer hover:bg-[#55C8ED]">
            <h1 className="text-3xl font-bold">{stats.projects}</h1>
            <h3 className="text-xl mt-3">Projects🔯</h3>
          </div>
          <div className="bg-[#EEEEEE] text-black w-[200px] h-[120px] flex-col text-center py-6 rounded-md hover:scale-105 hover:cursor-pointer hover:bg-red-400">
            <h1 className="text-3xl font-bold">
              {stats.fundings.toFixed(3) + " AVAX"}
            </h1>
            <h3 className="text-xl mt-3">Funds Raised💵</h3>
          </div>{" "}
          <div className="bg-[#EEEEEE] text-black w-[200px] h-[120px] flex-col text-center py-6 rounded-md hover:scale-105 hover:cursor-pointer hover:bg-[#55C8ED]">
            <h1 className="text-3xl font-bold">{stats.contributors}</h1>
            <h3 className="text-xl mt-3">contributors👤</h3>
          </div>
        </div>

        {featuredRcmd.length !== 0 ? (
          <>
            <div className="mt-10 p-10 px-16">
              <h1 className="text-[#f5f7f8] text-2xl font-bold mb-10">
                Project Of the Day!🌟
              </h1>
              <div className="flex gap-10 bg-[#f5f7f8] p-10 rounded-3xl">
                <img
                  className="bg-no-repeat bg-contain bg-center h-[450px] rounded-3xl"
                  src={
                    featuredRcmd[0].cid
                      ? `url(${"https://" + featuredRcmd[0].cid})`
                      : dummyPic
                  }
                  alt="Project_Photo"
                />
                <div>
                  <div className="text-[#111] first-letter:uppercase text-3xl pt-5 font-bold">
                    {featuredRcmd[0].projectName}🔥
                  </div>
                  <div className="text-[#111] first-letter:uppercase text-xl mt-3 w-[80%]">
                    {featuredRcmd[0].projectDescription.slice(0, 150) + "..."}
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Officiis veritatis labore totam saepe quasi natus repellat
                    deleniti? Laboriosam magni cum mollitia dignissimos
                    laudantium, assumenda atque accusamus, ipsam quod similique
                    quas.
                  </div>
                  <div className="text-[#111] first-letter:uppercase text-xl mt-8 w-[60%]">
                    <div>
                      <div class="mb-2 w-[80%] flex justify-between items-center">
                        <h3 class="text-base font-semibold text-gray-800 dark:text-[#111]">
                          Funds Collected (
                          {(
                            (featuredRcmd[0].amountRaised /
                              featuredRcmd[0].fundingGoal) *
                            100
                          ).toFixed(2) + "%"}
                          )
                        </h3>
                        <span class="text-base text-gray-800 dark:text-[#111]">
                          {Number(featuredRcmd[0].amountRaised / PRECISION)} out
                          of {Number(featuredRcmd[0].fundingGoal / PRECISION)}{" "}
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
                              (featuredRcmd[0].amountRaised /
                                featuredRcmd[0].fundingGoal) *
                              100
                            ).toFixed(2)}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="text-[#111] first-letter:uppercase text-md mt-3">
                    - Campaign By{" "}
                    <span className="text-[#f44] first-letter:uppercase">
                      {featuredRcmd[0].creatorName}
                    </span>
                  </div>
                  <Link to="/project" state={{ index: featuredRcmd[0].index }}>
                    <button className="bg-[#55C8ED] px-6 py-2 mt-5 hover:bg-[#111] hover:text-white">
                      View Campaign
                    </button>
                  </Link>
                </div>
              </div>
              <div>
                <h1 className="text-[#f5f7f8] text-2xl font-bold my-10 ">
                  Tranding Campaigns🔥
                </h1>
              </div>
              <div className="flex gap-10">
                {renderRecommendations(recentUploads.slice(1, 5))}
              </div>
            </div>
          </>
        ) : (
          <div className="noProjects">No projects found</div>
        )}
      </div>
      {/* <ScrollShowbarComponent
        recentUploads={recentUploads}
        heading={"Recent Campaigns🔥"}
        emptyMessage={"No recent Campaigns!"}
      /> */}
    </>
  );
}

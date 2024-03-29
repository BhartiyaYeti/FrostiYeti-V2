import { useEffect, useState } from "react";
import CategoryComponent from "./CategoryComponent";
import ScrollShowbarComponent from "./ScrollShowbarComponent";
import { Link } from "react-router-dom";
import dummyPic from "../assets/pg1.jpg";
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
        <div className="">
          <div
            className="recommendationCard"
            key={index}
            style={
              index % 2 === 0
                ? { background: "#76ABAE" }
                : { background: "#EEEEEE" }
            }
          >
            <Link to="/project" state={{ index: project.index }}>
              <img
                className="rcmdCardImg"
                src={
                  project.cid ? `url(${"https://" + project.cid})` : dummyPic
                }
                alt="Project_Image"
              />
            </Link>
            <div className="rcmdCardDetails mt-3">
              <div className="font-bold text-xl">
                <Link to="/project" state={{ index: project.index }}>
                  {project.projectName}
                </Link>
              </div>
              <div className="rcmdCardFundedPercentage">
                {((project.amountRaised / project.fundingGoal) * 100).toFixed(
                  2
                ) + "% Funded"}
              </div>
              <div className="rcmdCardAuthor">
                {"By " + project.creatorName}
              </div>
            </div>
          </div>
        </div>
      );
    });
  };

  useEffect(() => {
    getAllProjects();
  }, []);

  return (
    <>
      <CategoryComponent isHome={true} />
      {/* siteStats */}
      <div className="siteStats">
        <div className="tagLine">
          Empowering every student's dream, one fundraiser at a time.
        </div>

        <div className="flex gap-20 justify-center">
          <div className="bg-[#76ABAE] text-black w-[200px] h-[120px] flex-col text-center py-6 rounded-lg hover:scale-105 hover:cursor-pointer">
            <h1 className="text-3xl font-bold">{stats.projects}</h1>
            <h3 className="text-xl">Projects🔯</h3>
          </div>
          <div className="bg-red-400 text-black w-[200px] h-[120px] flex-col text-center py-6 rounded-lg hover:scale-105 hover:cursor-pointer">
            <h1 className="text-3xl font-bold">{stats.fundings + " AVAX"}</h1>
            <h3 className="text-xl">Funds Raised💵</h3>
          </div>{" "}
          <div className="bg-[#EEEEEE] text-black w-[200px] h-[120px] flex-col text-center py-6 rounded-lg hover:scale-105 hover:cursor-pointer">
            <h1 className="text-3xl font-bold">{stats.contributors}</h1>
            <h3 className="text-xl">contributors👤</h3>
          </div>
        </div>

        {featuredRcmd.length !== 0 ? (
          <>
            <div className="mt-10 p-10 bg-[#18191A]">
              <h1 className="text-[#f5f7f8] text-2xl font-bold mb-10">
                Project Of the Day!🌟
              </h1>
              <div className="flex gap-10">
                <Link to="/project" state={{ index: featuredRcmd[0].index }}>
                  <div>
                    <img
                      className="bg-white bg-no-repeat bg-contain bg-center h-[350px] rounded-xl"
                      src={
                        featuredRcmd[0].cid
                          ? `url(${"https://" + featuredRcmd[0].cid})`
                          : dummyPic
                      }
                      alt="Project_Photo"
                    />
                  </div>
                </Link>
                <div>
                  <div className="text-[#f5f7f8] uppercase text-3xl pt-10">
                    <Link
                      to="/project"
                      state={{ index: featuredRcmd[0].index }}
                    >
                      {featuredRcmd[0].projectName}
                    </Link>
                  </div>
                  <div className="text-[#f5f7f8] uppercase text-xl ">
                    {featuredRcmd[0].projectDescription}
                  </div>
                  <div className="text-[#f5f7f8] uppercase text-md ">
                    {"By " + featuredRcmd[0].creatorName}
                  </div>
                </div>
              </div>
              <div>
                <h1 className="text-[#f5f7f8] text-2xl font-bold my-10">
                  Explore More Projects...
                </h1>
              </div>
              <div>{renderRecommendations(featuredRcmd.slice(1, 4))}</div>
            </div>
          </>
        ) : (
          <div className="noProjects">No projects found</div>
        )}
        <ScrollShowbarComponent
          recentUploads={recentUploads}
          heading={"Recent Uploads🔥"}
          emptyMessage={"No recent uploads"}
        />
      </div>
    </>
  );
}

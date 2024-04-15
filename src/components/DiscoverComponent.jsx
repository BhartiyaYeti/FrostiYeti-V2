import CategoryComponent from "./CategoryComponent";
import { useEffect, useState } from "react";
import dummyPic from "../assets/placeholderImage.jpg";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export default function DiscoverComponent(props) {
  const location = useLocation();
  const [filter, setFilter] = useState(
    location?.state?.selected >= 0 ? location.state.selected : -1
  );
  const [projects, setProjects] = useState([]);
  const changeFilter = (val) => {
    setFilter(val);
  };
  const getAllProjects = async () => {
    try {
      let res = await props.contract.getAllProjectsDetail().then((res) => {
        let tmp = [];
        for (const index in res) {
          let {
            amountRaised,
            cid,
            creatorName,
            fundingGoal,
            projectDescription,
            projectName,
            totalContributors,
            category,
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
            category,
          });
        }
        return tmp;
      });

      if (filter !== -1) {
        let tmp = [];
        for (const index in res) {
          if (res[index].category === filter) {
            tmp.push(res[index]);
          }
        }
        res = tmp;
      }

      setProjects(res);
    } catch (err) {
      alert(err);
      console.log(err);
    }
  };
  const renderCards = () => {
    return projects.reverse().map((project, index) => {
      return (
        <Link to="/project" state={{ index: project.index }} key={index}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            transition={{ duration: `1.${index}`, ease: "linear" }}
            variants={{
              visible: { opacity: 1, x: 0 },
              hidden: { opacity: 0, x: -100 },
            }}
            className=""
          >
            <div className="mb-10 bg-[#31363F] w-max p-3 rounded-xl h-[350px]">
              <img
                className="w-[350px] rounded-xl"
                src={
                  project.cid ? `url(${"https://" + project.cid})` : dummyPic
                }
                alt=""
              />
              <div className="">
                <div className="text-[#EEE] text-md mt-5">
                  Campaign: {project.projectName}
                </div>
                <div className="text-[#EEE] text-md w-[300px]">
                  About Campaign:{" "}
                  {project.projectDescription.slice(0, 50) + "..."}
                </div>
                <div className="text-[#EEE] first-letter:uppercase text-md mt-3">
                  Campaign By{"  "}
                  <span className="text-[#55C8ED] first-letter:uppercase">
                    {project.creatorName}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </Link>
      );
    });
  };

  useEffect(() => {
    getAllProjects();
  }, [filter]);

  return (
    <>
      <CategoryComponent
        filter={filter}
        changeCategory={(val) => changeFilter(val)}
      />
      <div className="">
        <center>
          <div className="text-4xl font-bold text-[#55C8ED] px-10 mt-10">
            Explore<span className="text-white">!</span>
          </div>
        </center>
        <div className="flex flex-wrap gap-x-16 gap-y-10 mt-10 px-10 min-h-min justify-center">
          {projects.length !== 0 ? (
            renderCards()
          ) : (
            <div className="noProjects">No projects found</div>
          )}
        </div>
      </div>
    </>
  );
}

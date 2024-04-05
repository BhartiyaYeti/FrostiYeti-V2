import { Link } from "react-router-dom";
import { BsArrowLeftCircle, BsArrowRightCircle } from "react-icons/bs";
import dummyPic from "../assets/placeholderImage.jpg";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { motion } from "framer-motion";

export default function ScrollShowbarComponent(props) {
  const scroll = (val) => {
    document.getElementsByClassName("recentUploadsContainer")[0].scrollLeft +=
      val;
  };
  const renderCards = () => {
    return props.recentUploads.map((project, index) => {
      return (
        <motion.div
          initial="hidden"
          whileInView="visible"
          transition={{ duration: `1.${index}`, ease: "linear" }}
          variants={{
            visible: { opacity: 1, x: 0 },
            hidden: { opacity: 0, x: -100 },
          }}
          className="w-[300px]"
          key={index}
        >
          <Link to="/project" state={{ index: project.index }}>
            <img
              className=""
              src={project.cid ? `url(${"https://" + project.cid})` : dummyPic}
              alt="Project_Image"
            />
          </Link>
          <div className="">
            <Link
              to="/project"
              state={{ index: project.index }}
              className="text-white"
            >
              {project.projectName}
            </Link>
            <div className="">
              {project.projectDescription.slice(0, 5) + "..."}
            </div>
            <div className="">{"By " + project.creatorName}</div>
          </div>
        </motion.div>
      );
    });
  };
  return (
    <div className="px-16">
      <div className=" text-[#f5f7f8] text-2xl font-bold mb-10">
        {props.heading}
      </div>

      <div className="flex flex-wrap gap-10">
        {props.recentUploads.length ? (
          <>{renderCards()}</>
        ) : (
          <div className="noProjects">{props.emptyMessage}</div>
        )}
      </div>
    </div>
  );
}

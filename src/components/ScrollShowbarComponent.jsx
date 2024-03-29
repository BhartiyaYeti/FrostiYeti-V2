import { Link } from "react-router-dom";
import { BsArrowLeftCircle, BsArrowRightCircle } from "react-icons/bs";
import dummyPic from "../assets/placeholderImage.jpg";

export default function ScrollShowbarComponent(props) {
  const scroll = (val) => {
    document.getElementsByClassName("recentUploadsContainer")[0].scrollLeft +=
      val;
  };
  const renderCards = () => {
    return props.recentUploads.map((project, index) => {
      return (
        <div className="projectCard" key={index}>
          <Link to="/project" state={{ index: project.index }}>
            <div className="cardImg">
              {" "}
              <img
                className="cardImg"
                src={
                  project.cid ? `url(${"https://" + project.cid})` : dummyPic
                }
                alt="Project_Image"
              />
            </div>
          </Link>
          <div className="cardDetail">
            <div className="cardTitle">
              <Link to="/project" state={{ index: project.index }}>
                {project.projectName}
              </Link>
            </div>
            <div className="cardDesc">
              {project.projectDescription.slice(0, 5) + "..."}
            </div>
            <div className="cardAuthor">{"By " + project.creatorName}</div>
          </div>
        </div>
      );
    });
  };
  return (
    <div className="recentUploads  bg-[#18191A]">
      <div className="recentUploadsHeader">
        <div className="recentUploadsHeading">{props.heading}</div>
        {props.recentUploads.length ? (
          <div className="scrollButtons">
            <BsArrowLeftCircle
              className="scrollNavBtn"
              onClick={() => scroll(-300)}
            />
            <BsArrowRightCircle
              className="scrollNavBtn"
              onClick={() => scroll(300)}
            />
          </div>
        ) : (
          ""
        )}
      </div>

      <div className="recentUploadsContainer">
        {props.recentUploads.length ? (
          renderCards()
        ) : (
          <div className="noProjects">{props.emptyMessage}</div>
        )}
      </div>
    </div>
  );
}

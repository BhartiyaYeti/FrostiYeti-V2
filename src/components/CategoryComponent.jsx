import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
export default function CategoryComponent(props) {
  const navigate = useNavigate();
  const onClickFilter = (val) => {
    if (!props.isHome) {
      if (props.filter !== val) {
        props.changeCategory(val);
      } else {
        props.changeCategory(-1);
        document.getElementsByClassName(" ")[val].blur();
      }
    } else {
      navigate("discover", {
        state: {
          selected: val,
        },
      });
    }
  };
  const setSelectedFocus = () => {
    props.filter !== -1 &&
      document.getElementsByClassName(" ")[props.filter]?.focus();
  };
  useEffect(() => {
    setSelectedFocus();
  }, []);
  return (
    <div className="flex text-white gap-10 justify-center">
      <h1
        className=" text-base hover:underline-offset-8 hover:underline hover:cursor-pointer decoration-sky-500"
        tabIndex="1"
        onClick={() => onClickFilter(0)}
      >
        Design & tech
      </h1>
      <h1
        className=" text-base hover:underline-offset-8 hover:underline hover:cursor-pointer decoration-sky-500"
        tabIndex="1"
        onClick={() => onClickFilter(1)}
      >
        Education
      </h1>
      <h1
        className=" text-base hover:underline-offset-8 hover:underline hover:cursor-pointer decoration-sky-500"
        tabIndex="1"
        onClick={() => onClickFilter(2)}
      >
        Research
      </h1>
    </div>
  );
}

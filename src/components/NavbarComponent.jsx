import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function NavbarComponent(props) {
  const navigate = useNavigate();
  return (
    <nav>
      <div className="flex justify-between px-16 py-5 align-middle items-baseline">
        <motion.div
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 1 }}
          variants={{
            visible: { opacity: 1, x: 0 },
            hidden: { opacity: 0, x: -150 },
          }}
          className="text-white text-4xl font-bold hover:cursor-pointer"
          onClick={() => navigate("/")}
        >
          EduLink<span className="text-[#55C8ED]">!</span>
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 1.5 }}
          variants={{
            visible: { opacity: 1 },
            hidden: { opacity: 0 },
          }}
          className="text-white flex gap-10 px-16"
        >
          <h4
            onClick={() => navigate("discover")}
            className="text-lg hover:underline-offset-8 hover:underline hover:cursor-pointer decoration-sky-500"
          >
            Explore
          </h4>
          <h4
            onClick={() => navigate("create_project")}
            className="text-lg hover:underline-offset-8 hover:underline hover:cursor-pointer decoration-sky-500"
          >
            Create Campaign
          </h4>
        </motion.div>
        <Link to="/profile" state={{ address: props?.address }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 1 }}
            variants={{
              visible: { opacity: 1, x: 0 },
              hidden: { opacity: 0, x: 10 },
            }}
            className="text-black bg-[#55C8ED] py-3 px-10 hover:bg-white transition ease-in-out font-bold"
          >
            {" "}
            {props?.address?.slice(0, 5) +
              "..." +
              props?.address?.slice(
                props?.address?.length - 4,
                props?.address?.length
              )}
          </motion.div>
        </Link>
      </div>
      <hr class="h-px mb-5 bg-gray-200 border-0 dark:bg-gray-800"></hr>
    </nav>
  );
}

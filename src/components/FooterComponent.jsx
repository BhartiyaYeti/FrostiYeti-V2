import { FaGithub, FaInstagram, FaTwitter } from "react-icons/fa";

export default function FooterComponent(props) {
  return (
    <footer class="bg-black">
      <div class="max-w-screen-xl px-4 py-3 mx-auto sm:px-6 lg:px-8">
        <div class="sm:flex sm:items-center sm:justify-between">
          <div class="flex justify-center text-[#c3edc0] sm:justify-start">
            <h1>&copy; {new Date().getFullYear()} Chain4Scholrs </h1>
          </div>

          <p class="mt-4 text-sm text-center text-gray-400 lg:text-right lg:mt-0 hover:cursor-pointer">
            T&C &nbsp; Privacy & Policy &nbsp; Developers
          </p>
        </div>
      </div>
    </footer>
  );
}

import { useRouter } from "next/router";

const Navbar = ({BackEvent}) => {
  const router = useRouter();
  return (
    <nav className="p-5 bg-transparent">
      <ul className="">
        <li className="w-fit cursor-pointer">
          <h1
          className="title"
            onClick={() => {
              document.querySelector(".container").classList.add("animate");
              setTimeout(() => {
                router.back();
              }, 600);
              BackEvent()
            }}
          >
            To Infinity
          </h1>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;

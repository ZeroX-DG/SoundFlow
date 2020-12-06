import * as React from "react";
import { Link, useLocation } from "react-router-dom";

const menu = [
  { icon: "magnify", label: "Discover", url: "/" },
  { icon: "play-box-multiple", label: "Playlists", url: "/playlists" }
];

export const SideBar = () => {
  const location = useLocation();

  return (
    <aside className="h-full w-64 bg-white bg-opacity-50 py-8">
      <ul className="list-none">
        {menu.map(item => {
          const isActive = location.pathname == item.url;
          return (
            <li
              className={`px-10 py-1 mb-6 font-medium border-indigo-600 ${
                isActive ? "border-r-4" : ""
              }`}
              key={item.url}
            >
              <Link
                to={item.url}
                className={`block cursor-pointer text-sm text-black hover:text-indigo-600 ${
                  isActive ? "text-indigo-600" : ""
                }`}
              >
                <span className={`mdi mdi-${item.icon}`}></span>
                <span className="ml-5">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

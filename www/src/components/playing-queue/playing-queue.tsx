import * as React from "react";

const playingQueue = [
  { title: "Burn the Witch", author: "Radiohead" },
  { title: "Daydream in Blue", author: "I Monster" },
  { title: "Archie, Marry Me", author: "Alvvays" }
];

export const PlayingQueue = () => {
  return (
    <aside className="h-full w-72 bg-white bg-opacity-50">
      <div className="p-5">
        <h1 className="text-2xl font-bold">Playing queue</h1>
      </div>
      <div style={{ height: "calc(100% - 72px)" }} className="overflow-y-auto">
        <ul className="list-none">
          {playingQueue.map((audio, index) => {
            const isActive = index == 0;
            return (
              <li
                className={`p-5 flex ${
                  !isActive ? "text-black text-opacity-50" : "text-indigo-600"
                }`}
                key={index}
              >
                <div className="pr-4 self-center text-2xl">
                  <span
                    className={`mdi mdi-${isActive ? "pause" : "play"}`}
                  ></span>
                </div>
                <div className="flex-grow">
                  <p className="font-bold mb-2">{audio.title}</p>
                  <p className="text-sm">{audio.author}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
};

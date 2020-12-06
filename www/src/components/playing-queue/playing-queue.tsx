import * as React from "react";
import { AppContext } from "../../app";

export const PlayingQueue = () => {
  const { state, dispatch } = React.useContext(AppContext);

  return (
    <aside className="h-full w-72 bg-white bg-opacity-50">
      <div className="p-5">
        <h1 className="text-2xl font-bold">Playing queue</h1>
      </div>
      <div style={{ height: "calc(100% - 72px)" }} className="overflow-y-auto">
        <ul className="list-none">
          {state.playQueue.map((track, index) => {
            const isActive = state.playQueueIndex == index;
            return (
              <li
                className={`p-5 flex ${
                  !isActive ? "text-black text-opacity-50" : "text-indigo-600"
                }`}
                key={index + track.url}
              >
                <div className="pr-4 self-center text-2xl">
                  <span
                    className={`mdi mdi-${isActive ? "pause" : "play"}`}
                  ></span>
                </div>
                <div className="flex-grow">
                  <p
                    className="font-bold mb-2 cursor-pointer"
                    onClick={() =>
                      dispatch({
                        type: "SET_PLAY_QUEUE_INDEX",
                        payload: index
                      })
                    }
                  >
                    {track.title}
                  </p>
                  <p className="text-sm">{track.author}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
};

import * as React from "react";
import { AppContext } from "../../app";

export const PlayingQueue = () => {
  const { state, dispatch } = React.useContext(AppContext);

  return (
    <aside className="h-full w-72 bg-white bg-opacity-50">
      <div className="p-5 flex justify-between">
        <h1 className="text-2xl font-bold">Playing queue</h1>
        <button
          title="Clear"
          onClick={() =>
            dispatch({
              type: "CLEAR_PLAY_QUEUE"
            })
          }
        >
          <span className="mdi mdi-autorenew text-2xl"></span>
        </button>
      </div>
      <div style={{ height: "calc(100% - 72px)" }} className="overflow-y-auto">
        {state.playQueue.length == 0 && (
          <div className="mt-10 text-center text-black text-opacity-40">
            <h1 className="font-bold text-xl">Queue is empty</h1>
            <p className="mt-3 px-5">
              Choose some tracks/playlists to add to this queue
            </p>
          </div>
        )}
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
                <div className="flex-grow text-sm">
                  <p
                    role="button"
                    className="font-bold mb-2 cursor-pointer overflow-hidden"
                    style={{
                      WebkitLineClamp: "2",
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical"
                    }}
                    onClick={() =>
                      dispatch({
                        type: "SET_PLAY_QUEUE_INDEX",
                        payload: index
                      })
                    }
                  >
                    {track.title}
                  </p>
                  <p>{track.author}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
};

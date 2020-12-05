import * as React from "react";
import { IPlaylist, AppContext } from "../app";
import { Link } from "react-router-dom";

const Playlist = ({
  playlist,
  isEditable,
  onDelete
}: {
  playlist: IPlaylist;
  isEditable: boolean;
  onDelete: () => void;
}) => {
  return (
    <div className="flex flex-col w-44 mx-9 mb-10">
      <section className="grid grid-cols-2 grid-rows-2 h-44 rounded-lg overflow-hidden shadow-lg relative">
        {playlist.songs.slice(0, 4).map(song => (
          <img
            key={song.url}
            src={song.thumbnail_url}
            className="block object-cover h-full"
          />
        ))}
        {isEditable && (
          <div
            className="w-full h-full rounded-full bg-red-500 bg-opacity-80 absolute flex items-center justify-center cursor-pointer"
            onClick={onDelete}
          >
            <span className="mdi mdi-delete text-white text-4xl"></span>
          </div>
        )}
      </section>
      <section className="mt-5">
        <Link to={`/playlist/${playlist._id}`}>
          <p className="font-bold text-center text-xl">{playlist.name}</p>
        </Link>
      </section>
    </div>
  );
};

export const Playlists = () => {
  const { state, dispatch } = React.useContext(AppContext);
  const [isEditable, setIsEditable] = React.useState(false);
  return (
    <div className="flex flex-col h-full">
      <div className="p-5 flex justify-between">
        <h1 className="text-2xl font-bold">Playlists</h1>
        <button onClick={() => setIsEditable(!isEditable)}>
          {isEditable ? (
            <span className="mdi mdi-close text-2xl"></span>
          ) : (
            <span className="mdi mdi-pencil-outline text-2xl"></span>
          )}
        </button>
      </div>
      <div className="p-5 flex flex-1 flex-wrap overflow-auto">
        {state.playlists.map(playlist => (
          <Playlist
            key={playlist._id}
            playlist={playlist}
            isEditable={isEditable}
            onDelete={() => {
              dispatch({
                type: "REMOVE_PLAYLIST",
                payload: playlist._id
              });
            }}
          />
        ))}
        {/*This is for the extra space when overflowing*/}
        <div className="block w-full h-2"></div>
      </div>
    </div>
  );
};

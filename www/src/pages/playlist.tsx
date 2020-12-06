import * as React from "react";
import { useParams } from "react-router-dom";
import { AppContext, IPlaylist } from "../app";
import { ITrackInfo } from "../services/api";

const PlaylistHeader = ({
  playlist,
  onPlayAll
}: {
  playlist: IPlaylist;
  onPlayAll: () => void;
}) => {
  return (
    <div className="p-10 flex items-end">
      <div className="grid grid-cols-2 grid-rows-2 w-44 h-44 rounded-lg overflow-hidden shadow-lg">
        {playlist.songs.slice(0, 4).map(song => (
          <img
            key={song.url}
            src={song.thumbnail_url}
            className="block object-cover h-full"
          />
        ))}
      </div>
      <div className="px-8">
        <h1 className="font-bold text-4xl text-black">{playlist.name}</h1>
        <p className="text-black text-lg mt-2">
          {playlist.songs.length} song{playlist.songs.length > 1 ? "s" : ""}
        </p>
        <div className="mt-5">
          <button
            className="bg-indigo-500 rounded-full text-white px-8 py-2 font-bold"
            onClick={() => onPlayAll()}
          >
            Play all
          </button>
        </div>
      </div>
    </div>
  );
};

const PlaylistSongList = ({
  playlist,
  onSongSelect
}: {
  playlist: IPlaylist;
  onSongSelect: (song: ITrackInfo) => void;
}) => {
  return (
    <div className="p-10 overflow-auto flex-1">
      <ul>
        {playlist.songs.map((song, index) => (
          <li
            key={song.url}
            className="p-3 flex items-center border-gray-200 border-b hover:bg-gray-200 rounded-md cursor-pointer"
            onClick={() => onSongSelect(song)}
          >
            <img className="w-10 h-10 object-cover" src={song.thumbnail_url} />
            <span className="px-4 text-gray-500">{index + 1}</span>
            <span>{song.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const Playlist = () => {
  const params = useParams();
  const playlistId: string = params.id;
  const { state, dispatch } = React.useContext(AppContext);

  const playlist = state.playlists.find(p => p._id == playlistId);

  return (
    <div className="flex flex-col h-full">
      <PlaylistHeader
        playlist={playlist}
        onPlayAll={() => {
          dispatch({
            type: "ADD_PLAYLIST_TO_PLAY_QUEUE",
            payload: playlist
          });
        }}
      />
      <PlaylistSongList
        playlist={playlist}
        onSongSelect={song =>
          dispatch({
            type: "ADD_TRACK_TO_PLAY_QUEUE",
            payload: song
          })
        }
      />
    </div>
  );
};

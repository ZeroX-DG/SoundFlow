import * as React from "react";
import { Api, ISearchResult, ITrackInfo } from "../services/api";
import { Modal } from "../components/modal";
import { SearchBox } from "../components/search-box";
import { AppContext } from "../app";
import { nanoid } from "nanoid";

const api = new Api();

const SearchResultList = ({
  result,
  onAddPlaylist
}: {
  result: ISearchResult;
  onAddPlaylist: (item: ITrackInfo) => void;
}) => {
  if (!result) {
    return null;
  }
  return (
    <div
      className="overflow-y-auto w-full mt-5"
      style={{ height: "calc(100% - 112px)" }}
    >
      <ul className="list-none">
        {Object.keys(result).map(key =>
          result[key].map(item => (
            <SearchResultItem
              key={item.url}
              item={item}
              onAddPlaylist={onAddPlaylist}
            />
          ))
        )}
      </ul>
    </div>
  );
};

const SearchResultItem = ({
  item,
  onAddPlaylist
}: {
  item: ITrackInfo;
  onAddPlaylist: (item: ITrackInfo) => void;
}) => {
  const { title, author, thumbnail_url } = item;
  return (
    <li className="bg-white p-3 flex shadow-sm rounded-lg mb-5 w-full">
      <img
        className="block w-16 h-16 rounded-lg object-cover"
        src={thumbnail_url}
      />
      <div className="px-3 flex-grow flex-shrink" style={{ minWidth: "0" }}>
        <p className="font-bold mb-1 text-lg whitespace-nowrap overflow-ellipsis overflow-hidden">
          {title}
        </p>
        <p className="text-sm text-black text-opacity-70 whitespace-nowrap overflow-ellipsis overflow-hidden">
          {author}
        </p>
      </div>
      <div className="self-center w-80 flex justify-end">
        <ul className="list-none flex space-x-4">
          <li>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-full text-sm">
              <span className="mdi mdi-podcast mr-2"></span>
              Podcast <span className="mdi mdi-plus"></span>
            </button>
          </li>
          <li>
            <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-full text-sm"
              onClick={() => onAddPlaylist(item)}
            >
              <span className="mdi mdi-play-box-multiple mr-2"></span>
              Playlist <span className="mdi mdi-plus"></span>
            </button>
          </li>
        </ul>
      </div>
    </li>
  );
};

const AddToPlaylistModal = ({
  item,
  show,
  onClose
}: {
  item: ITrackInfo;
  show: boolean;
  onClose: () => void;
}) => {
  const { state, dispatch } = React.useContext(AppContext);
  const [searchQuery, setSearchQuery] = React.useState("");

  if (!item) {
    return null;
  }

  return (
    <Modal show={show} onClose={onClose}>
      <h1 className="text-xl font-bold">Add to playlist</h1>
      <SearchBox onChange={setSearchQuery} query={searchQuery} />
      <div className="w-full overflow-y-auto py-5">
        <ul className="list-none">
          {state.playlists
            .filter(p =>
              p.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map(playlist => {
              const isSongInList = playlist.songs.some(
                song => song.url == item.url
              );
              return (
                <li
                  className={`px-5 py-3 shadow-sm rounded-md flex cursor-pointer mb-3 ${
                    isSongInList ? "bg-indigo-500 text-white" : "bg-white"
                  }`}
                  key={playlist._id}
                  onClick={() =>
                    dispatch({
                      type: isSongInList
                        ? "REMOVE_FROM_PLAYLIST"
                        : "ADD_TO_PLAYLIST",
                      payload: {
                        track: item,
                        playlistId: playlist._id
                      }
                    })
                  }
                >
                  <span
                    className={`mdi mr-4 ${
                      isSongInList
                        ? "mdi-checkbox-marked-circle-outline"
                        : "mdi-checkbox-blank-circle-outline"
                    }`}
                  ></span>
                  <p className="flex-grow flex-shrink">{playlist.name}</p>
                </li>
              );
            })}
          {searchQuery.length > 0 &&
            !state.playlists.some(p => p.name == searchQuery) && (
              <li
                className="px-5 py-3 bg-white shadow-sm rounded-md flex cursor-pointer"
                onClick={() =>
                  dispatch({
                    type: "ADD_PLAYLIST",
                    payload: {
                      _id: nanoid(),
                      name: searchQuery,
                      songs: []
                    }
                  })
                }
              >
                <span className="mdi mdi-plus mr-4"></span>
                <p className="flex-grow flex-shrink">
                  Create playlist {searchQuery}
                </p>
              </li>
            )}
        </ul>
      </div>
    </Modal>
  );
};

export const Discover = () => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchResult, setSearchResult] = React.useState(null);
  const [showAddToPlaylist, setShowAddToPlaylist] = React.useState(false);
  const [itemToAddToPlaylist, setItemToAddToPlaylist] = React.useState(null);

  return (
    <>
      <AddToPlaylistModal
        onClose={() => setShowAddToPlaylist(false)}
        show={showAddToPlaylist}
        item={itemToAddToPlaylist}
      />
      <div className="p-5">
        <h1 className="text-2xl font-bold">Discover</h1>
      </div>
      <div className="px-5" style={{ height: "calc(100% - 72px)" }}>
        <p>Find new songs, albums and podcast.</p>
        <SearchBox
          onEnter={async () => {
            const result = await api.search_tracks(searchQuery);
            setSearchResult(result);
          }}
          onChange={setSearchQuery}
          query={searchQuery}
        />
        <SearchResultList
          result={searchResult}
          onAddPlaylist={item => {
            setItemToAddToPlaylist(item);
            setShowAddToPlaylist(true);
          }}
        />
      </div>
    </>
  );
};

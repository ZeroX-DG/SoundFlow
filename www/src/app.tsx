import * as React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Player } from "./components/player";
import { SideBar } from "./components/side-bar";
import { PlayingQueue } from "./components/playing-queue";

import { Discover } from "./pages/discover";
import { Playlists } from "./pages/playlists";

import { ITrackInfo } from "./services/search";

export interface AllDocsMap {
  playlists: IPlaylist[];
}

export interface IPlaylist {
  _id: string;
  name: string;
  songs: ITrackInfo[];
}

interface IAddPlaylistAction {
  type: "ADD_PLAYLIST";
  payload: IPlaylist;
}

interface IRemovePlaylistAction {
  type: "REMOVE_PLAYLIST";
  payload: string;
}

interface IAddToPlaylistAction {
  type: "ADD_TO_PLAYLIST";
  payload: { track: ITrackInfo; playlistId: string };
}

interface IRemoveFromPlaylistAction {
  type: "REMOVE_FROM_PLAYLIST";
  payload: { track: ITrackInfo; playlistId: string };
}

type Action =
  | IAddPlaylistAction
  | IRemovePlaylistAction
  | IAddToPlaylistAction
  | IRemoveFromPlaylistAction;

const initialAppState: AllDocsMap = JSON.parse(
  window.localStorage.getItem("soundflow")
) || { playlists: [] };

export const AppContext = React.createContext<{
  state: AllDocsMap;
  dispatch: (action: Action) => void;
}>({
  state: initialAppState,
  dispatch: null
});

const AppContextProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [state, dispatch] = React.useReducer(
    (state: AllDocsMap, action: Action) => {
      switch (action.type) {
        case "ADD_PLAYLIST": {
          return {
            ...state,
            playlists: state.playlists.concat(action.payload)
          };
        }

        case "ADD_TO_PLAYLIST": {
          const playlists = state.playlists;
          const playlist = playlists.find(
            p => p._id == action.payload.playlistId
          );
          if (
            playlist.songs.some(song => song.url == action.payload.track.url)
          ) {
            return state;
          }
          return {
            ...state,
            playlists: state.playlists.map(playlist => {
              if (playlist._id == action.payload.playlistId) {
                return {
                  ...playlist,
                  songs: playlist.songs.concat(action.payload.track)
                };
              }
              return playlist;
            })
          };
        }

        case "REMOVE_FROM_PLAYLIST": {
          const playlists = state.playlists;
          const playlist = playlists.find(
            p => p._id == action.payload.playlistId
          );
          playlist.songs = playlist.songs.filter(
            song => song.url != action.payload.track.url
          );
          return {
            ...state,
            playlists
          };
        }

        case "REMOVE_PLAYLIST": {
          return {
            ...state,
            playlists: state.playlists.filter(p => p._id != action.payload)
          };
        }

        default:
          return state;
      }
    },
    initialAppState
  );

  React.useEffect(() => {
    window.localStorage.setItem("soundflow", JSON.stringify(state));
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const App = () => {
  return (
    <AppContextProvider>
      <BrowserRouter>
        <div className="w-full h-full flex flex-col">
          <div
            className="flex bg-gray-200"
            style={{ height: "calc(100% - 100px)" }}
          >
            <SideBar />
            <section className="bg-dark-white flex-1" style={{ minWidth: "0" }}>
              <Switch>
                <Route exact path="/" component={Discover} />
                <Route path="/playlists" component={Playlists} />
              </Switch>
            </section>
            <PlayingQueue />
          </div>
          <Player />
        </div>
      </BrowserRouter>
    </AppContextProvider>
  );
};

import * as React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Player } from "./components/player";
import { SideBar } from "./components/side-bar";
import { PlayingQueue } from "./components/playing-queue";

import { Discover } from "./pages/discover";
import { Playlists } from "./pages/playlists";
import { Playlist } from "./pages/playlist";

import { ITrackInfo } from "./services/api";

export interface AppDataMap {
  playlists: IPlaylist[];
  playQueue: ITrackInfo[];
  playQueueIndex: number;
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

interface IAddTrackToPlayQueueAction {
  type: "ADD_TRACK_TO_PLAY_QUEUE";
  payload: ITrackInfo;
}

interface IAddPlaylistToPlayQueueAction {
  type: "ADD_PLAYLIST_TO_PLAY_QUEUE";
  payload: IPlaylist;
}

interface ISetPlayQueueIndexAction {
  type: "SET_PLAY_QUEUE_INDEX";
  payload: number;
}

interface INextTrackAction {
  type: "NEXT_TRACK";
}

interface IPrevTrackAction {
  type: "PREV_TRACK";
}

interface IClearPlayQueue {
  type: "CLEAR_PLAY_QUEUE";
}

type Action =
  | IAddPlaylistAction
  | IRemovePlaylistAction
  | IAddToPlaylistAction
  | IRemoveFromPlaylistAction
  | IAddTrackToPlayQueueAction
  | IAddPlaylistToPlayQueueAction
  | ISetPlayQueueIndexAction
  | INextTrackAction
  | IPrevTrackAction
  | IClearPlayQueue;

const DEFAULT_DATA: AppDataMap = {
  playlists: [],
  playQueue: [],
  playQueueIndex: -1
};

let parsed_data: AppDataMap;

try {
  const parsed = JSON.parse(window.localStorage.getItem("soundflow"));
  parsed_data = parsed;
} catch {
  parsed_data = DEFAULT_DATA;
}

const initialAppState: AppDataMap = { ...DEFAULT_DATA, ...parsed_data };

export const AppContext = React.createContext<{
  state: AppDataMap;
  dispatch: (action: Action) => void;
}>({
  state: initialAppState,
  dispatch: null
});

const AppContextProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [state, dispatch] = React.useReducer(
    (state: AppDataMap, action: Action) => {
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

        case "ADD_TRACK_TO_PLAY_QUEUE": {
          return {
            ...state,
            playQueue: state.playQueue.concat(action.payload)
          };
        }

        case "ADD_PLAYLIST_TO_PLAY_QUEUE": {
          return {
            ...state,
            playQueue: state.playQueue.concat(action.payload.songs)
          };
        }

        case "SET_PLAY_QUEUE_INDEX": {
          return {
            ...state,
            playQueueIndex: action.payload
          };
        }

        case "NEXT_TRACK": {
          let nextIndex = state.playQueueIndex + 1;
          if (nextIndex >= state.playQueue.length) {
            nextIndex = 0;
          }
          return {
            ...state,
            playQueueIndex: nextIndex
          };
        }

        case "PREV_TRACK": {
          let nextIndex = state.playQueueIndex - 1;
          if (nextIndex < 0) {
            nextIndex = state.playQueue.length - 1;
          }
          return {
            ...state,
            playQueueIndex: nextIndex
          };
        }

        case "CLEAR_PLAY_QUEUE": {
          return {
            ...state,
            playQueueIndex: -1,
            playQueue: []
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
        <AppContext.Consumer>
          {({ state }) => (
            <div className="w-full h-full flex flex-col">
              <div
                className="flex bg-gray-200"
                style={{
                  height:
                    state.playQueueIndex >= 0 &&
                    state.playQueueIndex < state.playQueue.length
                      ? "calc(100% - 100px)"
                      : "100%"
                }}
              >
                <SideBar />
                <section
                  className="bg-dark-white flex-1"
                  style={{ minWidth: "0" }}
                >
                  <Switch>
                    <Route exact path="/" component={Discover} />
                    <Route path="/playlists" component={Playlists} />
                    <Route path="/playlist/:id" component={Playlist} />
                  </Switch>
                </section>
                <PlayingQueue />
              </div>
              <Player />
            </div>
          )}
        </AppContext.Consumer>
      </BrowserRouter>
    </AppContextProvider>
  );
};

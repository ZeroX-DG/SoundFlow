import * as React from "react";
import "./style.scss";
import { timeFormatter } from "../../utils";
import { AppContext } from "../../app";
import { Api, IError, ITrackUrl, ITrackInfo } from "../../services/api";

const api = new Api();

const AudioInfo = ({
  thumbnailUrl,
  title,
  author
}: {
  thumbnailUrl: string;
  title: string;
  author: string;
}) => {
  return (
    <div className="ml-10 flex">
      <img
        className="w-100px h-100px object-cover block mb-5 self-end rounded-lg shadow-xl border-4 border-white"
        src={thumbnailUrl}
      />
      <div className="px-5 mb-2 self-center" style={{ maxWidth: "350px" }}>
        <p className="text-black font-bold text-xl mb-1 truncate">{title}</p>
        <p className="text-black text-opacity-60 truncate">{author}</p>
      </div>
    </div>
  );
};

const AudioControl = ({
  isPlaying,
  onPlayClick,
  onNextClick,
  onPrevClick
}: {
  isPlaying: boolean;
  onPlayClick: (playStatus: boolean) => void;
  onNextClick: () => void;
  onPrevClick: () => void;
}) => {
  return (
    <div className="flex self-center mx-10 text-xl space-x-4">
      <button className="focus:outline-none" onClick={() => onPrevClick()}>
        <span className="mdi mdi-skip-previous-outline" />
      </button>
      <button
        className="focus:outline-none rounded-full bg-indigo-600 w-11 h-11 flex justify-center items-center"
        onClick={() => onPlayClick(!isPlaying)}
      >
        <span
          className={`mdi mdi-${isPlaying ? "pause" : "play"} text-white`}
        />
      </button>
      <button className="focus:outline-none" onClick={() => onNextClick()}>
        <span className="mdi mdi-skip-next-outline" />
      </button>
    </div>
  );
};

const AudioProgressBar = ({
  current,
  length,
  onProgressChange
}: {
  current: number;
  length: number;
  onProgressChange: (current: number) => void;
}) => {
  const [progressWidth, setProgressWidth] = React.useState(0);
  const progressBarRef = React.useRef<HTMLDivElement>(null);
  const percentage = (current * 100) / length;
  const formatTime = timeFormatter(length);

  React.useLayoutEffect(() => {
    const { width } = progressBarRef.current.getBoundingClientRect();
    setProgressWidth((percentage * width) / 100);
  });

  const handleProgressClick = (e: any) => {
    const { width, left } = progressBarRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const percent = (x / width) * 100;
    const newCurrentTime = Math.floor((percent * length) / 100);
    onProgressChange(newCurrentTime);
  };

  return (
    <div className="flex self-center ml-10 flex-grow progress-bar">
      <span className="text-black text-opacity-70 text-sm font-medium">
        {formatTime(current)}
      </span>
      <div className="flex-grow flex items-center px-6">
        <div
          className="relative w-full h-5 cursor-pointer flex items-center"
          onClick={handleProgressClick}
        >
          <div
            className="w-full bg-gray-200 h-1 absolute"
            ref={progressBarRef}
          />
          <div
            className="bg-indigo-600 h-1 absolute w-px left-0"
            style={{
              transform: `scaleX(${progressWidth})`,
              transformOrigin: "left center"
            }}
          />
          <div
            className="rounded-full cursor-pointer p-2 bg-indigo-600 absolute"
            style={{
              transform: `translateX(calc(${progressWidth}px - 0.5rem))`
            }}
          />
        </div>
      </div>
      <span className="text-black text-opacity-70 text-sm font-medium">
        {formatTime(length)}
      </span>
    </div>
  );
};

const AudioVolumeControl = ({
  percentage,
  mute,
  onVolumeChange,
  onMuteChange
}: {
  percentage: number;
  mute: boolean;
  onVolumeChange: (newVolume: number) => void;
  onMuteChange: (isMute: boolean) => void;
}) => {
  const volumeBarRef = React.useRef<HTMLDivElement>(null);

  const handleVolumeClick = (e: any) => {
    const { height, top } = volumeBarRef.current.getBoundingClientRect();
    const y = height - (e.clientY - top);
    const percent = (y / height) * 100;
    onVolumeChange(percent);
  };

  return (
    <div className="px-5 self-center text-2xl relative volume-control">
      <button
        className="cursor-pointer volume-button"
        onClick={() => onMuteChange(!mute)}
      >
        <span className={`mdi mdi-volume-${mute ? "mute" : "medium"}`}></span>
      </button>
      <div className="bg-white p-5 absolute flex justify-center bottom-10 shadow-md right-3 volume-slider">
        <div
          className="relative flex justify-center w-5 h-full cursor-pointer"
          ref={volumeBarRef}
          onClick={handleVolumeClick}
        >
          <div className="bg-gray-200 h-full w-1 absolute" />
          <div
            className="bg-indigo-600 w-1 absolute self-end"
            style={{
              height: `${percentage}%`
            }}
          />
          <div
            className="rounded-full cursor-pointer p-2 bg-indigo-600 absolute self-end"
            style={{
              bottom: `calc(${percentage}% - 0.5rem)`
            }}
          />
        </div>
      </div>
    </div>
  );
};

export const Player = () => {
  const { state, dispatch } = React.useContext(AppContext);
  const [playing, setPlaying] = React.useState(false);
  const [duration, setDuration] = React.useState(0);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [volume, setVolume] = React.useState(50);
  const [mute, setMute] = React.useState(false);
  const audio = React.useRef<HTMLAudioElement>(null);

  React.useEffect(() => {
    audio.current = new Audio();
    audio.current.volume = volume / 100;
    audio.current.addEventListener("canplay", () => {
      setPlaying(true);
      setDuration(audio.current.duration);
      audio.current.play();
    });

    audio.current.addEventListener("timeupdate", () => {
      setCurrentTime(audio.current.currentTime);
    });

    audio.current.addEventListener("ended", () => {
      dispatch({
        type: "NEXT_TRACK"
      });
    });

    initMediaSessionControl();
  }, []);

  const updateMediaSessionMetadata = (track: ITrackInfo) => {
    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title,
        artist: track.author,
        artwork: [
          { src: track.thumbnail_url, sizes: "320x180", type: "image/png" }
        ]
      });
    }
  };

  const initMediaSessionControl = () => {
    navigator.mediaSession.setActionHandler("play", () =>
      handlePlayClick(true)
    );
    navigator.mediaSession.setActionHandler("pause", () =>
      handlePlayClick(false)
    );
    navigator.mediaSession.setActionHandler("nexttrack", () =>
      dispatch({ type: "NEXT_TRACK" })
    );
    navigator.mediaSession.setActionHandler("previoustrack", () =>
      dispatch({ type: "PREV_TRACK" })
    );
  };

  React.useEffect(() => {
    (async () => {
      if (state.playQueueIndex != -1 && state.playQueue.length > 0) {
        if (playing) {
          audio.current.pause();
          setPlaying(false);
          setCurrentTime(0);
        }

        const currentTrack = state.playQueue[state.playQueueIndex];
        const source = await api.get_track_url(
          currentTrack.url,
          currentTrack.provider
        );

        if ((source as IError).error) {
          // TODO: handle error when we can't get track url
          return;
        }

        audio.current.src = (source as ITrackUrl).url;
        audio.current.load();
        updateMediaSessionMetadata(currentTrack);
      }
    })();
  }, [state.playQueueIndex]);

  const handlePlayClick = (isAllowPlay: boolean) => {
    setPlaying(isAllowPlay);
    if ("mediaSession" in navigator) {
      navigator.mediaSession.playbackState = playing ? "playing" : "paused";
    }
    if (isAllowPlay) {
      audio.current.play();
    } else {
      audio.current.pause();
    }
  };

  const handleProgressChange = (current: number) => {
    audio.current.currentTime = current;
  };

  const handleVolumeChange = (percent: number, isMute: boolean) => {
    // Bound check for percentage
    let new_percent: number;
    if (percent < 0) {
      new_percent = 0;
    } else if (percent > 100) {
      new_percent = 100;
    } else {
      new_percent = percent;
    }

    setVolume(new_percent);
    if (!isMute) {
      audio.current.volume = new_percent / 100;
    }
  };

  const handleMuteChange = (isMute: boolean) => {
    setMute(isMute);
    if (isMute) {
      audio.current.volume = 0;
    } else {
      handleVolumeChange(volume, false);
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLElement>) => {
    switch (e.key) {
      case " ":
      case "MediaPlay":
        handlePlayClick(!playing);
        break;
      case "N":
      case "MediaTrackNext":
        dispatch({ type: "NEXT_TRACK" });
        break;
      case "P":
      case "MediaTrackPrevious":
        dispatch({ type: "PREV_TRACK" });
        break;
      case "m":
        handleMuteChange(!mute);
        break;
      case "ArrowDown":
        handleVolumeChange(volume - 5, mute);
        break;
      case "ArrowUp":
        handleVolumeChange(volume + 5, mute);
        break;
    }
  };

  const currentTrack = state.playQueue[state.playQueueIndex];

  if (!currentTrack) {
    return null;
  }

  return (
    <section
      className="w-full h-100px bg-white flex-none flex player z-10"
      onKeyUp={handleKeyUp}
      tabIndex={0}
    >
      <AudioInfo
        thumbnailUrl={currentTrack.thumbnail_url}
        title={currentTrack.title}
        author={currentTrack.author}
      />
      <AudioControl
        isPlaying={playing}
        onPlayClick={handlePlayClick}
        onNextClick={() => dispatch({ type: "NEXT_TRACK" })}
        onPrevClick={() => dispatch({ type: "PREV_TRACK" })}
      />
      <AudioProgressBar
        onProgressChange={handleProgressChange}
        current={currentTime}
        length={duration}
      />
      <AudioVolumeControl
        mute={mute}
        percentage={volume}
        onMuteChange={handleMuteChange}
        onVolumeChange={volme => handleVolumeChange(volme, mute)}
      />
    </section>
  );
};

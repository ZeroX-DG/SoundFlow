import * as React from "react";
import "./style.scss";
import { timeFormatter } from "../../utils";

const AudioInfo = ({
  albumUrl,
  title,
  author
}: {
  albumUrl: string;
  title: string;
  author: string;
}) => {
  return (
    <div className="ml-10 flex">
      <img
        className="w-100px block mb-5 self-end rounded-lg shadow-xl border-4 border-white"
        src={albumUrl}
      />
      <div className="px-5 mb-2 self-center">
        <p className="text-black font-bold text-xl mb-1">{title}</p>
        <p className="text-black text-opacity-60">{author}</p>
      </div>
    </div>
  );
};

const AudioControl = () => {
  return (
    <div className="flex self-center mx-10 text-xl space-x-4">
      <button className="focus:outline-none">
        <span className="mdi mdi-skip-previous-outline" />
      </button>
      <button className="focus:outline-none rounded-full bg-indigo-600 w-11 h-11 flex justify-center items-center">
        <span className="mdi mdi-play-outline text-white" />
      </button>
      <button className="focus:outline-none">
        <span className="mdi mdi-skip-next-outline" />
      </button>
    </div>
  );
};

const AudioProgressBar = ({
  current,
  length
}: {
  current: number;
  length: number;
}) => {
  const percentage = (current * 100) / length;
  const formatTime = timeFormatter(length);

  return (
    <div className="flex self-center ml-10 flex-grow progress-bar">
      <span className="text-black text-opacity-70 text-sm font-medium">
        {formatTime(current)}
      </span>
      <div className="flex-grow flex items-center px-6">
        <div className="relative w-full h-1 flex items-center">
          <div className="w-full bg-gray-200 h-1 absolute cursor-pointer" />
          <div
            className="bg-indigo-600 h-1 absolute cursor-pointer"
            style={{ width: `${percentage}%` }}
          />
          <div
            className="rounded-full cursor-pointer p-2 bg-indigo-600 absolute"
            style={{ left: `calc(${percentage}% - 0.5rem)` }}
          />
        </div>
      </div>
      <span className="text-black text-opacity-70 text-sm font-medium">
        {formatTime(length)}
      </span>
    </div>
  );
};

const AudioVolumeControl = ({ percentage }: { percentage: number }) => {
  return (
    <div className="px-5 self-center text-2xl relative volume-control">
      <button className="cursor-pointer volume-button">
        <span className="mdi mdi-volume-medium"></span>
      </button>
      <div className="bg-white p-5 absolute flex justify-center bottom-10 shadow-md right-3 volume-slider">
        <div className="relative flex justify-center w-1 h-full">
          <div className="bg-gray-200 h-full w-1 cursor-pointer absolute" />
          <div
            className="bg-indigo-600 w-1 cursor-pointer absolute self-end"
            style={{ height: `${percentage}%` }}
          />
          <div
            className="rounded-full cursor-pointer p-2 bg-indigo-600 absolute self-end"
            style={{ bottom: `calc(${percentage}% - 0.5rem)` }}
          />
        </div>
      </div>
    </div>
  );
};

export const Player = () => {
  const albumUrl =
    "https://cdn.shopify.com/s/files/1/0197/1326/products/Radio_AMoon_Cover_240416_1200x.jpg?v=1542351360";

  return (
    <section className="w-full h-100px bg-white flex-none flex player z-10">
      <AudioInfo
        albumUrl={albumUrl}
        title="Burn the Witch"
        author="Radiohead"
      />
      <AudioControl />
      <AudioProgressBar current={70} length={200} />
      <AudioVolumeControl percentage={20} />
    </section>
  );
};

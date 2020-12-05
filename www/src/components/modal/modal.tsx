import * as React from "react";

interface Props {
  show: boolean;
  onClose: () => void;
}

export const Modal = ({
  children,
  show,
  onClose
}: React.PropsWithChildren<Props>) => {
  if (!show) {
    return null;
  }
  return (
    <div
      onClick={() => onClose()}
      className="w-full h-full flex justify-center fixed top-0 left-0 bg-black bg-opacity-60 z-50"
    >
      <div
        className="bg-dark-white w-1/2 p-5 h-4/5 mt-12 rounded-md"
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

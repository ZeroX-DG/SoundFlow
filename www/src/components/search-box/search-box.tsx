import * as React from "react";

export const SearchBox = ({
  onChange,
  onEnter,
  query
}: {
  onChange?: (value: string) => void;
  onEnter?: () => void;
  query: string;
}) => {
  const handleKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.which == 13) {
      onEnter?.();
    }
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onChange?.(value);
  };

  return (
    <div className="mt-5 flex bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="self-center px-3">
        <span className="mdi mdi-magnify"></span>
      </div>
      <input
        className="pr-5 py-3 bg-white flex-grow"
        placeholder="Search..."
        value={query}
        onKeyDown={handleKeydown}
        onChange={handleOnChange}
      />
    </div>
  );
};

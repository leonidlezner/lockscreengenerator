import React from "react";
import useStorageState from "../../../helpers/useStorageState";

export default function TabContainer({ children }) {
  const [selection, setSelection] = useStorageState(0, "tab");

  const tabs = React.Children.map(children, (child, index) => {
    return (
      <li key={child.props.caption}>
        <button
          onClick={() => setSelection(index)}
          className={
            "border-separate overflow-clip rounded-t-md border-t-2 border-gray-800 bg-gray-200 px-4 py-2 font-semibold" +
            (selection === index
              ? ""
              : " border-none bg-gray-300 font-normal text-gray-600")
          }
        >
          {child.props.caption}
        </button>
      </li>
    );
  });

  return (
    <div className="pt-2">
      <div>
        <ul className="flex items-baseline space-x-1">{tabs}</ul>
      </div>
      <div className="rounded-md rounded-tl-none bg-gray-200 p-2">
        {React.Children.toArray(children)[selection]}
      </div>
    </div>
  );
}

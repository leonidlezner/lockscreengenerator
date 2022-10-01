export default function DownloadPanel({ onClick }) {
  return (
    <div>
      <button
        onClick={onClick}
        className="hover: w-full rounded-md bg-gradient-to-b from-gray-500 to-gray-600 p-2 font-semibold text-gray-200 shadow-sm hover:from-gray-200 hover:to-gray-300 hover:text-gray-600"
      >
        Download
      </button>
    </div>
  );
}

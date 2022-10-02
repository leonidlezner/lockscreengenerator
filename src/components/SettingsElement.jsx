export default function SettingsElement({ children, label, name }) {
  return (
    <div className="items-center rounded-md bg-white p-2 shadow-sm md:flex md:w-full">
      <label className="block w-40 pb-1 md:pb-0 md:pl-2 lg:w-64" htmlFor={name}>
        {label}
      </label>
      <div className="flex-1">{children}</div>
    </div>
  );
}

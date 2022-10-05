export default function SelectElement({ items, onChange, value, name }) {
  return (
    <select
      name={name}
      id={name}
      onChange={onChange}
      value={value}
      className="form-select block w-full appearance-none rounded-md border-2 border-gray-300 bg-gray-50 px-3 py-1 pr-8 hover:bg-white"
    >
      {items.map((el, index) => (
        <option value={index} key={index}>
          {el.title}
        </option>
      ))}
    </select>
  );
}

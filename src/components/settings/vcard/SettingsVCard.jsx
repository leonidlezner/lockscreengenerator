import { useRef } from "react";
import SettingsElement from "../SettingsElement";

export default function SettingsVCard({ name, values, onChange, delay }) {
  const fields = {
    firstName: { label: "First name" },
    lastName: { label: "Last name" },
    phone: { label: "Phone number", type: "tel" },
    eMail: { label: "E-Mail", type: "email" },
    company: { label: "Company" },
  };

  const timeoutRef = useRef(null);
  const fieldNames = Object.keys(fields);

  function handleChange(fieldName, value) {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onChange({
        target: {
          name: name,
          value: {
            ...values,
            [fieldName]: value,
          },
        },
      });
    }, delay);
  }

  const fieldElement = (fieldName, field) => {
    return (
      <SettingsElement
        key={fieldName}
        name={`text_${fieldName}`}
        label={field.label}
      >
        <div className="flex space-x-2">
          <div className="flex-1">
            <input
              className="block w-full appearance-none rounded-md border-2 border-gray-300 bg-gray-50 px-3 py-1 hover:bg-white"
              type={field.type ?? "text"}
              defaultValue={values[fieldName]}
              id={`text_${fieldName}`}
              onChange={(event) => handleChange(fieldName, event.target.value)}
              placeholder="Enter text here..."
            />
          </div>
        </div>
      </SettingsElement>
    );
  };

  return (
    <div className="space-y-2">
      {fieldNames.map((fieldName, index) =>
        fieldElement(fieldName, fields[fieldName])
      )}
    </div>
  );
}

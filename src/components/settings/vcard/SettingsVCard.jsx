import { useCallback, useEffect, useRef, useState } from "react";
import SettingsElement from "../SettingsElement";

export default function SettingsVCard({ name, values, onChange, delay }) {
  const [invalidStates, setInvalidStates] = useState({});
  const timeoutRef = useRef(null);
  const valuesCacheRef = useRef(null);

  const fields = useCallback(() => {
    return {
      firstName: { label: "First name", required: true },
      lastName: { label: "Last name", required: true },
      phone: { label: "Phone number", type: "tel" },
      eMail: { label: "E-Mail", type: "email" },
      company: { label: "Company" },
    };
  }, []);

  const fieldNames = Object.keys(fields());

  const validate = useCallback(
    (fieldName, value) => {
      const valid = !fields()[fieldName].required || value;
      setInvalidStates((prevStates) => ({
        ...prevStates,
        [fieldName]: !valid,
      }));
      return valid;
    },
    [fields]
  );

  function handleChange(fieldName, value) {
    validate(fieldName, value);

    valuesCacheRef.current[fieldName] = value;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onChange({
        target: {
          name: name,
          value: valuesCacheRef.current,
        },
      });
    }, delay);
  }

  useEffect(() => {
    Object.keys(fields()).forEach((fieldName) => {
      validate(fieldName, values[fieldName]);
    });
    valuesCacheRef.current = values;
  }, [fields, values, validate]);

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
              className={
                "block w-full appearance-none rounded-md border-2  px-3 py-1 hover:bg-white" +
                (invalidStates[fieldName]
                  ? " border-red-300 bg-red-50"
                  : " border-gray-300 bg-gray-50")
              }
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
        fieldElement(fieldName, fields()[fieldName])
      )}
    </div>
  );
}

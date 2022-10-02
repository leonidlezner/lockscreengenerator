import { useState } from "react";

export default function useStorageState(defaultValue, name) {
  const loadValue = (name) => {
    const strValue = window.sessionStorage.getItem(name);
    return strValue ? JSON.parse(strValue) : null;
  };

  const [value, setValue] = useState(() => {
    return loadValue(name) ?? defaultValue;
  });

  const storeValue = (name, value) => {
    window.sessionStorage.setItem(name, JSON.stringify(value));
  };

  const setValueAndSave = (newValue) => {
    if (newValue instanceof Function) {
      setValue((preValue) => {
        const val = newValue(preValue);
        storeValue(name, val);
        return val;
      });
    } else {
      storeValue(name, newValue);
      setValue(newValue);
    }
  };

  return [value, setValueAndSave];
}

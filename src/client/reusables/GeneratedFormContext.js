import React, { useState, createContext } from 'react';

const GeneratedFormContext = createContext();

export default GeneratedFormContext;

const { Provider } = GeneratedFormContext;
export const GeneratedFormContextProvider = ({ children, currentValue,
  params, parentCallback, method, formAction,
  successCallback, redirectUrl, title, fileContent  }) => {
  let [state, setState] = useState({
    values: currentValue || {}, errorMessage: '', invalidFields: [] });

  return <Provider value={{ state, setState, params, parentCallback, method,
    formAction, successCallback, redirectUrl, title, fileContent
  }}>{children}</Provider>;
};

import React, { createContext, useState, useContext } from 'react';

// 1. Create the context
const RegistrationContext = createContext();

// 2. Create a custom hook to use the context
export const useRegistration = () => {
    return useContext(RegistrationContext);
};

// 3. Create the provider component
export const RegistrationProvider = ({ children }) => {
    const [registrationData, setRegistrationData] = useState({});

    const updateRegistrationData = (newData) => {
        setRegistrationData(prevData => ({ ...prevData, ...newData }));
    };

    const resetRegistrationData = () => {
        setRegistrationData({});
    };

    const value = {
        registrationData,
        updateRegistrationData,
        resetRegistrationData
    };

    return (
        <RegistrationContext.Provider value={value}>
            {children}
        </RegistrationContext.Provider>
    );
};

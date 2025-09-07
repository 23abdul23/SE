import React, { createContext, useState, useContext } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  const theme = {
    isDarkMode,
    toggleTheme,
    colors: {
      background: isDarkMode ? '#181818' : '#fff',
      text: isDarkMode ? '#fff' : '#181818',
      subtext: isDarkMode ? '#000000ff' : '#ffffffff',
      card: isDarkMode ? '#232323' : '#f5f5f5',
      // Add more theme colors as needed
    },
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

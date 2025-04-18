import React, { useState, createContext, useContext, useLayoutEffect } from 'react';
import classNames from "classnames";

const ThemeContext = createContext();
const ThemeUpdateContext = createContext();

export function useTheme(){
    return useContext(ThemeContext);
}

export function useThemeUpdate(){
    return useContext(ThemeUpdateContext);
}

const todaysDate = new Date();

const ThemeProvider = ({ children }) => {

  const defaultTheme = {
    sidebar: "dark",
    header: "light",
    skin: "light",
    direction: "ltr",
  };

  const [theme, setTheme] = useState(defaultTheme);

  const themeUpdate = {
    sidebar: (value) => setTheme({ ...theme, sidebar: value }),
    header: (value) => setTheme({ ...theme, header: value }),
    skin: (value) => setTheme({ ...theme, skin: value }),
    direction: (value) => setTheme({ ...theme, direction: value }),
  };

  const bodyClass = classNames({
    "bg-gray-50 dark:bg-gray-1000 font-body text-sm leading-relaxed text-slate-600 dark:text-slate-300 font-normal min-w-[320px]": true,
  });

  const date = todaysDate.getDate();

  function setLocalStorage() {
    localStorage.setItem("dashwindReact-demo1", JSON.stringify({ style: theme, date }));
  }

  useLayoutEffect(() => {
    const saved = localStorage.getItem("dashwindReact-demo1");
    if (saved) {
      const retrieved = JSON.parse(saved);
      if (retrieved.date !== date) {
        setTheme(defaultTheme);
      } else {
        setTheme(retrieved.style);
      }
    } else {
      setLocalStorage();
    }
  }, []);

  useLayoutEffect(() => {
    document.body.className = bodyClass;
    document.body.setAttribute('dir', theme.direction);
  }, [theme]);

  useLayoutEffect(() => {
    setLocalStorage();
    const html = document.querySelector('html');
    if (theme.skin === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={theme}>
      <ThemeUpdateContext.Provider value={themeUpdate}>
        {children}
      </ThemeUpdateContext.Provider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;

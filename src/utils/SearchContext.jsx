import React, { createContext, useState } from "react";

export const SearchContext = createContext(null);

export const SearchProvider = ({ children }) => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  return (
    <SearchContext.Provider
      value={{
        searchKeyword,
        setSearchKeyword,
        searchResults,
        setSearchResults,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

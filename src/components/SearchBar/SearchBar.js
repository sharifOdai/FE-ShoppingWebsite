import React, { useState, useEffect } from "react";
import classes from "../SearchBar/SearchBar.module.css";
import { searchBarResults } from "../../services/api";

function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
  
        console.log("Search Query:", searchQuery);
        if (searchQuery.trim().length > 0) {
          const searchResponse = await searchBarResults({letter: searchQuery});

          console.log("Search Results:", searchResponse);

          setSearchResults(searchResponse.data);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    fetchSearchResults();
  }, [searchQuery]);

  return (
    <div className={classes.SearchBar}>
      <div className={classes.inputSection}>
        
      <input
        className={classes.SearchBarInput}
        type="text"
        placeholder="Search For Items..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
     
      <ol className={classes.SearchResults}>
      
        {searchResults.length > 0 ? (
          searchResults.map((item) => (
            <li key={item.itemId} className={classes.SearchItems}>
              <div className={classes.SearchBarImgSection}>
                <img
                  className={classes.SearchBarImg}
                  src={item.photoUrl}
                  alt={item.title}
                />
              </div>
              <div className={classes.ResultInfo}>
                <h3>{item.title}</h3>
                <p>Price: ${item.priceUSD}</p>
                <p>Stock: {item.availableStock}</p>
              </div>
            </li>
          ))
        ) : (
          <p></p>
        )}
      </ol>
      </div>

    </div>
  );
}

export default SearchBar;
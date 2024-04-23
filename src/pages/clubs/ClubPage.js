import { React, useState } from "react";
import List from "./list"
import "./ClubPage.css";


function ClubPage() {
  const [inputText, setInputText] = useState("");
  let inputHandler = (e) => {
    //convert input text to lower case
    var lowerCase = e.target.value.toLowerCase();
    setInputText(lowerCase);
  };

  return (
    <div className="main">
      <h1>Search for Your Favorite Clubs</h1>
      <div className="search">
        <input
            type="text"
            id="outlined-basic"
            onChange={inputHandler}
            className="outlined-basic"
            placeholder="Search"
          />
      </div>
      <List input={inputText} />
    </div>
  );
}



export default ClubPage;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import lolLogo from './league-of-legends.png';
import './App.css';



 function App() {

  // Constants
  const MY_API_KEY = 'RGAPI-4358209a-2340-4b2f-b7c1-b7025b101bae'; // My API Access Key

  
  

  // Varitables
  const [searchText, setSearchText] = useState(""); // searchText : string varitable that stores the text that is currently in the input box
  const [playerData, setPlayerData] = useState({}); // playerData : a varitable that is often used for showing the players information in the html 
  const [rankData, setRankData] = useState({});     // rankData   : a varitable that is often used for showing a players ranked information in the html 
  const [isLoading, setLoading] = useState(true);   // isLoading  : a varitable that is tells the DOM that we are waiting for information (Deprecated...)
  const [users, setUsers] = useState([]);           // users      : an array of user objects that holds the information of the player (ranked and summoner info)
  const [started, setStarted] = useState(false);

  // GOTTA DO THIS BECAUSE REACT IS WEIRD... NEED TO LOAD STUFF ONLY ON PAGE OPEN
  window.onload = () => {
    onStart();
    rateLimitBatchRequest(20);
  }

  var intId = 0;
  var batch_ids = [];
  var results = [];

  // Author      : Andrew Hudson
  // Name        : quaryBatch()
  // Description : This function quarries the batched names that I wish to request that were saved in the browsers local folders
  async function quaryBatch(){
    if(batch_ids.length == 0)
    {
      clearInterval(intId);
      return;
    }

    

    var next_id = batch_ids.pop()

    if(next_id == null)
    {
      return;
    }

    addPlayerByName(next_id);
  }

  // Author      : Andrew Hudson
  // Name        : rateLimitBatchRequest(rps)
  // Description : This function is used for initilizing the Interval to a specified Request Per Second (rps)
  async function rateLimitBatchRequest(rps)
  {
    var delay_ms = 1000/rps;
    intId = setInterval(quaryBatch, delay_ms);
  }

  // Author      : Andrew Hudson
  // Name        : addToBatch(toAdd)
  // Description : This function adds a name (toAdd) to the Batched names
  async function addToBatch(toAdd)
  {
    
    batch_ids.push[toAdd];
    console.log(batch_ids);
  }


  // Author      : Andrew Hudson
  // Name        : searchForPlayerr(event)
  // Description : This function takes the input from the input box that is being live updated in the 'searchText' varitable!
  async function searchForPlayer(event)
{
  //console.log("SEARCHED");
    // Set Up correct API call

    

    var APICallString = "https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + searchText + "?api_key=" + MY_API_KEY;
    // Handle Api call
    await axios.get(APICallString).then(async function(response)
    {
      if(getStorageKey(response.data.name) != -1)
      {
        console.log("User Already Added!");
        return;
      }

      var myPlayerData = response.data;
      var APIRankedCallString = "https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/" + response.data.id + "?api_key=" + MY_API_KEY;
      setLoading(true);
      await axios.get(APIRankedCallString).then(function(response)
      {


        if(JSON.stringify(response.data) == "[]")
        {
          var myRankedData = {};
          var score = 0;
          var userToAdd = {myPlayerData, myRankedData, score};
          scoreUser(userToAdd);
        }

        else if(response.data[0].queueType == "RANKED_SOLO_5x5")
        {
            var myRankedData = response.data[0];
            var score = 0;
            var userToAdd = {myPlayerData, myRankedData, score};
            scoreUser(userToAdd);  
        }
        else if(response.data[0].queueType == "RANKED_FLEX_SR")
        {
          var myRankedData = response.data[1];
          var score = 0;
          var userToAdd = {myPlayerData, myRankedData, score};
          scoreUser(userToAdd); 
        }
        else
        {
          var myRankedData = {};
          var score = 0;
          var userToAdd = {myPlayerData, myRankedData, score};
          scoreUser(userToAdd);
        }
        users.push(userToAdd);
        localStorage.setItem(localStorage.length, myPlayerData.name);
        setLoading(false);
          

        }).catch(function (error){
          var myRankedData = {};
          var score = 0;
          var userToAdd = {myPlayerData, myRankedData, score};
          scoreUser(userToAdd);

          

          localStorage.setItem(localStorage.length, myPlayerData.name);
        });

        
        sortUsers();


      // Success
    }).catch(function (error){


      // Error
    });
    // Get Ranked Info 
}

  // Author      : Andrew Hudson
  // Name        : addPlayerByName(playerName)
  // Description : This function takes in a Leauge of Legends username (playerName) and then adds it to the array of users (users)
 async  function addPlayerByName(playerName)
  {
    
    if(playerName == "null" || localStorage.getItem(playerName) != null)
    {return;}
    // Set Up correct API call
    var APICallString = "https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + String(playerName) + "?api_key=" + MY_API_KEY;
    // Handle Api call
     axios.get(APICallString).then(function(response)
    {
      
      //setPlayerData(response.data);
      var myPlayerData = response.data;
      var APIRankedCallString = "https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/" + response.data.id + "?api_key=" + MY_API_KEY;
      axios.get(APIRankedCallString).then(async function(response)
      {
        //setRankData(response.data);
        if(JSON.stringify(response.data) == "[]")
        {
          var myRankedData = {};
          var score = 0;
          var userToAdd = {myPlayerData, myRankedData, score};
          scoreUser(userToAdd);
          
        }

        else if(response.data[0].queueType == "RANKED_SOLO_5x5")
        {

            var myRankedData = response.data[0];
            var score = 0;
            var userToAdd = {myPlayerData, myRankedData, score};
            scoreUser(userToAdd);
            
            
        }
        else if(response.data[0].queueType == "RANKED_FLEX_SR")
        {

          var myRankedData = response.data[1];
          var score = 0;
          var userToAdd = {myPlayerData, myRankedData, score};
          scoreUser(userToAdd);
          
        }
        else
        {
          var myRankedData = {};
          var score = 0;
          var userToAdd = {myPlayerData, myRankedData, score};
          scoreUser(userToAdd);
          
          
        }
        await users.push(userToAdd);
        setRankData(response.data);


        }).catch(async function (error){
          var myRankedData = {};
          var score = 0;
          var userToAdd = {myPlayerData, myRankedData, score};
          scoreUser(userToAdd);
          await users.push(userToAdd);

        });




      // Success
    }).catch(function (error){



      // Error
    });
    // Get Ranked Info 
  }

  // Author      : Andrew Hudson
  // Name        : removePlayer(user)
  // Description : This function removes the given player (user) from the current users array and the local storeage then rerenders the screen
  async function removePlayer(user)
  {
    console.log("REMOVE : " + user.myPlayerData.name);
    var index = users.indexOf(user);
    users.splice(index, 1);
    localStorage.clear();

    for(let i = 0; i < users.length; i++)
    {
      localStorage.setItem(i, users[i].myPlayerData.name);
    }
    
    //localStorage.removeItem(user.myPlayerData.name);
    setSearchText("wat" + Math.random());
  }

  // Author      : Andrew Hudson
  // Name        : getStorageKey(username)
  // Description : This function takes in a username (username) and returns its key in the localStorage
  function getStorageKey(username)
  {
    for (let i = 0; i < localStorage.length; i++)
    {
      if(String(localStorage[i]) == username)
      {
        return i;
      }
    }

    return -1;

  }

  // Author      : Andrew Hudson
  // Name        : GiveUser(user, userRank)
  // Description : this function draws the summoner cards using the user object (user) and ranked information from the userRank (userRank) (DEPRECATED...)
  function GiveUser(user, userRank)
  {
    return(
    <div className='user'>
    <p>{user.name}</p>
    <img width={100} height={100} src={"http://ddragon.leagueoflegends.com/cdn/12.22.1/img/profileicon/" + user.profileIconId + ".png"}></img>

  </div>)
  }

  // Author      : Andrew Hudson
  // Name        : printUsers()
  // Description : This function prints all the users
  function printUsers()
  {

    return(

        GiveUser(playerData, rankData)
    )
    

  }
  
  // Author      : Andrew Hudson
  // Name        : renderUsers(user, index)
  // Description : This function is used in the array.mapping() function callback paramater and prints all the objects in the array of users as the summoner cards
  const renderUser = (user, index) => {

    

    return(
    <li key = {index} id = {index}>
      <div className='user'>
        <h1> # {index + 1}</h1>
        <h1>{user.myPlayerData.name}</h1>
        <img width={200} height={200} src={"http://ddragon.leagueoflegends.com/cdn/12.22.1/img/profileicon/" + user.myPlayerData.profileIconId + ".png"}></img>
        <h2>Summoner Level {user.myPlayerData.summonerLevel}</h2>
        {JSON.stringify(user.myRankedData) != '{}' ? <h3>Summoner Solo Queue Rank : {user.myRankedData.tier} {user.myRankedData.rank}</h3> : <h3>Summoner is Unranked...</h3>}
        <h2>{Math.round(user.score)} LP/HR</h2>
        <button onClick={() => removePlayer(user)}>REMOVE PLAYER</button>
      </div>
    </li>
    )
  }

  // Author      : Andrew Hudson
  // Name        : sortUsers()
  // Description : This function sorts all the users in the array by their overall score so it will be printed in order
  function sortUsers()
  {
    for(var i = 0; i <= users.length - 1; i++)
    {
      for(var j = 0; j < ( users.length - i -1); j++)
      {
        if(users[j].score < users[j+1].score)
        {
            // swap em
            var tempUser = users[j];
            users[j] = users[j+1];
            users[j+1] = tempUser;
        }
      }
    }

  }

  // Author      : Andrew Hudson
  // Name        : scoreUser(userToScore)
  // Description : This function scores the given user (userToScore) based on the amount of LP they've gotten / total time played
  function scoreUser(userToScore)
  {

    if(JSON.stringify(userToScore.myRankedData) == "{}")
    {
      score = 0;
      return;
    }

      // Get users data
      var timePlayed = ((userToScore.myRankedData.wins + userToScore.myRankedData.losses) * 35) / 60; // Get the hours played
      var lpAchieved = (getRankDivisionNumber(userToScore.myRankedData)) + userToScore.myRankedData.leaguePoints;
      var score = lpAchieved / timePlayed;
      // Calculate score

      

      // SetScore
      userToScore.score = score;


  }

  // Author      : Andrew Hudson
  // Name        : getRankedDivisionNumber(rankData)
  // Description : This function returns the amount of lp the given user has (rankedData)
  function getRankDivisionNumber(rankedData)
  {

    var myTier = rankedData.tier;
    var myRank = rankedData.rank;
    var myBaseScore;
    switch(String(myRank))
    {
       case "IV":
          // code block
          myBaseScore = 4;
          break;
        case "III":
          // code block
          myBaseScore = 3;
          break;
        case "II":
          // code block
          myBaseScore = 2;
          break;
        case "I":
          myBaseScore = 1;
          break;
        default :
          myBaseScore = 100;
          break;
          // code block
    }
    
    switch(String(myTier)) {
        case "IRON":
          // code block
          myBaseScore = (myBaseScore - 1) * 100 + rankedData.leaguePoints;
          break;
        case "BRONZE":
          // code block
          myBaseScore = (4 * 100) + (myBaseScore - 1) * 100 + rankedData.leaguePoints;
          break;
        case "SILVER":
          // code block
          myBaseScore = (8 * 100) + (myBaseScore - 1) * 100 + rankedData.leaguePoints;
          break;
        case "GOLD":
          // code block
          myBaseScore = (12 * 100) + (myBaseScore - 1) * 100 + rankedData.leaguePoints;
          break;
        case "PLATINUM":
          // code block
          myBaseScore = (16 * 100) + (myBaseScore - 1) * 100 + rankedData.leaguePoints;
          break;
        case "DIAMOND":
          // code block
          myBaseScore = (20 * 100) + (myBaseScore - 1) * 100 + rankedData.leaguePoints;
          break;
        case "MASTER":
          // code block
          myBaseScore = (24 * 100) + (myBaseScore - 1) * 100 + rankedData.leaguePoints;
          break;
        case "GRANDMASTER":
          // code block
          myBaseScore = (28 * 100) + (myBaseScore - 1) * 100 + rankedData.leaguePoints;
          break;
        case "CHALLENGER":
          // code block
          myBaseScore = (32 * 100) + rankedData.leaguePoints;
          break;
        default:
        myBaseScore = 0;
          // code block
      } 
      return myBaseScore;
  }


  // Author      : Andrew Hudson
  // Name        : onStart() (async)
  // Description : This function runs only once when the website is first opened!
  async function onStart()
  {
   
    //localStorage.clear();
    localStorage.removeItem("c1_192.168.1.14:3000");
    console.log(localStorage);
    //localStorage.clear();
    if(localStorage.length > 0 && started == false && users.length <= 0)
    {
      
      for(var  i = 0; i < localStorage.length; i++)
      {
        var playerName = localStorage.getItem(i);
        batch_ids.push(playerName);
      }
      //console.log(localStorage);
      await setStarted(!started);
    }
  }

  // Final return statement!
  return (
    <div className="App">
      <div className='container'>
        <h5> <img src={lolLogo} width={125} height={125}></img> League of Legends : Personal Leaderboard</h5>
        <input typeof='text' onChange={e => setSearchText(e.target.value)}></input>
        <button onClick={e => searchForPlayer(e)}>ADD PLAYER</button>
      </div>
      {JSON.stringify(users) != '[]'
      ? 
      <>
          {sortUsers()}

          {users.map(renderUser)}

      </>
        

      : <><div className='noUser'>NO SUMMONER DATA</div></> // False
      }

    </div>
  );
}

export default App;

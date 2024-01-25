import React, {useContext, useEffect, useState} from "react";
import AuthContext, {AuthProvider} from "./context/AuthProvider";
import {testAuthenticatedApi, allItems} from "../services/api";
import classes from '../components/Home.module.css';
import Items from "./Items/Items";
import SearchBar from "./SearchBar/SearchBar";

function Home() {
    const authContext = useContext(AuthContext);
    const [testResponse, setTestResponse] = useState();
    const [userId, setUserId] = useState();
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!authContext.auth) {
          
                  console.log("User not authenticated");
                  return;
                }
                const tokenParts = authContext.auth.split('.');
                if (tokenParts.length === 3) {
                  const decodedPayload = atob(tokenParts[1]);
                  const payload = JSON.parse(decodedPayload);
                  const userIdFromToken = payload.userId;
                  setUserId(userIdFromToken);
                  console.log(userIdFromToken);
                } else {
                  console.log("Invalid JWT token format");
                }
              } catch (error) {
                console.error('Error adding item to user order: Please Log In first');
              }
      };
    
      fetchData();
      }, []);

      



    return (
        <>
            <div className={classes.header}>
                <div className={classes.headerSection}>
  
                <SearchBar/>
                </div> 
            
            </div>
            {Object.keys(authContext["auth"]).length > 0 && <p>{testResponse}</p>}

            <Items/>

            
          <footer className={classes.footer}>
            <p className={classes.footerText}>© 2024, Elite Shop Powered by Shopify
                | Refund policy
                | Privacy policy
                | Terms of service
                | Shipping policy
                | Contact information
            </p>
          </footer>
        </>
    )
}

export default Home;
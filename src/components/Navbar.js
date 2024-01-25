import { Link, useMatch, useNavigate, useResolvedPath } from "react-router-dom";
import classes from "./Navbar.module.css";
import React, { useContext, useState , useEffect} from "react";
import AuthContext from "./context/AuthProvider";
import { faHouseDamage, faHeart, faShoppingCart, faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {removeUser} from "../services/api";


function Navbar() {
  const authContext = useContext(AuthContext);
  const logOut = useNavigate();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [userId, setUserId] = useState(null);

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
      }, [authContext.auth]);

  const logOutFunction = () => {
    authContext.setAuth("");
    logOut("/");
  };

  const userAuthenticated = authContext.auth.length > 0;

  const toggleUserDropdown = () => {
    setShowUserDropdown(!showUserDropdown);
  };

  const handleRemoveUser = async () => {
    try {
      if (userId){ 
        await removeUser(userId);
        authContext.setAuth("");
        window.location.href = "/";
      } else {
        console.error("User ID is undefined");
      }
    } catch (error) {
      console.error("Error removing user", error);
    }
  };
  

  return (
    <nav className={classes.nav}>
      <Link to="/" className={classes.siteTitle}>
        <button className={classes.navBtns}>
          <FontAwesomeIcon icon={faHouseDamage} />
        </button>
      </Link>
      <p className={classes.headerTitle}>ELITE SHOP</p>
      <ul>
        {userAuthenticated ? (
          <>
            <CustomLink to="/favoriteList">
              <button className={`${classes.navBtns} ${classes.heartBtn}`}>
                <FontAwesomeIcon icon={faHeart} className={classes.icon} />
              </button>
            </CustomLink>

            <CustomLink to="/OrdersList">
              <button className={classes.navBtns}>
                <FontAwesomeIcon icon={faShoppingCart} className={classes.icon} />
              </button>
            </CustomLink>

            
            <div className={classes.userDropdown}>
              <button className={`${classes.navBtns} ${classes.dropDownTitle}`} onClick={toggleUserDropdown} >
                Manage User <FontAwesomeIcon icon={faCaretDown} className={classes.icon} />
              </button>
              {showUserDropdown && (
                <div className={classes.userDropdownContent}>

                  <button className={`${classes.dropBtn} ${classes.removeBtn}`}  onClick={()=> handleRemoveUser(userId)}>Remove User</button>
                  
                  <CustomLink to="/"  onClick={logOutFunction}>
                    <button className={classes.dropBtn}>
                      Log-Out
                    </button>
                  </CustomLink>


                </div>
              )}
              </div>
          </>
        ) : (
          <>
            <CustomLink to="/favoriteList">
              <button className={classes.navBtns} disabled>
                <FontAwesomeIcon icon={faHeart} className={classes.icon} />
              </button>
            </CustomLink>

            <CustomLink to="/OrdersList">
              <button className={classes.navBtns} disabled>
                <FontAwesomeIcon icon={faShoppingCart} className={classes.icon} />
              </button>
            </CustomLink>

            <CustomLink to="/login"><button className={classes.logBtns}>Login</button></CustomLink>
            <CustomLink to="/signUp"><button className={classes.logBtns} >Sign-up</button></CustomLink>
          </>
        )}
      </ul>
    </nav>
    );
  }
  
  function CustomLink({ to, children, ...props }) {
    const resolvedPath = useResolvedPath(to);
    const isActive = useMatch({ path: resolvedPath.pathname, end: true });
    
    return (
    <li className={isActive ? classes.active : ""}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  );
}

export default Navbar;

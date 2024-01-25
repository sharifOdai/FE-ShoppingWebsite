import { Link, useMatch, useLocation, useResolvedPath } from "react-router-dom";
import React, { useContext, useState, useEffect } from "react";
import { favoriteList, removeItemFromFavoriteList, addItemToOrder } from "../../services/api";
import AuthContext from "../context/AuthProvider";
import { faArrowLeft, faShoppingCart, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "./FavoriteList.module.css";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function FavoriteList() {
  const authContext = useContext(AuthContext);
  const [favoriteItems, setFavoriteItems] = useState([]);
  const location = useLocation();
  const [userIdFromToken, setUserIdFromToken] = useState(null);
  const [addedToOrderMessage, setAddedToOrderMessage] = useState('');
  const [addedToOrderItemId, setAddedToOrderItemId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Auth Context:", authContext.auth);

        if (authContext.auth) {
          const tokenParts = authContext.auth.split(".");

          if (tokenParts.length === 3) {
            const decodedPayload = atob(tokenParts[1]);
            const payload = JSON.parse(decodedPayload);
            const userIdFromTokenValue = payload.userId;
            setUserIdFromToken(userIdFromTokenValue);

            console.log("User ID from Token:", userIdFromTokenValue);

            if (userIdFromTokenValue) {
              const favoriteListResponse = await favoriteList(userIdFromTokenValue);
              console.log("Favorite List Response:", favoriteListResponse);
              setFavoriteItems(favoriteListResponse.data);
            } else {
              console.log("User ID not available in the token");
            }
          } else {
            console.log("Invalid JWT token format");
          }
        } else {
          console.log("Authentication information not available");
        }
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    fetchData();
  }, [authContext.auth, location.pathname]);

  const removeItemFromFavorites = async (userId, itemId) => {
    try {
      await removeItemFromFavoriteList(userId, itemId);
      setFavoriteItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error("Error removing item from favorite list:", error);
    }
  };

  const handleAddItemToOrder = async (itemId) => {
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
  
        const selectedItem = favoriteItems.find((item) => item.id === itemId);
  
        if (selectedItem && selectedItem.availableStock === 0) {
          toast.error("Item is out of stock. Cannot be added to the order.");
          return;
        }
  
        await addItemToOrder(userIdFromToken, itemId);
        showAddedToOrderMessage(itemId);
        console.log("Item added to user order successfully.");
      } else {
        console.log("Invalid JWT token format");
      }
    } catch (error) {
      console.error('Error adding item to user order: Please Log In first');
    }
  };
  

  const showAddedToOrderMessage = (itemId) => {
    setAddedToOrderItemId(itemId);
    setAddedToOrderMessage('Item added to order!');
    setTimeout(() => {
    setAddedToOrderMessage('');
    setAddedToOrderItemId(null);
  }, 3000); 
  };

  

  return (
    <div className={classes.itemBody}>
      <div className={classes.header}>
      <div className={classes.backContainer}>
              <CustomLink to="/">
              <button className={classes.backBtn}>
                <FontAwesomeIcon icon={faArrowLeft} className={classes.icon} /> Back
              </button>
            </CustomLink>
              </div>

        <h1>Favorites</h1>
      </div>
      <div className={classes.itemBodySection}>
        {favoriteItems && favoriteItems.length > 0 ? (
          favoriteItems.map((item) => (
            <div key={item.id} className={`${classes.itemCard} ${item.availableStock === 0 ? classes.outOfStock : ''}`}>
              <div className={classes.itemCardInfo}>
                {item.availableStock === 0 && (
                  <div className={classes.outOfStockOverlay}>
                    <p>OUT OF STOCK</p>
                  </div>
                )}
                <img className={classes.itemImg} src={item.photoUrl} alt={item.title} />
                <h4>{item.title}</h4>
                <p>Price: ${item.priceUSD}</p>
                <p>Total in Stock: {item.availableStock}</p>

                <div className={classes.itemIcons}>
                  <button
                    className={`${classes.itemBtn} ${classes.addBtn}`}
                    onClick={() => handleAddItemToOrder(item.id)}
                  >
                    <FontAwesomeIcon icon={faShoppingCart} />
                  </button>

                  <button
                    className={`${classes.itemBtn} ${classes.removeBtn}`}
                    onClick={() => removeItemFromFavorites(userIdFromToken, item.id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
                {addedToOrderMessage && addedToOrderItemId === item.id && (
                    <div className={classes.addedToOrderMessage}>{addedToOrderMessage}</div>
                    )}
              </div>
            </div>
          ))
        ) : (
          <p>No favorites available</p>
        )}
      </div>
    </div>
  );
}
function CustomLink({ to, children, ...props }) {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });

  return (
    <div className={isActive ? classes.active : ""}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </div>
  );
}

export default FavoriteList;

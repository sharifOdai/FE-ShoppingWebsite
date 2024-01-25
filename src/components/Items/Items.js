import React, { useEffect, useState, useContext } from "react";
import { allItems, addItemToFavoriteList, addItemToOrder} from "../../services/api";
import { faHeart, faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AuthContext from "../context/AuthProvider";
import classes from '../Items/Items.module.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Items() {
  const [items, setItems] = useState([]);
  const authContext = useContext(AuthContext);
  const [addedToFavoritesMessage, setAddedToFavoritesMessage] = useState('');
  const [addedToFavoritesItemId, setAddedToFavoritesItemId] = useState(null);
  const [addedToOrderMessage, setAddedToOrderMessage] = useState('');
  const [addedToOrderItemId, setAddedToOrderItemId] = useState(null);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const allItemsApi = await allItems();
        setItems(allItemsApi.data);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchData();
  }, []);

  const handleAddToFavorite = async (itemId) => {
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

        await addItemToFavoriteList(userIdFromToken, itemId);
        showAddedToFavoritesMessage(itemId);
        console.log("Item added to favorite list successfully.");
      } else {
        console.log("Invalid JWT token format");
      }
    } catch (error) {
      console.error('Error adding item to favorite list: Please Log In First');
    }
  };

  const showAddedToFavoritesMessage = (itemId) => {
    setAddedToFavoritesItemId(itemId);
  setAddedToFavoritesMessage('Item added to favorites!');
  setTimeout(() => {
    setAddedToFavoritesMessage('');
    setAddedToFavoritesItemId(null);
  }, 3000); 
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
  
        const selectedItem = items.find((item) => item.id === itemId);
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
      console.error('Error adding item to user order', error);
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
    <>
      <div className={classes.itemBody}>
        <div className={classes.itemBodySection}>
          {items && items.length > 0 ? (
            items.map((item) => (
              <div key={item.id} className={classes.itemCard}>
                <div className={`${classes.itemCardInfo} ${item.availableStock === 0 ? classes.outOfStock : ''}`}>
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
                    <button className={`${classes.itemBtn} ${classes.heart}`} onClick={() => handleAddToFavorite(item.id)}>
                      <FontAwesomeIcon icon={faHeart} />
                    </button>
                    
                    <button className={`${classes.itemBtn} ${classes.add}`} onClick={() => handleAddItemToOrder(item.id)}>
                      <FontAwesomeIcon icon={faShoppingCart} />
                    </button>
                  </div>
                  {addedToFavoritesMessage && addedToFavoritesItemId === item.id && (
                    <div className={classes.addedToFavoritesMessage}>{addedToFavoritesMessage}</div>
                  )}
                  {addedToOrderMessage && addedToOrderItemId === item.id && (
                    <div className={classes.addedToOrderMessage}>{addedToOrderMessage}</div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>No items available</p>
          )}
        </div>
      </div>
    </>
  );
}

export default Items;

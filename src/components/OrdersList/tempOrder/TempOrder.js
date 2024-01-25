
import { Link, useMatch, useResolvedPath, useLocation } from "react-router-dom";
import React, { useContext, useState, useEffect} from "react";
import { getTempOrder,processPayment, removeItemFromTempOrder} from "../../../services/api";
import { faArrowLeft, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AuthContext from "../../context/AuthProvider";
import classes from "./TempOrder.module.css";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



function TempOrder(){
    const authContext = useContext(AuthContext);
    const [tempOrder, setTempOrder] = useState([]);
    const location = useLocation();
    const [userIdFromToken, setUserIdFromToken] = useState();
    const [orderId, setOrderId] = useState("");

    useEffect(() => {
        const fetchOrders = async () => {
          try {
            console.log("Auth context: ", authContext.auth);
      
            if (authContext.auth) {
              const tokenParts = authContext.auth.split(".");
      
              if (tokenParts.length === 3) {
                const decodedPayload = atob(tokenParts[1]);
                const payload = JSON.parse(decodedPayload);  
                const userIdFromTokenValue = payload.userId;
                setUserIdFromToken(userIdFromTokenValue);
                            
                if (userIdFromTokenValue) {
                  const tempOrdersResponse = await getTempOrder(userIdFromTokenValue);
      
                  setTempOrder(tempOrdersResponse.data);
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
      
        fetchOrders();
      }, [authContext.auth, location.pathname]);

      const handleProcessPayment = async (orderId) =>{

        try {
          const closedOrders = await processPayment(userIdFromToken, orderId);
          setTempOrder([]);  
          toast.success("Payment success, Order submitted to Closed Orders!");

        }catch(error){
          console.error("failed to process payment:", error)
        }
      };

      const handleRemoveItemFromOrderList = async (itemId) => {
        try {
          const splitToken = authContext.auth.split('.');
          if (splitToken.length === 3) {
            const decodedToken = atob(splitToken[1]);
            const tokenData = JSON.parse(decodedToken);
            const userIdFromToken = tokenData.userId;
            const orderId = tempOrder[0].orderId;
            setOrderId(orderId);
    
            setTempOrder((prevList) =>
            prevList.map((order) => ({
              ...order,
              items: order.items.filter((item) => item.id !== itemId),
            })).filter(order => order.items.length > 0) 
          );
          
            await removeItemFromTempOrder(orderId, itemId, userIdFromToken);
          }
        } catch (error) {
          console.error('Error removing item from favorite list:', error);
        }
      };
  
  
      const handleTempTotalPrice = () => {
        let totalPrice = 0;
            if (tempOrder[0].items && tempOrder[0].items.length > 0) {
          tempOrder[0].items.forEach((item) => {
            totalPrice += item.priceUSD;
          });
        }
      
        console.log(totalPrice);
        return totalPrice;
      };

      return (
        <div className={classes.orderMainContainer}>
          <div className={classes.backContainer}>
          <CustomLink to="/OrdersList">
              <button className={classes.backBtn}>
                <FontAwesomeIcon icon={faArrowLeft} className={classes.icon} /> Back
              </button>
            </CustomLink>
          </div>
    
          <div className={classes.tempContainer}>
            <h2 className={classes.temp}>Temp order</h2>
          </div>

          <div className={classes.tempOrderList}>
            {tempOrder.length > 0 ? (
              <div className={classes.tempOrderBox}>
                {tempOrder.map((order) => (
                  <div className={classes.tempOrderIdBox} key={order.orderId}>
                    <div className={classes.orderItemsBox}>
                      {order.items.map((item) => (
                        <div key={item.itemId} className={classes.tempOrderInfo}>
                          <img className={classes.itemImg} src={item.photoUrl} />
                          <p>{item.title}</p>
                          <p>price:{item.priceUSD}$</p>
                          <p>available stock:{item.availableStock}</p>
                          <button className={`${classes.itemBtn} ${classes.removeBtn}`} onClick={() => handleRemoveItemFromOrderList(item.id)}> <FontAwesomeIcon icon={faTrash} /> Remove </button>
                        </div>
                      ))}
                      
                    </div>
                  </div> 
              ))} 
            
                <div className={classes.ProcessPayment}>
                  <div className={classes.proccessPaymentInfo}>
                    
                    <div>
                    <p>Shipping address : {tempOrder[0].shippingAddress}</p>
                    <p>Order Total Price : {handleTempTotalPrice(tempOrder)}$</p>   
                    </div>
                    <button className={`${classes.itemBtn} ${classes.processbtn}`} onClick={() => handleProcessPayment(tempOrder[0].orderId)}>Submit Order</button>
                
                  </div>
                </div>
            
    
              </div>
            ) : (
              <p>No temp orders available</p>
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
    
            

export default TempOrder;
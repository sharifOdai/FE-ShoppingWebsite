import { Link, useMatch, useResolvedPath, useLocation, useNavigate} from "react-router-dom";
import React, { useContext, useState, useEffect, useRef } from "react";
import { getCloseOrders} from "../../../services/api";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AuthContext from "../../context/AuthProvider";
import classes from "./ClosedOrders.module.css";


function ClosedOrders(){
    const authContext = useContext(AuthContext);
    const [closedOrders, setClosedOrders] = useState([]);
    const location = useLocation();
    const [userIdFromToken, setUserIdFromToken] = useState();

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
                  const closedOrdersResponse = await getCloseOrders(userIdFromTokenValue);
      
                  setClosedOrders(closedOrdersResponse.data);
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
    
    
        
    
        const handleClosedTotalPrice = (order) => {
          let totalPriceForOrder = 0;
        
          if (order.items && order.items.length > 0) {
            order.items.forEach((item) => {
              totalPriceForOrder += item.priceUSD;
            });
          }
        
          console.log(totalPriceForOrder);
          return totalPriceForOrder;
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
        
              <div className={classes.closedContainer}>
                <h2 className={classes.closed}>CLOSED orders</h2>
              </div>
              <div className={classes.closedOrderList}>
                {closedOrders.length > 0 ? (
                  <div className={classes.closedOrdersBox}>
        
                    {closedOrders.map((order) => (
                      <div className={classes.closedOrderIdBox} key={order.orderId}>
                        <p>order id:{order.orderId}</p>
                        <p>Shipping address : {order.shippingAddress}</p>
                        <p>total price:{handleClosedTotalPrice(order)}$</p>
                        <div className={classes.closedOrderItemBox}>
                          {order.items.map((item) => (
                            <div key={item.itemId} className={classes.closedOrderInfo}>
                              <p>{item.title}</p>
                              <img className={classes.itemImg} src={item.photoUrl} />
                              <p>price:{item.priceUSD}$</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No closed orders available</p>
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
        
        
    export default ClosedOrders;
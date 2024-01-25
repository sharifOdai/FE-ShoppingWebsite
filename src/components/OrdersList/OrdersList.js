import { Link, useMatch, useResolvedPath} from "react-router-dom";
import React from "react";
import { faArrowLeft, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "./OrdersList.module.css";


function OrdersList() {    
  return (
    <div className={classes.orderMainContainer}>

           <CustomLink to="/">
              <button className={classes.backBtn}>
                <FontAwesomeIcon icon={faArrowLeft} className={classes.icon} /> Back
              </button>
            </CustomLink>

      <div className={classes.orderListHeader}>
        <h3>Orders</h3>
      </div>
    
    <div className={classes.orderBtnsBox}>
                <CustomLink to="/tempOrder" >
                    <button className={classes.orderBtns}>
                      Temp Order
                    </button>
                  </CustomLink>
                <CustomLink to="/closedOrders" >
                    <button className={classes.orderBtns}>
                      Closed Orders
                    </button>
                  </CustomLink>
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
  export default OrdersList;

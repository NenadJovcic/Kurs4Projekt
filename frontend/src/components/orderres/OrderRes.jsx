import React, { useEffect, useState } from "react";
import "../../styles/orderres.css";
import axios from "axios";
import jwt_decode from "jwt-decode";

const RestaurantOrders = () => {
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [orders, setOrders] = useState([]);
  const [update, setUpdate] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      await axios.get("http://localhost:3333/orders/ready").then((res) => {
        setSelectedOrders(res.data.orders);
      });
      await axios.get("http://localhost:3333/orders/unready").then((res) => {
        setOrders(res.data.orders);
      });
    };
    fetchData();
  }, [update]);

  async function handleCheckboxClick(id, ready) {
    const token = localStorage.getItem("auth-token");
    const config = {
      headers: { auth_token: token },
    };
    await axios
      .put(
        `http://localhost:3333/orders/${id}`,
        {
          ready: !ready,
        },
        config
      )
      .then((res) => {
        console.log(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
    if (update === id) {
      setUpdate(1);
    } else {
      setUpdate(id);
    }
  }

  const Order = ({ items, user, total, _id, ready }) => {
    const itemQuantities = {};
    let orderTotal = 0; // initialize order total to zero
    
    items.forEach((item) => {
      if (item.name in itemQuantities) {
        itemQuantities[item.name] += 1;
      } else {
        itemQuantities[item.name] = 1;
      }
      orderTotal += item.price; // calculate total price for all items in the order
    });
    
    return (
      <div className="order" key={_id}>
        <input
          type="checkbox"
          checked={ready}
          onChange={() => handleCheckboxClick(_id, ready)}
        />
        {items &&
          Object.entries(itemQuantities).map(([name, quantity]) => {
            const sum = items.reduce(
              (accumulator, currentValue) =>
                currentValue.name === name
                  ? accumulator + currentValue.price
                  : accumulator,
              0
            );
            return (
              <div key={name}>
                <h4>
                  {name} x {quantity}
                </h4>
              </div>
            );
          })}
        <h3>Order Total Price: {orderTotal}</h3> {/* display order total */}
        <p>{user.userName}</p>
        {ready ? (
          <button
            onClick={() => {
              handleCheckboxClick(_id, ready);
            }}
          >
            Customer Picked it Up
          </button>
        ) : null}
      </div>
    );
  };
  
  

  const OrderList = ({ orders }) => (
    <div className="order-list">
      {orders.map(({ _id, ready, ...rest }) =>
        !ready ? <Order {...rest} _id={_id} ready={ready} key={_id} /> : null
      )}
    </div>
  );

  const SelectedOrderList = ({ orders }) => {
    if (selectedOrders.length === 0) {
      return <p>There are no ready orders yet.</p>;
    }
    return (
      <>
        <h1 className="title-orders">Waiting orders to collect by drivers:</h1>
        <div className="order-list">
          {selectedOrders.map(({ _id, ready, ...rest }) => (
            <Order {...rest} _id={_id} ready={ready} key={_id} />
          ))}
        </div>
      </>
    );
  };

  return (
    <div>
      <h1 className="title-orders">Income Order List</h1>
      <OrderList orders={orders} />
      <SelectedOrderList orders={orders} />
    </div>
  );
};

export default RestaurantOrders;

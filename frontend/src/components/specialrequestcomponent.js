import React, { useState } from "react";
import { Navigate } from "react-router-dom";

const Requestitem = ({ data }) => {
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [requestDetails, setRequestDetails] = useState({
    name: "",
    date: "",
    specialRequest: "",
  });
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const handleSpecialRequestClick = (orderId) => {
    setSelectedOrderId(orderId); // Show inputs for the selected order
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRequestDetails({ ...requestDetails, [name]: value });
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault(); // Prevent default form submission
    const token = localStorage.getItem("token");
    if (!token) {
      Navigate("/");
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/order/specialrequest",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId: selectedOrderId,
            specialRequest: requestDetails.specialRequest,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit the special request.");
      }

      const result = await response.json();
      console.log("Special Request Saved:", result);

      // Show the popup
      setIsPopupVisible(true);

      // Hide the popup after 3 seconds
      setTimeout(() => setIsPopupVisible(false), 3000);

      // Reset the form and close input fields
      setRequestDetails({ name: "", date: "", specialRequest: "" });
      setSelectedOrderId(null);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  return (
    
    <div className="Feedbackitems">
      
      {data.map((order) => (
        <div key={order._id} className="order-item">
          <h2>Order ID: {order._id}</h2>
          <p style={{ color: "#4CAF50" }}>Status: {order.status}</p>
          <p style={{ color: "#2196F3" }}>
            <strong>Total Price: $</strong>
            {order.totalPrice}
          </p>
          <ul style={{ paddingLeft: "20px", marginTop: "10px", color: "red" }}>
            {order.items.map((item, index) => (
              <li key={index} style={{ marginBottom: "5px" }}>
                {item.menuItem.name} x {item.quantity} - ${" "}
                {item.menuItem.price * item.quantity}
              </li>
            ))}
          </ul>
          {selectedOrderId === order._id ? (
            <div className="special-request">
              <form
                className="special-request-form"
                onSubmit={handleSubmitRequest}
              >
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={requestDetails.name}
                  onChange={handleInputChange}
                  required // Ensures the field is filled
                />
                <input
                  type="date"
                  name="date"
                  value={requestDetails.date}
                  onChange={handleInputChange}
                  required // Ensures the date is selected
                />
                <textarea
                  name="specialRequest"
                  placeholder="Enter Special Request"
                  value={requestDetails.specialRequest}
                  onChange={handleInputChange}
                  required // Ensures the textarea is not empty
                ></textarea>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <button type="submit">Submit Request</button>
                  <button
                    type="button"
                    onClick={() => setSelectedOrderId(null)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <button onClick={() => handleSpecialRequestClick(order._id)}>
              Send Special Request
            </button>
          )}
        </div>
      ))}

      {/* Popup */}
      {isPopupVisible && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: "20px",
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: "5px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            zIndex: 1000,
            textAlign: "center",
          }}
        >
          <h3>Request Sent Successfully!</h3>
        </div>
      )}

      {/* Overlay to dim the background */}
      {isPopupVisible && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 999,
          }}
        ></div>
      )}
    </div>
  );
};

export default Requestitem;

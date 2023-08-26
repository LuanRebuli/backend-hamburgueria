const express = require("express");
const uuid = require("uuid");

const port = 3000;
const app = express();
app.use(express.json());

const orders = [];

const checkOrderId = (request, response, next) => {
  const { id } = request.params;

  const index = orders.findIndex((orderList) => orderList.id === id);

  if (index < 0) {
    return response.status(404).json({ error: "User not found" });
  }

  request.orderIndex = index;
  request.orderId = id;

  next();
};

app.get("/order", (request, response) => {
  return response.json(orders);
});

app.post("/order", (request, response) => {
  const { order, clienteName, price, status } = request.body;

  const orderList = { id: uuid.v4(), order, clienteName, price, status };

  orders.push(orderList);

  return response.status(201).json(orderList);
});

app.put("/order/:id", checkOrderId, (request, response) => {
  const { order, clienteName, price, status } = request.body;
  const index = request.orderIndex;
  const id = request.orderId;

  const updatedOrder = { id, order, clienteName, price, status };

  orders[index] = updatedOrder;

  return response.json(updatedOrder);
});

app.delete("/order/:id", checkOrderId, (request, response) => {
  const index = request.orderIndex;

  orders.splice(index, 1);

  return response.status(204).json();
});

app.patch("/order/:id", checkOrderId, (request, response) => {
  const id = request.orderId;
  const index = orders.findIndex((orderList) => orderList.id === id);
  orders[index].status = "Pronto";

  return response.json(orders[index]);
});

app.listen(port, () => {
  console.log(`Server started on ${port}`);
});

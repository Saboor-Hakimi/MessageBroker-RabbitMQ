const express = require("express");
const app = express();
const PORT = process.env.PORT || 4002;

app.use(express.json());

const amqp = require("amqplib");
var channel, connection;

connectQueue();

async function connectQueue() {
  try {
    connection = await amqp.connect("amqp://localhost:5672");
    channel = await connection.createChannel();

    await channel.assertQueue("test-queue");

    channel.consume("test-queue", (data) => {
      console.log(`${Buffer.from(data.content)}`);
      channel.ack(data);
    });
  } catch (error) {
    console.log(error);
  }
}

app.listen(PORT, () => console.log("Server running at port " + PORT));

const express = require("express");
const app = express();
const PORT = process.env.PORT || 4001;
const amqp = require("amqplib");

var channel, connection;

async function connectQueue() {
    try {
        connection = await amqp.connect("amqp://localhost:5672");
        channel = await connection.createChannel();

        await channel.assertQueue("test-queue");
    } catch (error) {
        console.log(error);
    }
}

connectQueue();

async function sendData(data) {
    await channel.sendToQueue("test-queue", Buffer.from(JSON.stringify(data)));
    await channel.close();
    await connection.close();
}

app.use(express.json());
app.get("/send-msg", (req, res) => {
    const data = {
        name: "Saboor Hakimi",
        age: 22,
    };

    sendData(data);

    console.log("A message was sent to the queue");

    res.send("Hello world");
});
app.listen(PORT, () => console.log("Server running at port " + PORT));

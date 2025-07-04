const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const port = 3000;

const app = express();
app.use(express.json());

let db;

async function connectToMongoDB(){
    const uri = "mongodb://localhost:27017";
    const client = new MongoClient(uri);
    try {
        await client.connect();
        console.log("Connected to MongoDB!");
        db = client.db("testDB");
    } catch (err) {
        console.error("Error:", err);
    }
}
connectToMongoDB();

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// USERS COLLECTION --------------------------------

// Create User (Register)
app.post('/users', async (req, res) => {
    try {
        const user = req.body;
        user.createdAt = new Date();
        const result = await db.collection('users').insertOne(user);
        res.status(201).json({ id: result.insertedId });
    } catch (err) {
        res.status(400).json({ error: "Invalid user data" });
    }
});

// Get All Users
app.get('/users', async (req, res) => {
    try {
        const users = await db.collection('users').find().toArray();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

// DRIVERS COLLECTION --------------------------------

// Create Driver
app.post('/drivers', async (req, res) => {
    try {
        const driver = req.body;
        driver.createdAt = new Date();
        const result = await db.collection('drivers').insertOne(driver);
        res.status(201).json({ id: result.insertedId });
    } catch (err) {
        res.status(400).json({ error: "Invalid driver data" });
    }
});

// Get All Drivers
app.get('/drivers', async (req, res) => {
    try {
        const drivers = await db.collection('drivers').find().toArray();
        res.status(200).json(drivers);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch drivers" });
    }
});

// Update Driver Availability
app.patch('/drivers/:id', async (req, res) => {
    try {
        const result = await db.collection('drivers').updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: req.body }
        );
        if (result.modifiedCount === 0) {
            return res.status(404).json({ error: "Driver not found" });
        }
        res.status(200).json({ updated: result.modifiedCount });
    } catch (err) {
        res.status(400).json({ error: "Invalid driver ID or data" });
    }
});

// RIDES COLLECTION --------------------------------

// Create Ride
app.post('/rides', async (req, res) => {
    try {
        const ride = req.body;
        ride.requestedAt = new Date();
        const result = await db.collection('rides').insertOne(ride);
        res.status(201).json({ id: result.insertedId });
    } catch (err) {
        res.status(400).json({ error: "Invalid ride data" });
    }
});

// Get All Rides
app.get('/rides', async (req, res) => {
    try {
        const rides = await db.collection('rides').find().toArray();
        res.status(200).json(rides);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch rides" });
    }
});

// Update Ride Status
app.patch('/rides/:id', async (req, res) => {
    try {
        const result = await db.collection('rides').updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: { status: req.body.status } }
        );
        if (result.modifiedCount === 0) {
            return res.status(404).json({ error: "Ride not found" });
        }
        res.status(200).json({ updated: result.modifiedCount });
    } catch (err) {
        res.status(400).json({ error: "Invalid ride ID or data" });
    }
});

// Delete Ride
app.delete('/rides/:id', async (req, res) => {
    try {
        const result = await db.collection('rides').deleteOne(
            { _id: new ObjectId(req.params.id) }
        );
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Ride not found" });
        }
        res.status(200).json({ deleted: result.deletedCount });
    } catch (err) {
        res.status(400).json({ error: "Invalid ride ID" });
    }
});

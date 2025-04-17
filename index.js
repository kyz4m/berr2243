const { MongoClient } = require('mongodb');

// Task 1: Define drivers array
const drivers = [
  {
    name: "John Doe",
    vehicleType: "Sedan",
    isAvailable: true,
    rating: 4.8
  },
  {
    name: "Alice Smith",
    vehicleType: "SUV",
    isAvailable: false,
    rating: 4.5
  }
];

// Task 2: Display driver names
console.log("Driver Names:");
drivers.forEach(driver => console.log(driver.name));

// Task 2: Add new driver
drivers.push({
  name: "Bob Johnson",
  vehicleType: "Truck",
  isAvailable: true,
  rating: 4.7
});

async function main() {
  const uri = "mongodb://localhost:27017";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("testDB");
    const driversCollection = db.collection("drivers");

    // Task 3: Insert all drivers
    const insertResult = await driversCollection.insertMany(drivers);
    console.log(`Inserted ${insertResult.insertedCount} drivers`);

    // Task 4: Find available drivers (rating >= 4.5)
    const availableDrivers = await driversCollection.find({
      isAvailable: true,
      rating: { $gte: 4.5 }
    }).toArray();
    console.log("Available Drivers:", availableDrivers);

    // Task 5: Update John Doe's rating
    const updateResult = await driversCollection.updateOne(
      { name: "John Doe" },
      { $inc: { rating: 0.1 } }
    );
    console.log(`Updated ${updateResult.modifiedCount} driver(s)`);

    // Task 6: Delete unavailable drivers
    const deleteResult = await driversCollection.deleteMany({
      isAvailable: false
    });
    console.log(`Deleted ${deleteResult.deletedCount} driver(s)`);

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.close();
  }
}

main().catch(console.error);

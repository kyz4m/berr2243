const { MongoClient } = require('mongodb');


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



drivers.push({
    name: "Bob Johnson",
    vehicleType: "Hatchback",
    isAvailable: true,
    rating: 4.6
});

drivers.forEach(driver => {
    console.log("Driver Name:", driver.name);
});

async function main(){
    //Replace <connection-string> with you MongoDB URI
    const uri = "mongodb://localhost:27017"
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("Connected to MongoDB:");

        const db = client.db("testDB");
        const collection = db.collection("users");
        const driversCollection = db.collection("drivers");

        /*
        for (const driver of drivers) {
            const result = await driversCollection.insertOne(driver);
            console.log(`New driver created with ID: ${result.insertedId}`);
        }
        */
        
        /*
        const updateResult = await db.collection('drivers').updateMany(
            { name: "John Doe" },
            { $inc: { rating: 0.1 } }
        );
        console.log(`Driver updated with result: ${updateResult} `);
        */
        
        
        const availableDrivers = await db.collection('drivers').find(
            {
                isAvailable: true,
                rating: { $gte: 4.5 }
            }
        ).toArray();
        console.log("Available drivers:", availableDrivers);
        

        const deleteResult = await db.collection('drivers').deleteMany(
            { isAvailable: false }
        );
        console.log(`Driver deleted with result: ${deleteResult}`);


    } catch (err) {
        console.error("Error:", err);
    } finally {
        await client.close();
    }
    
}

main();

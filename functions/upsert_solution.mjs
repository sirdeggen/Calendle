import { MongoClient } from "mongodb";

const mongoClient = new MongoClient(process.env.MONGODB_URI);
const clientPromise = mongoClient.connect();

export const handler = async (event, context) => {
    console.log("upsert_solution function called");
    const body = JSON.parse(event.body); // Parse the request body
    const { date, board } = body; // Destructure the body parameters
    console.log("Date: ", date);
    console.log("Board: ", board);

    try {
        console.log("Connecting to MongoDB");
        
        console.log("Database: ", process.env.MONGODB_DATABASE);
        console.log("Collection: ", process.env.MONGODB_COLLECTION_SOLUTIONS);

        const database = (await clientPromise).db(process.env.MONGODB_DATABASE);
        const collection = database.collection(process.env.MONGODB_COLLECTION_SOLUTIONS);

        let currentSolution = '';

        currentSolution = await collection.findOne({date: date.toString()});

        console.log("Current Solution: ", currentSolution);
        let result = {};
        if (currentSolution) {
            // if current solution is already logged, do not add it
            if (deepCompareArrays) {
                const array = currentSolution.solutions || [];
                const exists = array.some(sol => deepCompareArrays(sol, board));
                if (exists) {
                    console.log("Solution already exists");
                    return {
                        statusCode: 200,
                        body: JSON.stringify({ message: "Solution already exists" }),
                    };
                }
            }

            console.log("Updating existing solution");
            result = await collection.updateOne(
                { date: date.toString() },
                { $push: { solutions: board } }
            );

        } else {
            console.log("Inserting new solution");
            result = await collection.insertOne({date: date.toString(), solutions: [board]});
        }

        return {
            statusCode: 200,
            body: JSON.stringify(result),
        }
    } catch (error) {
        console.log("Error: ", error.toString());
        return { statusCode: 500, body: error.toString() }
    }
}

const deepCompareArrays = (arr1, arr2) => {
    // Check if both arguments are arrays
    if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
        throw new Error("Both arguments must be arrays");
    }

    // Check if lengths are different
    if (arr1.length !== arr2.length) {
        return false;
    }

    // Compare each element
    for (let i = 0; i < arr1.length; i++) {
        const el1 = arr1[i];
        const el2 = arr2[i];

        // Check if both elements are arrays
        if (Array.isArray(el1) && Array.isArray(el2)) {
            // Recursively compare nested arrays
            if (!deepCompareArrays(el1, el2)) {
                return false;
            }
        } else if (el1 !== el2) {
            // Compare primitive values
            return false;
        }
    }

    return true; // All elements matched
}
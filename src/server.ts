import { app } from "./app";

app.listen({
    port: 4444,
}, (err) => {
    if(err) {
        console.error("An error has occured.", err)
        throw new Error("An exception has occured.")
    }

    console.log("HTTP server is running.")
})
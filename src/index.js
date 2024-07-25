import dotenv from "dotenv"
import dayjs  from "dayjs"
dotenv.config({});
import express from 'express'
import { google } from 'googleapis'

const calendar = google.calendar({
    version: 'v3',
    auth: process.env.API_KEY

})
const app = express()

import axios from 'axios'

const PORT =process.env.NODE_ENV || 8000;

const  oauth2Client = new google.auth.OAuth2 (
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL
)


const scopes = [
    'https://www.googleapis.com/auth/calendar'
  ];

app.get('/google' , (req, res)=>{
    const url = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: scopes,
    });

    res.redirect(url)
});

app.get('/google/redirect', async (req, res)=>{
    console.log(req.param);
    const code = req.query.code;
    // This will provide an object with the access_token and refresh_token.
    // Save these somewhere safe so they can be used at a later time.
    const {tokens} = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokens);

    res.send({
        msg: "YOu have succesfuly logged in",
})
})

app.get("/google/schedule_event", async (req , res) =>{
    const result = await calendar.events.insert({
        calendarId: "primary",
        auth:oauth2Client,
        requestBody: {
            summary: 'THIS IS A TEXT EVENT',
            description: "This is a very important event",
            start : {

                dateTime: dayjs(new Date()).add(1,  "day").toISOString(),
                timeZone: "Africa/Kampala"
            },
            end: {
                dateTime: dayjs(new Date()).add(1,  "day").toISOString(),
                timeZone: "Africa/Kampala"

            }
        }
    })

    res.send({
        msg: "Done"
    })
});

app.listen(PORT,() => {
    console.log("Server started on port ", PORT);
});
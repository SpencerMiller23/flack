# Project 2

Web Programming with Python and JavaScript

This project is a scaled down version of an app similar to the messaging platform Slack. The app allows users to create channels and send and receive messages without having to refresh the page. This functionality is achieved using Websockets, Python and JavaScript. The requirements.txt file contains all the packages needed to run the app. Now I will provide some detail about the templates. First there is the layout.html file while provides the main template for the app. Next there is the index.html file which is the page that renders when the user first calls the website. Finally, dashboard.html is the template for the SPA which houses most of the apps functions. In addition, there is a styles.scss file which contains all the styles for the app.

The files which pertain to the logic of the app start with application.py. In this file is a Message class which is used for creating and storing each message. Next there is the index route which renders the registration page, followed by the dashboard route which renders the app. In addition there is a route for fetching relevant messages from the server and the socket events needed for creating a channel and sending messages.


The index.js file contains the code for processing the user registration and remembering users that have already signed in. Finally dashboard.js is where most of the client-side functionality is kept. In this file are methods for creating new channels, sending and receiving messages and logging out.

For my personal touch, I decided to add a header to the messages container which displays the current channel. While simple, I think it's a very necessary feature in the app.

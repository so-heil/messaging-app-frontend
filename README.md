# Real-Time Messaging App 💬

This app is a real-time, Telegram style messaging app written in TypeScript (Next.js and Nest.js) which allows users to create groups and start conversations with other users!

## Features

-   Login with phone number (powered by firebase and Nest.js)
-   Create new groups and chat in real-time (powered by socket.io) with other users in groups
-   Users have their own nickname and profile picture which could be set in the login process and updated later.
-   Telegram styled
-   Users can create contacts and add some one on the app by their phone number.

## Technologies used

Both Front-End and Back-End are written in **TypeScript** and everything is **strongly-typed** and **OOP** based.

### Front-end

-   _Framework_ : Next.js
-   _Styling_: Material UI (some TextFields and Skeleton), Tailwind CSS and react-transition-group (animations)
-   _State Management_: Redux with redux-thunk to handle side effects logic (AJAX requests)
-   _HTTP Client_: Axios
-   _Web Socket Client_: socket.io-client & strongly-typed-events
-   _Phone Authentication and Cloud Storage_: Firebase

### Back-end

-   _Framework_: [Nest.js](https://docs.nestjs.com/)
-   _Database_: PostgreSQL
-   _ORM_: TypeORM
-   _Web Socket_: Socket.io
-   _Authentication_: Session-based auth working with firebase-admin (for login)

## Project breakdown and demos

### Login Page

In login page step-1 users enter their phone number (the cant choose their country using the CountryPicker modal) and submit, we send this phone number to firebase (on client-side).
![Login Page Step 1](https://raw.githubusercontent.com/so-heil/messaging-app-frontend/master/public/demos/login-1.gif)

If phone number is valid, user receives a SMS containing the code, and app goes to login step-2 in which user enters the code, if code is valid firebase gives us a token which we send to our backend and we check the token and get the phone number and uid from it, if the user exists in DB user logs in, else user sets a name and profile picture for their account and then logs in and redirects to Chat Page.
![Login Page Step 2](https://raw.githubusercontent.com/so-heil/messaging-app-frontend/master/public/demos/login-2.gif)

### Chat Page

There is a sidebar (has 3 modes: Chats, Contacts, Settings) and a Messages container in Chat Page, users can create groups (everyone has access) as shown below:
![Creat Group](https://raw.githubusercontent.com/so-heil/messaging-app-frontend/master/public/demos/create-group.gif)

By clicking on available chats in the sidebar, messages load from server and user can send messages to the selected group, on the server message saves in the database and emits to all online clients using WebSocket:
![Chat](https://raw.githubusercontent.com/so-heil/messaging-app-frontend/master/public/demos/chat-2.gif)

Users are able to update their nickname and profile picture from settings panel in the sidebar:
![Update Profile](https://raw.githubusercontent.com/so-heil/messaging-app-frontend/master/public/demos/update-profile.gif)

Users can add each-other as contacts (by custom name using their phone number) each user's contacts are saved in DB and only that specific user can access them.
![Contacts](https://raw.githubusercontent.com/so-heil/messaging-app-frontend/master/public/demos/contacts.gif)

By the way, every REST request and Socket event is checked that it has been sent from a valid user or not!

## How to run on your local machine

1.  Clone client and server files to your system
2.  Create a new firebase app , in firebase console go to Project Settings and copy config of web app and create a `firebase-config.json` in `client/src/config/` and [Add the Firebase Admin SDK to server](https://firebase.google.com/docs/admin/setup).
3.  You should create and run a PostgreSQL database, there is a .sh file on `server/src/start-db.sh` that does this on docker for you.
4.  Create a `.env` file matching your DB config, it's pre written in `.env.template` (matches the `start-db.sh` defaults)
5.  Install node_modules by `npm install` or `yarn install`
6.  Start server on development mode by `npm run start:dev` or `yarn start:dev`
7.  To run the client app install node_modules by `npm install` or `yarn install` and run it by `npm run dev` or `yarn dev` and you should be able to see on your browser on `http://localhost:8000/` (You may see some CORS related errors that you should disable it)

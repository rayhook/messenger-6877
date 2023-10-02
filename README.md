# Messenger

A one-to-one realtime chat app.

## Data model

The data model consists of User, Conversations and Messages tables.

![data model](https://imgur.com/RHCkJSc)

## Initial Setup

Create the PostgreSQL database (these instructions may need to be adapted for your operating system):

```
psql
CREATE DATABASE messenger;
\q
```

Create a .env file in the server directory and add your session secret:

```
SESSION_SECRET = "your session secret"
```

In the server directory, install dependencies and then seed the database:

```
cd server
npm install

```

In the client folder, install dependencies:

```
cd client
npm install
```

### Running the Application Locally

In one terminal, start the front end:

```
cd client
npm start
```

In a separate terminal, start the back end:

```
cd server
npm run dev
```

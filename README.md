# Rhythm Realm

Rhythm Relam is a dynamic music application that allows uers to create and display their music profiles, including their instruments/vocal skills and music listening tastes. Users can find people with similar music interests, post requests for musicians to jam with, and create their own music using an AI model.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)

## Features

- **User Authentication**: Secure registration and login with JWT and MongoDB.
- **Profile Management**: Users can create and update their music profiles including instruments/vocal skills and music listening tastes. 
- **Jam Mates**: Users can find people with similar music tastes.
- **Playlist Management**: Users can create playlists and add tracks.
- **Event Management**: Users can create, update, delete, and RSVP to events by posting if they are looking for a drummer, guitarist, singer, etc. to jam with.
- **Music Generation and Visualization**: Users can generate their own music sequences from an initial prompt and visualize the music as it plays.

## Technology Stack

- **Backend**: Node.js, Express.js, JavaScript, MongoDB (with Mongoose for ORM)
- **Frontend**: EJS templating, HTML, CSS, JavaScript
- **Authentication**: JWT (JSON Web Token)
- **Music Generation and Visualization**: Magenta.js

## Installation

1. Clone the repository: 
```bash
    git clone https://github.com/AryanAAB/RhythmRealm
    cd RhythmRealm
```

2. Install dependencies:
```bash
    npm install
```

3. Set up environment variables:
    - Create a `.env` file in the root directory.
    - Add the following variables:
```plaintext
    PORT=3000
    MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

4. Start the application: 
```bash
    npm start
```
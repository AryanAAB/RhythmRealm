# Rhythm Realm

Rhythm Realm is a dynamic and interactive music-making website designed to bring musicians and music enthusiasts together. The platform allows users to create detailed music profiles, showcasing their instruments, vocal skills, and music listening tastes. With features for discovering like-minded individuals, sharing music preferences, participating in music projects and events, creating new playlists, and generating their own music sequences, Rhythm Realm aims to foster a vvibrant community of music lovers.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Usage](#usage)
- 
## Features

- **User Authentication**: Secure registration and login with JWT and MongoDB.
- **User Location**: Users can share their locations for events/friend requests using GEOCODE.
- **Profile Management**: Users can create and update their music profiles including instruments/vocal skills and music listening tastes. 
- **Jam Mates**: Users can find people with similar music tastes.
- **Playlist Management**: Users can create playlists and add tracks.
- **Event Management**: Users can create, update, delete, and RSVP to events by posting if they are looking for a drummer, guitarist, singer, etc. to jam with.
- **Music Generation and Visualization**: Users can generate their own music sequences from an initial prompt and visualize the music as it plays.

## Technology Stack

- **Backend**: Node.js, Express.js, JavaScript, MongoDB (with Mongoose for ORM), GEOCODE (for user location services)
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
    JWT_SECRET=YOUR_SECRET_KEY
    MONGODB_URI=YOUR_MONGDB_URI
    GEOCODE_KEY=YOUR_GEOCODE_KEY
```

4. Start the application: 
```bash
    npm start
```

## Usage

1. **Registration and Login**: Users can register and login to access the app's features.
2. **Profile Management**: Users can update their music preferences and location on their profile page.
3. **Add Friends**: Users can find people with similar music tastes.
4. **Event Management**: Users can create, update, delete, and RSVP to events.
5. **Playlist Management**: Users can create playlists and add tracks.
6. **Generate Music**: Users can generate and visualize their own music sequences.

## References
1. Video Conference Room: https://www.youtube.com/watch?v=HX6AM_1-jNM 
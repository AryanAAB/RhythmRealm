# Rhythm Realm

Rhythm Realm is a dynamic and interactive music-making website designed to bring musicians and music enthusiasts together. The platform allows users to create detailed music profiles and showcase their instruments, vocal skills, and music listening tastes. With features for discovering like-minded individuals, sharing music preferences, participating in music projects and events, meeting in virtual jam sessions with real-time audio streaming, creating new playlists, and generating one's own music sequences, Rhythm Realm aims to foster a vibrant community of music lovers.

## Table of Contents

- [Objectives](#objectives)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Usage](#usage)
- 
## Objectives

- Provide a platform for users to create detailed music profiles.
- Facilitate the discovery of musicians with similar interests.
- Enable users to organize and participate in music events.
- Allow users to create and share playlists.
- Integrate real-time audio streaming for virtual jam sessions.
- Offer generative tools for music sequences.

## Technology Stack

- **Backend**: Node.js, Express.js, JavaScript, MongoDB (with Mongoose for ORM)
- **Frontend**: EJS templating, HTML, CSS, JavaScript
- **Authentication**: JWT (JSON Web Token)
- **User Location Services**: OpenCage Geocoding
- **Real-Time Communication**: Agora.io
- **Music Generation and Visualization**: Magenta.js

## Installation

Make sure you have a database in MongoDB Atlas, OpenCage Geocoding, and Agora. You can create one by visiting the following links.

- [MongoDB Atlas](https://www.mongodb.com/atlas)
- [OpenCage Geocoding](https://opencagedata.com/api)
- [Agora](https://www.agora.io/en/)

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
    JWT_SECRET=YOUR_JWT_SECRET
    MONGODB_URI=YOUR_MONGODB_URI
    GEOCODE_KEY=YOUR_OPENCAGE_KEY
    APP_ID=YOUR_AGORA_APP_ID 
    TOKEN=YOUR_AGORA_APP_TOKEN
    CHANNEL=YOUR_AGORA_APP_CHANNEL
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
6. **Real-Time Jam Sessions**: Users can participate in virtual jam sessions with real-time audio streaming using Agora.io. 
7. **Generate Music**: Users can generate and visualize their own music sequences.

## 

## References
1. Video Conference Room: https://www.youtube.com/watch?v=HX6AM_1-jNM 
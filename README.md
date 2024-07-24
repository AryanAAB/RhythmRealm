# Rhythm Realm

Rhythm Realm is a dynamic and interactive music-making website designed to bring musicians and music enthusiasts together. The platform allows users to create detailed music profiles and showcase their instruments, vocal skills, and music listening tastes. With features for discovering like-minded individuals, sharing music preferences, participating in music projects and events, meeting in virtual jam sessions with real-time audio streaming, creating new playlists, and generating one's own music sequences, Rhythm Realm aims to foster a vibrant community of music lovers.

## Table of Contents

- [Objectives](#objectives)
- [Technology Stack](#technology-stack)
- [Frameworks Used](#frameworks-used)
- [Key Features](#key-features)
- [Installation](#installation)
- [Usage](#usage)
- [References](#references)

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

## Frameworks Used

1) MongoDB
    
    MongoDB is a NoSQL database known for its flexibility and scalability. **In Rhythm Realm, MongoDB is used to store various types of data including user profiles, music preferences, playlists, and events.** Its schema-less nature allows for easy modification and scaling as the application grows.

2) Agora
    
    Agora is a real-time audio and video communication service. **In Rhythm Realm, Agora is used to facilitate real-time audio streaming for live music sessions and virtual events.** Its low latency and high-quality audio capabilities ensure a seamless and interactive experience for users. By integrating Agora, the platform can provide robust audio communication features, enhancing the collaborative aspects of the music-making process.

3) OpenCage Geocoding

    OpenCage Geocoding is a service that converts addresses into geographic coordinates. **Rhythm Realm utilizes OpenCage Geocoding to enable location-based features such as finding nearby musicians to jam with.** By integrating this service, the platform can offer personalized location-based recommendations and enahnce the user experience with accurate geolocation data.

4) Magenta.js

    Magenta.js is a JavaScript library for creating music with machine learning. **In Rhythm Realm, Magenta.js is used for generating and visualizing music sequences.** The library helps uses generate new musical data based on the input data. This adds a creative and innovative dimension to the platform, allowing users to explore and visualize music in unique ways. 

## Key Features

1) **User Authentication and Profiles**
    - Secure user registration and login using JWT.
    - Comprehensive user profiles displaying instruments played, vocal skills, and music listening preferences.
    - Options to update and manage personal music preferences easily.

2) **Music Preferences and Instrument Categories**
    - Categorized checkboxes for different types of music instruments and listening tastes.
    - Expandable catageories for detailed selection and easy navigation.

3) **Playlist Management**
    - Create and manage personalized playlists with an intuitive interface.
    - Add tracks to playlists with options to select from a variety of music tracks.

4) **Event Management**
    - Create, update, and manage music-related events.
    - RSVP to events and see who else is attending.

5) **Music Collaboration**
    - Post friend requests for musicians to jam with and find collaborators based on music preferences.

6) **Real-Time Interaction**
    - Real-time user interaction with Agora.io.

7) **Music Generation and Visualization**
    - Generate new music sequences from a given sequence using Magenta.js.
    - Visualize generated music in a user-friendly interface.
    - Download the music generated.

## Installation

Make sure you have a database in MongoDB Atlas, OpenCage Geocoding, and Agora.io. You can create one by visiting the following links.

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

## References
1. Video Conference Room: https://www.youtube.com/watch?v=HX6AM_1-jNM 
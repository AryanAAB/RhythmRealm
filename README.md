# Rhythm Realm

Rhythm Realm is a dynamic and interactive music-making website designed to bring musicians and music enthusiasts together. The platform allows users to create detailed music profiles and showcase their instruments, vocal skills, and music listening tastes. With features for discovering like-minded individuals, sharing music preferences, participating in music projects and events, meeting in virtual jam sessions with real-time audio streaming, creating new playlists, and generating one's own music sequences, Rhythm Realm aims to foster a vibrant community of music lovers.

## Table of Contents

- [Problem Statement](#problem-statement)
- [Objectives](#objectives)
- [Technology Stack](#technology-stack)
- [Frameworks Used](#frameworks-used)
- [Key Features](#key-features)
- [Installation](#installation)
- [Implementation Details](#implementation-details)
    - [API Endpoints](#api-endpoints)
    - [Models](#models)
- [Challenges](#challenges)
- [Future Scope](#future-scope)
- [References](#references)

## Problem Statement

In today's digital age, musicians and music enthusiasts often struggle to find like-minded individuals to collaborate with, share their music journeys, and discover new opportunities. For example, musicians face several challenges including isolation, limited collaboration tools, event management, and discoverability. Rhythm Realm aims to address these challenges by creating a comprehensive, user-friendly platform that brings together musicians and music lovers from around the world. By offering a range of features such as customizable profiles, real-time audio streaming, event management, and personalized recommendations, Rhythm Realm seeks to foster a vibrant, supportive, and collaborative music community where users can thrive and grow together.

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

    OpenCage Geocoding is a service that converts addresses into geographic coordinates. **In Rhythm Realm, OpenCage Geocoding is used to enable location-based features such as finding nearby musicians to jam with.** By integrating this service, the platform can offer personalized location-based recommendations and enahnce the user experience with accurate geolocation data.

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

## Implementation Details

### API Endpoints

1) **Authentication**
    - `POST /auth/signup/`: Register a new user
    - `POST /auth/login/`: Login a user

2) **Users**
    - `GET /api/users/`: Gets a list of all the users

3) **Profile**: 
    - `GET /api/profile/`: Gets all the details about the user
    - `POST /api/profile/`: Updates the user profile
    - `POST /api/profile/updateLocation/`: Updates the user location

4) **Friends**
    - `POST /api/friends/`: Sends a new friend request
    - `POST /api/friends/respond/:id/`: Responds to a friend request
    - `GET /api/friends/sent/`: Gets all the friend requests that the user sent
    - `GET /api/friends/received/`: Gets all the friend requests that the user receives
    - `GET /api/friends/archived/`: Gets all the friend requests that are archived 

5) **Event**
    - `GET /api/events/`: Gets all the events
    - `POST /api/events/`: Creates a new event
    - `DELETE /api/events/:id/`: Deletes an event by ID
    -  `POST /api/events/:id/rsvp/`: RSVP to an event by ID

6) **Playlist**
    - `POST /api/playlists/`: Creates a new playlist for a user
    - `GET /api/playlists/`: Gets all the playlists for a user
    - `PUT /api/playlists/:id/`: Updates a playlist by ID
    - `POST /api/playlists/tracks/`: Creates a new music track
    - `DELETE /api/playlists/tracks/:trackID/`: Deletes a music track by ID

### Models

1) **User**

    The `User` model represents a user in the system. It includes fields for username, email, password, and preferences. The preferences field refrence the `UserPreference` model.

2) **UserPreference**
    
    The `UserPreference` model contains additional information about the user such as music tastes and preferred instruments. It references the `User` model.

3) **UserLocation**

    The `UserLocation` model contains information about the location of the user including address, latitude, and longitude. It references the `User` model.

4) **UserFriends**

    The `UserFriends` model contains information about the friend request message including sender, recipient, message, and whether the request was accepted or not. It references the `User` model.

5) **Event**

    The `Event` model represents an event created by a user. It includes fields for the event's name, location, type of people required, date and time, additional information, the creator of the event, and RSVPs. It references the `User` model.

6) **Playlist**

    The `Playlist` model allows users to create and manage playlists. It includes fields for the playlist's name, description, tracks, and the creator. It references the `User` and the `Track` models.

7) **Track**

    The `Track` model represents the music tracks in a playlist. It includes the title, artist, album, and url of the music track.

## Challenges

1) Designing an intuitive user interface that can cater to both tech-savvy musicians and those less familiar with digital platforms.
    - The UI/UX of Rhythm Realm is simple and intuitive with the help of an hamburger menubar connecting all the different pages.

2) Ensuring a seamless user experience while offering a range of features such as customizable profiles, playlist management, and event creation.
    - Looking at different websites and seeing how they implemented their various features in order to gain inspiration from them.
    
3) Implementing real-time audio streaming with Agora.io and ensuring high-quality, low-latency audio streaming.
    - Researching on how to create a real-time audio streaming service by looking at various documentations and videos.

- Using AI  to allow users to create their own music sequences.
    - Resarching on AI Generation and exploring various options before settling with Magenta.js.

- Encouraging user interaction and fostering a sense of community among musicians, which involved not only technical solutions but also strategic community management and engaging activities.
    - Allowing users to manage events and send friend requests helps in connecting individuals across the world.

## Future Scope

- **Enhanced Social Features**: Introduce features such as direct messaging, group chats, and forums to foster deeper interactions and collaborations among users.
- **Global Collaboration Projects**: Launching features that facilitate large-scale collaborative projects, such as virtual bands and online orchestras.
- **Educational Resources**: Developing a comprehensive library of music tutorials, courses, and resources to support users in honing their skills and learning new techniques.
- **Localization**: Expanding the app's reach by localizing it into multiple languages and adapting features to cater to different cultural music preferences.

## References
1. Video Conference: https://www.youtube.com/watch?v=HX6AM_1-jNM
2. Magenta.js Documnetation: https://hello-magenta.glitch.me/
#Text/Video Chat System - Project README
##Project Overview
This project aims to create a text/video chat system with three levels of permissions: Super Admin, Group Admin, and User. The system allows real-time communication within different groups and channels, implemented using the MEAN stack (MongoDB, Express, Angular, Node), sockets.io, and Peer.js.

##Project Phases
Assignment 1: Initial Implementation (Phase 1)
Focused on creating the basic structure of the chat system, including user authentication, user roles, groups, channels, and basic chat functionality.
Local storage was used for data storage.

Assignment 2: Enhanced Implementation (Phase 2)
Introduced MongoDB integration for data storage, real-time chat using sockets.io, support for image sharing, and video chat.

##Git Repository
Organized with 'master' for stable releases and feature branches for development.
Regular commits to track progress and maintain a history of changes.
Structure: Backend and frontend directories with clear naming conventions.

## Data Structures
User objects with properties like username, email, password, roles, and groups.
Angular Architecture
Components for login, registration, and chat.
Chat Service for real-time communication.
Models to define user structures.
Routing for navigation.

## Node Server Architecture
Modules for user authentication, group management, and chat functionality.
Server-side functions for specific actions.
Limited use of global variables.

## Server-Side Routes (APIs)
/api/login for user registration.
/api/signup for user registration.
Sockets.io APIs
Used for real-time chat, video calls, and image sharing.

##Testing
Backend testing with unit and integration tests.
Frontend testing using Cypress for user registration.

##Conclusion
Assignment 2 enhanced the system with MongoDB, sockets, image support, video chat, and other advanced features, providing a more interactive chat experience.

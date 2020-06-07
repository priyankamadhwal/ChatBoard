# ChatBoard

A real-time chat application built with Socket.io and the MERN (MongoDB, Express, React, Node.js) stack that performs sentiment analysis on every incoming message.

### Objective

The primary goal of this project is to explore different full stack development technologies and boost my understanding of **client/server architecture**, **authentication**, **session-management**, **react-hooks**, **web sockets**, **api calls**, **express**, **mongodb** etc.

There's still a lot of room for discovering better design patterns and creating good development practices. So, I'll be improving the code and adding some new (maybe unnecessary :P) features as I learn more over time!

### Built with
    
**Stack MERN**    
    
**Backend**: NodeJs, Express   
**Frontend**: React(Hooks), React-Router, Material-UI, ChartJs   
**Database**: MongoDB (atlas), Mongoose    
**Authentication**: Json Web Tokens    
**Password-Hashing**: BcryptJs   
**Web Socket**: Socket.io   
    
**Sentiment Analyzer**   
Currently uses this sentiment module that uses AFINN-165 wordlist and Emoji Sentiment Ranking to perform sentiment analysis on the messages (Accuracy > 70%).   
    
## Getting started
    
### Prerequisites

- Nodejs   
- Mongo

### Installation

1. Clone the repo: `git clone https://github.com/priyankamadhwal/ChatBoard.git`
2. Go to project folder: `cd ChatBoard`
3. Install dependencies: `npm i`

### Configuring environment variables

Rename the [.env.template]('\server.env.template') file inside the server folder to `.env` and fill all the values.

### Running locally

- `cd ChatBoard` to go to project folder.
- `npm start` to run both client and server.
- `cd server && npm start` to run only server.
- `cd client && npm start` to run only client.

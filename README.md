# ChatBoard

A real-time chat application built with Socket.io and the MERN (MongoDB, Express, React, NodeJs) stack that performs sentiment analysis on every incoming message to classify as positive, negative or neutral, the opinion or tone of what people are saying or feeling about different trending topics.

### Objective

The primary goal of this project is to explore different full stack development technologies and boost my understanding of **client/server architecture**, **authentication**, **session-management**, **react-hooks**, **web sockets**, **api calls**, **express**, **mongodb** etc.

There's still a lot of room for discovering better design patterns and creating good development practices. So, I'll be improving the code and adding some new (maybe unnecessary :P) features as I learn more over time!

### Built with
    
**Stack MERN**    
**Frontend**: [React](https://reactjs.org/) (Hooks), [React-Router](https://reacttraining.com/react-router/), [Material-UI](https://material-ui.com/), [ChartJs](https://www.npmjs.com/package/react-chartjs-2)   
**HTTP Client**: [Axios](https://github.com/axios/axios)   
**Backend**: [NodeJs](https://nodejs.org/en/), [Express](https://expressjs.com/)   
**Database**: [MongoDB](https://www.mongodb.com/cloud/atlas) (atlas), [Mongoose](https://mongoosejs.com/)    
**Authentication**: [Json Web Tokens](https://www.npmjs.com/package/jwt-then)    
**Password-Hashing**: [BcryptJs](https://www.npmjs.com/package/bcryptjs)   
**Web Socket**: [Socket.io](https://socket.io/)   
    
**Sentiment Analyzer**   
Currently uses [this](https://www.npmjs.com/package/sentiment) module that uses [AFINN-165](http://www2.imm.dtu.dk/pubdb/pubs/6010-full.html) wordlist and [Emoji Sentiment Ranking](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0144296) to perform sentiment analysis on the messages (Accuracy > 70%).    
(Will be adding my own sentiment analysis classifier later.)
    
## Getting started
    
### Prerequisites

- [NodeJs](https://nodejs.org/en/) 
- [MongoDB](https://www.mongodb.com/cloud/atlas) (atlas) account

### Installation

1. Clone the repo: `git clone https://github.com/priyankamadhwal/ChatBoard.git`
2. Go to project folder: `cd ChatBoard`
3. Install dependencies: `npm i`

### Configuring environment variables

Rename the [.env.template](/server/.env.template) file inside the server folder to `.env` and fill all the values.

### Running locally

Inside project folder ```cd ChatBoard```:
- `npm start` to run both client and server.
- `cd server && npm start` to run only server.
- `cd client && npm start` to run only client.

## Screenshots

<p align="center">
    <img src="https://i.postimg.cc/sfZSMdhW/1.jpg" alt="authentication" width="700"/>
    <img src="https://i.postimg.cc/dQ83MqC5/2.jpg" alt="dashboard" width="700"/>
    <img src="https://i.postimg.cc/GhmCMrx8/3.jpg" alt="channel" width="700"/>
</p>

## Features
   
- Register/Login
- Creating channels on the basis of different topics of interest
- Joining different channels
- A separate list of currently online users for each channel
- Real time chatting
- Sentiment analysis of every incoming message in real time
- Assigns the background color to message box on the basis of sentiment score
- Displays sentiment distribution for every channel
- Displays overall sentiment level of the user 
- Real time updation of channels, online users and sentiment distribution


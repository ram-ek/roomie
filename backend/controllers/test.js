const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");
const axios = require('axios');

// Number of login requests to send
const numberOfRequests = 10000;

// Function to send a login request
async function sendLoginRequest(email, password) {
  try {
    const response = await axios.post('http://localhost:5000/login', {
      email: email,
      password: password
    });
    console.log(response);
  } catch (error) {
    //console.log(error.response);
  }
}

// Function to generate random email and password
function generateRandomString(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// Function to measure response time
async function measureResponseTime() {
  const startTime = Date.now();

  const loginPromises = [];
  for (let i = 0; i < numberOfRequests; i++) {
    const email = 'user' + i + '@example.com'; // Generate a random email
    const password = generateRandomString(8); // Generate a random password
    loginPromises.push(sendLoginRequest(email, password));
  }

  const responses = await Promise.all(loginPromises);
  const endTime = Date.now();

  const responseTimes = responses.map(response => endTime - startTime);
  const totalResponseTime = responseTimes.reduce((total, time) => total + time, 0);
  const averageResponseTime = totalResponseTime / numberOfRequests;

  console.log('Average response time:', averageResponseTime, 'ms');
  
  // Calculate throughput
  const throughput = numberOfRequests / ((endTime - startTime) / 1000); // Convert totalTime to seconds
  console.log('Throughput:', throughput, 'requests/second');
}

measureResponseTime();

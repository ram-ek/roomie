import React, { useEffect, useState } from "react";
import {
  Box, Text, IconButton, Spinner, useToast, Button, FormControl, Input
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import axios from "axios";
import io from "socket.io-client";
import Lottie from "react-lottie";
import { ChatState } from "../Context/ChatProvider";
import ProfileModal from "./miscellaneous/ProfileModal";
import ScrollableChat from "./ScrollableChat";
import animationData from "../animations/typing.json";
import { getSenderFull } from "../config/ChatLogics";

const ENDPOINT = "http://localhost:5000";
let socket;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat, setSelectedChat, user } = ChatState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const toast = useToast();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: { preserveAspectRatio: "xMidYMid slice" },
  };

  useEffect(() => {
    console.log("Initializing socket connection...");
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => {
      console.log("Socket connected");
      setSocketConnected(true);
    });
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    return () => {
      console.log("Disconnecting socket...");
      socket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    console.log("Fetching messages for chat:", selectedChat);
    fetchMessages();
  }, [selectedChat]);

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      console.log("Loading messages...");
      setLoading(true);

      const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);
      console.log("Messages loaded:", data);
      console.log(data);
      setMessages(data);

      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      console.error("Failed to load messages:", error);
      toast({
        title: "Error Occurred!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const handleSendMessage = async (message, isFile = false) => {
    if (!message && !isFile) return; // Avoid sending empty messages or handling files without content
    console.log("fgadfgsdtg");
    console.log(isFile);
    const isImage = !!isFile;

    console.log("Sending message:", message);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const messageData = {
        content: message,
        chatId: selectedChat._id,
        isImage: isFile, // This now indicates whether the message is a file
      };

      const { data } = await axios.post("/api/message", messageData, config);
      console.log("Message sent successfully:", data);

      socket.emit("new message", data);
      setMessages([...messages, data]);
      if (!isFile) {
        setNewMessage(""); // Clear input only for text messages
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      toast({
        title: "Error Occurred!",
        description: `Failed to send the ${isFile ? 'file' : 'message'}`,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const handleFileUpload = async (event) => {

    const file = event.target.files[0];
    if (!file) return;

    console.log("Uploading file:", file.name);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post("http://localhost:5000/api/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user.token}`,
        },
      });

      console.log("File uploaded successfully:", response.data);
      const { filename } = response.data;

      // Send a message with the file URL or filename
      const messageContent = filename;
      handleSendMessage(messageContent, true);  // Pass true to indicate this is a file
    } catch (error) {
      console.error("Failed to upload file:", error);
      toast({
        title: "Error Occurred!",
        description: "Failed to upload the file",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text fontSize={{ base: "28px", md: "30px" }} pb={3} px={2} w="100%" fontFamily="Work sans" d="flex" justifyContent={{ base: "space-between" }}>
            <IconButton icon={<ArrowBackIcon />} onClick={() => setSelectedChat(null)} />
            <ProfileModal user={selectedChat.isGroupChat ? { name: selectedChat.chatName.toUpperCase() } : getSenderFull(user, selectedChat.users)} />
          </Text>
          <Box d="flex" flexDir="column" justifyContent="flex-end" p={3} bg="#E8E8E8" w="100%" h="100%" borderRadius="lg" overflowY="hidden">
            {loading ? (
              <Spinner size="xl" w={20} h={20} alignSelf="center" margin="auto" />
            ) : (
              <ScrollableChat messages={messages} />
            )}
            <FormControl id="message-input" isRequired mt={3}>
              <Input variant="filled" bg="#E0E0E0" placeholder="Enter a message.." value={newMessage} onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendMessage(newMessage);
                }}
              />
              <Lottie options={defaultOptions} width={70} style={{ marginBottom: 15, marginLeft: 0, display: isTyping ? "block" : "none" }} />
              <input type="file" onChange={handleFileUpload} />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box d="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;

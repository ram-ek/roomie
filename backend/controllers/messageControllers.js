const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

//@description     Get all Messages
//@route           GET /api/Message/:chatId
//@access          Protected
const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Create New Message
//@route           POST /api/Message/
//@access          Protected
const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId, isImage } = req.body;  // Correctly capture 'isFile' from req.body

  // Log the incoming 'isFile' status
  console.log("Received 'isFile' status:",content, isImage);

  if (!content || !chatId) {
    console.log("Invalid data passed into request: Missing content or chat ID");
    return res.status(400).json({ message: "Content and chatId are required." });
  }

  const newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
    isFile: isImage || false,  // Ensure isFile is boolean and defaults to false if not provided
  };

  try {
    let message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic").execPopulate();
    message = await message.populate("chat").execPopulate();
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    console.error("Error creating message:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = { allMessages, sendMessage };

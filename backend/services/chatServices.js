import { messages } from "../models/message.js";

// send message
export const sendMessageService = async ({ sender, receiver, message }) => {
  const newMessage = await messages.create({
    sender,
    receiver,
    message,
  });

  return newMessage;
};

// get conversation
export const getMessagesService = async ({ userId, currentUserId }) => {
  const chatMessages = await messages.find({
    $or: [
      { sender: currentUserId, receiver: userId },
      { sender: userId, receiver: currentUserId },
    ],
  }).sort({ createdAt: 1 });

  return chatMessages;
};

// mark as read
export const markAsReadService = async ({ currentUserId, userId }) => {
  await messages.updateMany(
    { receiver: currentUserId, sender: userId },
    { read: true }
  );

  return true;
};

// get conversations list (contacts)
export const getConversationsService = async (userId) => {
  const userMessages = await messages.find({
    $or: [{ sender: userId }, { receiver: userId }],
  }).populate("sender receiver", "name email profileImage");

  const contacts = new Map();

  userMessages.forEach((msg) => {
    const otherUser = msg.sender._id.toString() === userId.toString() ? msg.receiver : msg.sender;
    if (!contacts.has(otherUser._id.toString())) {
      contacts.set(otherUser._id.toString(), {
        _id: otherUser._id,
        name: otherUser.name,
        email: otherUser.email,
        profileImage: otherUser.profileImage,
        lastMessage: msg.message,
        lastMessageTime: msg.createdAt,
      });
    } else {
      // Update last message if newer
      const existing = contacts.get(otherUser._id.toString());
      if (new Date(msg.createdAt) > new Date(existing.lastMessageTime)) {
        existing.lastMessage = msg.message;
        existing.lastMessageTime = msg.createdAt;
      }
    }
  });

  return Array.from(contacts.values());
};
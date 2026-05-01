import chatModel from '../models/chat.model.js';
import messageModel from '../models/message.model.js';
import userModel from '../models/user.model.js';
import { encrypt, decrypt } from '../utils/crypto.js';

export const getChats = async (req, res) => {
  try {
    const chats = await chatModel.find({
      participants: req.user._id,
      orgId: req.user.orgId
    })
    .populate('participants', 'name email avatar role')
    .populate({
      path: 'lastMessage',
      populate: { path: 'sender', select: 'name' }
    })
    .sort({ updatedAt: -1 });

    const decryptedChats = chats.map(chat => {
      const chatObj = chat.toObject();
      if (chatObj.lastMessage) {
        chatObj.lastMessage.content = decrypt(chatObj.lastMessage.content);
      }
      return chatObj;
    });

    res.status(200).json(decryptedChats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { before, limit = 20 } = req.query;
    
    const query = { chatId };
    if (before) {
      query.createdAt = { $lt: new Date(before) };
    }

    const messages = await messageModel.find(query)
      .populate('sender', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    const decryptedMessages = messages.map(msg => {
      const msgObj = msg.toObject();
      msgObj.content = decrypt(msgObj.content);
      return msgObj;
    });

    res.status(200).json(decryptedMessages.reverse());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createChat = async (req, res) => {
  try {
    const { participants, type, name } = req.body;
    
    // For direct chat, check if it already exists
    if (type === 'direct' && participants.length === 2) {
      const existingChat = await chatModel.findOne({
        type: 'direct',
        participants: { $all: participants },
        orgId: req.user.orgId
      });
      if (existingChat) {
        return res.status(200).json(existingChat);
      }
    }

    const newChat = await chatModel.create({
      participants,
      type,
      name,
      orgId: req.user.orgId
    });

    const populatedChat = await chatModel.findById(newChat._id).populate('participants', 'name email avatar role');
    res.status(201).json(populatedChat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrgUsers = async (req, res) => {
  try {
    const users = await userModel.find({ 
      orgId: req.user.orgId,
      _id: { $ne: req.user._id }
    }).select('name email avatar role');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

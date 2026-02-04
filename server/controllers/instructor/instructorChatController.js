import asyncHandler from "express-async-handler";
import * as chatService from "../../services/instructor/instructorChatService.js";
import { HTTP_STATUS } from "../../utils/httpStatus.js";

// get conversations
export const getConversations = asyncHandler(async (req, res) => {
  const conversations = await chatService.getConversations(req.user._id);
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: conversations,
  });
});

// get messages
export const getMessages = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const { page = 1 } = req.query;

  const messages = await chatService.getConversationMessages(
    conversationId,
    parseInt(page)
  );

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: messages,
  });
});

// get course rooms
export const getCourseRooms = asyncHandler(async (req, res) => {
  const rooms = await chatService.getCourseRooms(req.user._id);
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: rooms,
  });
});

// get room messages
export const getRoomMessages = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  const { page = 1 } = req.query;

  const messages = await chatService.getRoomMessages(roomId, parseInt(page));

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: messages,
  });
});

// get room participants
export const getRoomParticipants = asyncHandler(async (req, res) => {
  const { roomId } = req.params;

  const participants = await chatService.getRoomParticipants(roomId);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: participants,
  });
});

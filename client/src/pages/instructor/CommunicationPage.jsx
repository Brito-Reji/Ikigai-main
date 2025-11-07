import React, { useState } from "react";
import { Search, Send, Paperclip, MoreVertical, Star, Archive, Trash2 } from "lucide-react";

export default function CommunicationPage() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [conversations] = useState([
    {
      id: 1,
      student: {
        name: "John Doe",
        avatar: "https://i.pravatar.cc/150?img=1",
      },
      lastMessage: "Thank you for the explanation!",
      timestamp: "2 min ago",
      unread: 2,
      course: "Web Development Bootcamp",
    },
    {
      id: 2,
      student: {
        name: "Jane Smith",
        avatar: "https://i.pravatar.cc/150?img=2",
      },
      lastMessage: "Can you help me with the React assignment?",
      timestamp: "1 hour ago",
      unread: 0,
      course: "React Masterclass",
    },
    {
      id: 3,
      student: {
        name: "Mike Johnson",
        avatar: "https://i.pravatar.cc/150?img=3",
      },
      lastMessage: "The video quality is great!",
      timestamp: "Yesterday",
      unread: 0,
      course: "UI/UX Design",
    },
  ]);

  const [messages] = useState([
    {
      id: 1,
      sender: "student",
      text: "Hi! I'm having trouble understanding the Redux concepts.",
      timestamp: "10:30 AM",
    },
    {
      id: 2,
      sender: "instructor",
      text: "Hello! I'd be happy to help. Which specific part are you struggling with?",
      timestamp: "10:32 AM",
    },
    {
      id: 3,
      sender: "student",
      text: "The actions and reducers part. How do they work together?",
      timestamp: "10:35 AM",
    },
    {
      id: 4,
      sender: "instructor",
      text: "Great question! Actions are like events that describe what happened, and reducers specify how the state changes in response to those actions.",
      timestamp: "10:37 AM",
    },
    {
      id: 5,
      sender: "student",
      text: "Thank you for the explanation!",
      timestamp: "10:40 AM",
    },
  ]);

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 bg-gray-50">
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Communication</h1>
          <p className="text-gray-600 mt-1">Connect with your students</p>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden" style={{ height: "calc(100vh - 250px)" }}>
          <div className="flex h-full">
            {/* Conversations List */}
            <div className="w-full md:w-1/3 border-r border-gray-200 flex flex-col">
              {/* Search */}
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Conversations */}
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedChat(conv)}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition ${
                      selectedChat?.id === conv.id ? "bg-indigo-50" : ""
                    }`}
                  >
                    <div className="flex items-start">
                      <div className="relative">
                        <img
                          src={conv.student.avatar}
                          alt={conv.student.name}
                          className="w-12 h-12 rounded-full"
                        />
                        {conv.unread > 0 && (
                          <span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-600 text-white text-xs rounded-full flex items-center justify-center">
                            {conv.unread}
                          </span>
                        )}
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-gray-900">
                            {conv.student.name}
                          </h3>
                          <span className="text-xs text-gray-500">{conv.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-500 mb-1">{conv.course}</p>
                        <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {selectedChat ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center">
                      <img
                        src={selectedChat.student.avatar}
                        alt={selectedChat.student.name}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {selectedChat.student.name}
                        </h3>
                        <p className="text-sm text-gray-500">{selectedChat.course}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                        <Star className="w-5 h-5 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                        <Archive className="w-5 h-5 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                        <MoreVertical className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${
                          msg.sender === "instructor" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            msg.sender === "instructor"
                              ? "bg-indigo-600 text-white"
                              : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <p className="text-sm">{msg.text}</p>
                          <p
                            className={`text-xs mt-1 ${
                              msg.sender === "instructor"
                                ? "text-indigo-200"
                                : "text-gray-500"
                            }`}
                          >
                            {msg.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                        <Paperclip className="w-5 h-5 text-gray-600" />
                      </button>
                      <input
                        type="text"
                        placeholder="Type your message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <button
                        onClick={handleSendMessage}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium flex items-center"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-lg font-medium">Select a conversation</p>
                    <p className="text-sm">Choose a student to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

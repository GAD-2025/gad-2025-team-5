import { allBooks } from './bookData';
import { chatData as initialChatData } from './chatData';

const CHAT_DATA_KEY = 'chatData';
const ALL_MESSAGES_KEY = 'allMessages';
const CHAT_ACTIVITY_KEY = 'chatActivity';

// Initialize localStorage if it's empty
export const initializeChats = () => {
    if (!localStorage.getItem(CHAT_DATA_KEY)) {
        localStorage.setItem(CHAT_DATA_KEY, JSON.stringify(initialChatData));
    }
    if (!localStorage.getItem(ALL_MESSAGES_KEY)) {
        localStorage.setItem(ALL_MESSAGES_KEY, JSON.stringify({}));
    }
    if (!localStorage.getItem(CHAT_ACTIVITY_KEY)) {
        localStorage.setItem(CHAT_ACTIVITY_KEY, JSON.stringify({}));
    }
};

// Get all chat sessions
export const getChats = () => {
    const chats = JSON.parse(localStorage.getItem(CHAT_DATA_KEY)) || {};
    return chats;
};

// Get or create a chat for a specific book
export const getOrCreateChat = (bookId) => {
    const chats = getChats();
    const book = allBooks[bookId];

    if (!book) {
        console.error("Book not found for ID:", bookId);
        return null;
    }

    // Check if a chat for this book already exists
    let existingChatId = Object.keys(chats).find(chatId => chats[chatId].bookId === bookId);
    if (existingChatId) {
        return existingChatId;
    }

    // If not, create a new chat
    const newChatId = Date.now().toString();
    const newChat = {
        bookId: book.id,
        sellerName: book.seller,
        location: '랜덤 지역', // Placeholder, can be randomized
        tone: ['friendly', 'formal', 'direct'][Math.floor(Math.random() * 3)], // Randomize tone
    };

    chats[newChatId] = newChat;
    localStorage.setItem(CHAT_DATA_KEY, JSON.stringify(chats));

    // Initialize activity for the new chat
    const chatActivity = JSON.parse(localStorage.getItem(CHAT_ACTIVITY_KEY)) || {};
    chatActivity[newChatId] = {
        lastMessage: `'${book.title}'에 대한 대화를 시작해보세요.`,
        timestamp: Date.now(),
        unread: 0,
    };
    localStorage.setItem(CHAT_ACTIVITY_KEY, JSON.stringify(chatActivity));


    return newChatId;
};

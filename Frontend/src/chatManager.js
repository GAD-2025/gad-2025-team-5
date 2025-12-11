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
    
    const sampleMessages = {
        '1': [
            { type: 'system', text: '\'모순\'에 대한 문의가 시작되었습니다.' },
            { sender: 'user', text: '안녕하세요, 책 아직 판매하시나요?', timestamp: Date.now() - 1000 * 60 * 10 },
            { sender: 'seller', text: '네, 판매중입니다.', timestamp: Date.now() - 1000 * 60 * 9 },
            { sender: 'user', text: '책 상태는 어떤가요?', timestamp: Date.now() - 1000 * 60 * 8 },
            { sender: 'seller', text: '거의 새 책과 같아요. 밑줄이나 접힌 자국도 없습니다.', timestamp: Date.now() - 1000 * 60 * 7 },
            { type: 'system', text: '구매자가 결제를 완료했습니다.' },
            { sender: 'user', text: '결제 완료했습니다. 배송은 언제쯤 될까요?', timestamp: Date.now() - 1000 * 60 * 6 },
            { sender: 'seller', text: '오늘 바로 편의점 택배로 보내드릴게요!', timestamp: Date.now() - 1000 * 60 * 5 },
            { type: 'system', text: '판매자가 배송을 시작했습니다.' },
            { sender: 'seller', text: '배송 시작했습니다. 운송장 번호는 1234567890입니다.', timestamp: Date.now() - 1000 * 60 * 4 },
            { type: 'system', text: '구매자가 구매를 확정했습니다.' },
        ],
        '2': [
            { type: 'system', text: '\'불편한 편의점\'에 대한 문의가 시작되었습니다.' },
            { sender: 'user', text: '안녕하세요, 직거래 가능할까요?', timestamp: Date.now() - 1000 * 60 * 20 },
            { sender: 'seller', text: '네, 가능합니다. 홍대입구역에서 가능합니다.', timestamp: Date.now() - 1000 * 60 * 19 },
        ],
        '3': [
            { type: 'system', text: '\'장미와 나이프\'에 대한 문의가 시작되었습니다.' },
            { sender: 'user', text: '택배거래 가능한가요?', timestamp: Date.now() - 1000 * 60 * 30 },
        ],
    };
    localStorage.setItem(ALL_MESSAGES_KEY, JSON.stringify(sampleMessages));

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

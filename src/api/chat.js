import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 300000,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.message);
        return
    }
);

/**
 * 发送聊天消息
 * @param {string} message - 用户消息
 * @param {string} sessionId - 会话ID
 */
export const sendChatMessage = async (message, sessionId) => {
    try {
        const response = await apiClient.post('/chat', {
            message,
            session_id: sessionId,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * 清空对话记忆
 * @param {string} sessionId - 会话ID
 */
export const clearChatMemory = async (sessionId) => {
    try {
        const response = await apiClient.post('/memory/clear', {
            session_id: sessionId,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export default apiClient;

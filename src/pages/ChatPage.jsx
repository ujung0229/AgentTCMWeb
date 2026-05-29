import { useState, useRef, useEffect } from 'react';
import { Input, Button, Card, Avatar, Spin, Empty } from 'antd';
import { SendOutlined, RobotOutlined, UserOutlined, DeleteOutlined } from '@ant-design/icons';
import { sendChatMessage, clearChatMemory } from '../api';
import './ChatPage.css';

const { TextArea } = Input;

const ChatMessage = ({ role, content }) => {
    const isUser = role === 'user';

    return (
        <div className={`chat-message ${isUser ? 'user-message' : 'assistant-message'}`}>
            <Avatar
                icon={isUser ? <UserOutlined /> : <RobotOutlined />}
                className={isUser ? 'user-avatar' : 'assistant-avatar'}
            />
            <Card className={`message-card ${isUser ? 'user-card' : 'assistant-card'}`}>
                <div className="message-content">{content}</div>
            </Card>
        </div>
    );
};

const ChatPage = () => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [sessionId] = useState(() => `session_${Date.now()}`);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputValue.trim() || loading) return;

        const userMessage = inputValue.trim();
        setInputValue('');
        setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
        setLoading(true);

        try {
            const response = await sendChatMessage(userMessage, sessionId);
            setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: response.answer || '收到回复' },
            ]);
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: '抱歉，发生了错误，请稍后再试。' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleClearChat = async () => {
        try {
            await clearChatMemory(sessionId);
        } catch (error) {
            console.error('Clear memory failed:', error);
        }
        setMessages([]);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-header">
                <h2>中医药知识助手</h2>
                <Button
                    type="text"
                    icon={<DeleteOutlined />}
                    onClick={handleClearChat}
                    disabled={messages.length === 0}
                >
                    清空对话
                </Button>
            </div>

            <div className="chat-messages">
                {messages.length === 0 ? (
                    <Empty description="开始询问中医药相关知识吧" />
                ) : (
                    messages.map((msg, index) => (
                        <ChatMessage key={index} role={msg.role} content={msg.content} />
                    ))
                )}
                {loading && (
                    <div className="chat-message assistant-message">
                        <Avatar icon={<RobotOutlined />} className="assistant-avatar" />
                        <Card className="message-card assistant-card">
                            <Spin size="small" />
                        </Card>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-area">
                <TextArea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="请输入您的问题..."
                    autoSize={{ minRows: 1, maxRows: 4 }}
                    disabled={loading}
                />
                <Button
                    type="primary"
                    icon={<SendOutlined />}
                    onClick={handleSendMessage}
                    loading={loading}
                    disabled={!inputValue.trim()}
                >
                    发送
                </Button>
            </div>
        </div>
    );
};

export default ChatPage;

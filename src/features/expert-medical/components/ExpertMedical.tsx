import React from 'react';
import { useAuthStore } from '@core/auth/auth.store';

interface ChatMessage {
  type: 'bot' | 'user';
  content: string;
}

const ExpertMedical: React.FC = () => {
    const user = useAuthStore((state) => state.user);
    const [chatMode, setChatMode] = React.useState<string>(user?.role === 'medecin' ? 'medecin' : 'patient');
    const [messages, setMessages] = React.useState<ChatMessage[]>([
        {
            type: 'bot',
            content: `Bonjour ! Je suis l'assistant médical LAMESSE DAMA en mode ${chatMode}. Comment puis-je vous aider ?`
        }
    ]);
    const [inputMessage, setInputMessage] = React.useState<string>('');

    const handleSendMessage = () => {
        if (!inputMessage.trim()) return;

        const newMessages: ChatMessage[] = [
            ...messages,
            { type: 'user', content: inputMessage },
            {
                type: 'bot',
                content: chatMode === 'patient'
                    ? 'Je comprends votre préoccupation. Pour obtenir un diagnostic précis, je vous recommande de consulter votre médecin traitant.'
                    : 'Sur la base des symptômes décrits, je suggère d\'effectuer des examens complémentaires pour confirmer le diagnostic.'
            }
        ];

        setMessages(newMessages);
        setInputMessage('');
    };

    return (
        <div className="page-content">
            <div className="content-header-app">
                <div className="header-image" style={{
                    background: 'linear-gradient(rgba(74, 157, 124, 0.8), rgba(74, 157, 124, 0.9)), url(https://images.unsplash.com/photo-1551601651-2a8555f1a136?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80)',
                    backgroundSize: 'cover'
                }}>
                    <div className="header-overlay">
                        <h1>Expert Médical - Chatbot</h1>
                        <p>Obtenez des conseils médicaux adaptés à votre profil</p>
                    </div>
                </div>
            </div>
            <div className="content-body">
                <div className="content-card-app" style={{maxWidth: '800px', margin: '0 auto'}}>
                    <div className="card-header">
                        <div className="card-icon bg-green-50 text-green-600">
                            <i className="fas fa-robot"></i>
                        </div>
                        <h3>Chatbot médical intelligent</h3>
                    </div>
                    <div className="card-content">


                        <div className="chat-container">
                            <div className="chat-messages">
                                {messages.map((msg, idx) => (
                                    <div key={idx} className={`message ${msg.type}`}>
                                        <div className="message-avatar">
                                            <i className={msg.type === 'bot' ? 'fas fa-robot' : 'fas fa-user'}></i>
                                        </div>
                                        <div className="message-content">
                                            <p>{msg.content}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="chat-input-container">
                                <input
                                    type="text"
                                    className="chat-input"
                                    placeholder="Posez votre question..."
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                />
                                <button className="btn btn-primary chat-send-btn" onClick={handleSendMessage}>
                                    <i className="fas fa-paper-plane"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExpertMedical;

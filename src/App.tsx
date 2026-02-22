import { useState, useRef, useEffect } from 'react';
import './styles.css';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'contact';
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
}

interface Contact {
  id: number;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'typing';
  lastSeen?: string;
  unread: number;
  lastMessage?: string;
}

const contacts: Contact[] = [
  { id: 1, name: 'AGENT_NIGHTFALL', avatar: 'N', status: 'online', unread: 3, lastMessage: 'The documents are secure...' },
  { id: 2, name: 'KOMMISSAR_X', avatar: 'K', status: 'typing', unread: 0, lastMessage: 'Awaiting further instructions' },
  { id: 3, name: 'OPERATOR_7', avatar: '7', status: 'offline', lastSeen: '14:32', unread: 0, lastMessage: 'Message received. Over.' },
  { id: 4, name: 'CENTRAL_HQ', avatar: 'C', status: 'online', unread: 12, lastMessage: 'PRIORITY: Code Red Alpha' },
  { id: 5, name: 'FIELD_UNIT_9', avatar: '9', status: 'offline', lastSeen: '09:15', unread: 0, lastMessage: 'Position confirmed' },
];

const initialMessages: Message[] = [
  { id: 1, text: 'INCOMING TRANSMISSION...', sender: 'contact', timestamp: new Date(Date.now() - 300000), status: 'read' },
  { id: 2, text: 'Agent, your mission parameters have been updated.', sender: 'contact', timestamp: new Date(Date.now() - 240000), status: 'read' },
  { id: 3, text: 'Acknowledged. Proceeding to extraction point.', sender: 'user', timestamp: new Date(Date.now() - 180000), status: 'read' },
  { id: 4, text: 'Be advised: hostile activity detected in sector 7.', sender: 'contact', timestamp: new Date(Date.now() - 120000), status: 'read' },
  { id: 5, text: 'Copy that. Adjusting route accordingly.', sender: 'user', timestamp: new Date(Date.now() - 60000), status: 'delivered' },
];

function App() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputText, setInputText] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact>(contacts[0]);
  const [showSidebar, setShowSidebar] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
      status: 'sent',
    };

    setMessages([...messages, newMessage]);
    setInputText('');

    // Simulate response
    setTimeout(() => {
      const responses = [
        'TRANSMISSION RECEIVED. STANDBY.',
        'Coordinates locked. Proceed with caution.',
        'Intelligence confirmed. Maintain radio silence.',
        'AFFIRMATIVE. Execute protocol DELTA.',
      ];
      const response: Message = {
        id: messages.length + 2,
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: 'contact',
        timestamp: new Date(),
        status: 'delivered',
      };
      setMessages(prev => [...prev, response]);
    }, 1500);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  return (
    <div className="app-container">
      <div className="scanlines" />
      <div className="noise" />

      {/* Mobile sidebar overlay */}
      {showSidebar && (
        <div
          className="sidebar-overlay md:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${showSidebar ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo-stamp">
              <span className="logo-text">TG</span>
              <span className="logo-subtext">SECURE COMMS</span>
            </div>
          </div>
          <button
            className="md:hidden close-btn"
            onClick={() => setShowSidebar(false)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="search-container">
          <input
            type="text"
            placeholder="SEARCH CONTACTS..."
            className="search-input"
          />
          <div className="search-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </div>
        </div>

        <div className="contacts-list">
          {contacts.map((contact, index) => (
            <button
              key={contact.id}
              className={`contact-item ${selectedContact.id === contact.id ? 'contact-active' : ''}`}
              onClick={() => {
                setSelectedContact(contact);
                setShowSidebar(false);
              }}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="contact-avatar">
                <span>{contact.avatar}</span>
                <div className={`status-indicator status-${contact.status}`} />
              </div>
              <div className="contact-info">
                <div className="contact-name">{contact.name}</div>
                <div className="contact-preview">
                  {contact.status === 'typing' ? (
                    <span className="typing-indicator">TRANSMITTING<span className="typing-dots">...</span></span>
                  ) : (
                    contact.lastMessage
                  )}
                </div>
              </div>
              {contact.unread > 0 && (
                <div className="unread-badge">{contact.unread}</div>
              )}
            </button>
          ))}
        </div>

        <div className="sidebar-footer">
          <div className="classification-stamp">
            CLASSIFIED // LEVEL 5 CLEARANCE
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="chat-area">
        {/* Chat Header */}
        <header className="chat-header">
          <button
            className="menu-btn md:hidden"
            onClick={() => setShowSidebar(true)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>

          <div className="header-contact">
            <div className="header-avatar">
              <span>{selectedContact.avatar}</span>
            </div>
            <div className="header-info">
              <h2 className="header-name">{selectedContact.name}</h2>
              <span className={`header-status status-text-${selectedContact.status}`}>
                {selectedContact.status === 'online' && '// ACTIVE CONNECTION'}
                {selectedContact.status === 'typing' && '// INCOMING TRANSMISSION...'}
                {selectedContact.status === 'offline' && `// LAST SIGNAL: ${selectedContact.lastSeen}`}
              </span>
            </div>
          </div>

          <div className="header-actions">
            <button className="action-btn" aria-label="Search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </button>
            <button className="action-btn" aria-label="More options">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="1" />
                <circle cx="12" cy="5" r="1" />
                <circle cx="12" cy="19" r="1" />
              </svg>
            </button>
          </div>
        </header>

        {/* Messages */}
        <div className="messages-container">
          <div className="messages-wrapper">
            <div className="date-divider">
              <span>TODAY // {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase()}</span>
            </div>

            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`message message-${message.sender}`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="message-content">
                  <p className="message-text">{message.text}</p>
                  <div className="message-meta">
                    <span className="message-time">{formatTime(message.timestamp)}</span>
                    {message.sender === 'user' && (
                      <span className="message-status">
                        {message.status === 'sent' && '//SENT'}
                        {message.status === 'delivered' && '//DELIVERED'}
                        {message.status === 'read' && '//CONFIRMED'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="input-area">
          <div className="input-container">
            <button className="attach-btn" aria-label="Attach file">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
              </svg>
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="ENTER TRANSMISSION..."
              className="message-input"
            />

            <button
              className="send-btn"
              onClick={sendMessage}
              disabled={!inputText.trim()}
              aria-label="Send message"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </button>
          </div>

          <div className="encryption-notice">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
            </svg>
            <span>END-TO-END ENCRYPTED // PROTOCOL X-7</span>
          </div>
        </div>

        {/* Footer */}
        <footer className="app-footer">
          <span>Requested by @Omnislayer · Built by @clonkbot</span>
        </footer>
      </main>
    </div>
  );
}

export default App;

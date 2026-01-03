'use client'

import { useState, useRef, useEffect } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const initialMessage: Message = {
  role: 'assistant',
  content: "I can help you understand where AI fits into your business.\n\nWould you like to discuss upskilling your team, or building a custom tool to automate a specific task?",
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([initialMessage])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId] = useState(() =>
    typeof window !== 'undefined'
      ? sessionStorage.getItem('chatConversationId') || crypto.randomUUID()
      : crypto.randomUUID()
  )
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('chatConversationId', conversationId)
    }
  }, [conversationId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          conversationId,
          history: messages,
        }),
      })

      if (!response.ok) throw new Error('Failed to send message')

      const data = await response.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }])
    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: "I'm sorry, I had trouble processing that. Could you try again, or book a discovery call to chat with someone from the team?"
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Chat toggle button */}
      <button
        className="chat-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="24" height="24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="24" height="24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
          </svg>
        )}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-header-info">
              <span className="chat-header-title">Enablr</span>
              <span className="chat-header-status">Practical AI guidance</span>
            </div>
          </div>

          <div className="chat-messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`chat-message ${message.role}`}
              >
                <div className="message-content">
                  {message.content.split('\n').map((line, i) => (
                    <p key={i} style={{ margin: line ? '0 0 8px 0' : '0' }}>{line}</p>
                  ))}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="chat-message assistant">
                <div className="message-content typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="chat-input-form">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="chat-input"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="chat-send"
              disabled={isLoading || !input.trim()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="20" height="20">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          </form>

          <div className="chat-disclaimer">
            General guidance only. For specific advice, book a call.
          </div>
        </div>
      )}

      <style jsx>{`
        .chat-toggle {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: var(--color-accent);
          color: white;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-lg);
          transition: all var(--transition-base);
          z-index: 1000;
        }

        .chat-toggle:hover {
          background: var(--color-accent-dark);
          transform: scale(1.05);
        }

        .chat-window {
          position: fixed;
          bottom: 96px;
          right: 24px;
          width: 380px;
          max-height: 520px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          display: flex;
          flex-direction: column;
          z-index: 1000;
          overflow: hidden;
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .chat-header {
          padding: 16px 20px;
          background: var(--color-primary);
          color: white;
        }

        .chat-header-info {
          display: flex;
          flex-direction: column;
        }

        .chat-header-title {
          font-weight: 600;
          font-size: 1rem;
        }

        .chat-header-status {
          font-size: 0.8125rem;
          opacity: 0.8;
        }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          min-height: 280px;
          max-height: 320px;
        }

        .chat-message {
          margin-bottom: 12px;
          display: flex;
        }

        .chat-message.user {
          justify-content: flex-end;
        }

        .chat-message.assistant {
          justify-content: flex-start;
        }

        .message-content {
          max-width: 85%;
          padding: 10px 14px;
          border-radius: 16px;
          font-size: 0.9375rem;
          line-height: 1.5;
        }

        .chat-message.user .message-content {
          background: var(--color-accent);
          color: white;
          border-bottom-right-radius: 4px;
        }

        .chat-message.assistant .message-content {
          background: #F3F4F6;
          color: var(--color-text);
          border-bottom-left-radius: 4px;
        }

        .typing {
          display: flex;
          gap: 4px;
          padding: 12px 16px;
        }

        .typing span {
          width: 8px;
          height: 8px;
          background: var(--color-text-muted);
          border-radius: 50%;
          animation: bounce 1.4s infinite ease-in-out;
        }

        .typing span:nth-child(1) { animation-delay: -0.32s; }
        .typing span:nth-child(2) { animation-delay: -0.16s; }

        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }

        .chat-input-form {
          display: flex;
          padding: 12px 16px;
          border-top: 1px solid var(--color-border);
          gap: 8px;
        }

        .chat-input {
          flex: 1;
          padding: 10px 14px;
          border: 1px solid var(--color-border);
          border-radius: 24px;
          font-size: 0.9375rem;
          outline: none;
          transition: border-color var(--transition-fast);
        }

        .chat-input:focus {
          border-color: var(--color-accent);
        }

        .chat-send {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--color-accent);
          color: white;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);
        }

        .chat-send:hover:not(:disabled) {
          background: var(--color-accent-dark);
        }

        .chat-send:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .chat-disclaimer {
          padding: 8px 16px 12px;
          font-size: 0.75rem;
          color: var(--color-text-light);
          text-align: center;
        }

        @media (max-width: 480px) {
          .chat-window {
            width: calc(100% - 32px);
            right: 16px;
            bottom: 88px;
            max-height: 60vh;
          }

          .chat-toggle {
            right: 16px;
            bottom: 16px;
          }
        }
      `}</style>
    </>
  )
}

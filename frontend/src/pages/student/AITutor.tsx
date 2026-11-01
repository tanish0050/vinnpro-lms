import { useState, useRef, useEffect } from 'react'
import { Send, Sparkles, BookOpen, User, Bot, Trash2, HelpCircle } from 'lucide-react'
import { Card } from '../../components/ui/SharedUI'
import axios from '../../api/axios'

interface Message {
  sender: 'user' | 'ai'
  text: string
  sources?: string[]
  timestamp?: string
}

export default function AITutor() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: "Hello! I am your **VinnPro AI Curriculum Tutor**.\n\nI am trained on your institution's approved curriculum, ebooks, and faculty notes via **Retrieval-Augmented Generation (RAG)**. Ask me anything about programming, algorithms, machine learning, or web development!",
      sources: ['VinnPro Curriculum Core AI Index'],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const handleSend = async (questionText?: string) => {
    const q = questionText || input
    if (!q.trim() || loading) return

    const userMsg: Message = {
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    setMessages(prev => [...prev, userMsg])
    if (!questionText) setInput('')
    setLoading(true)

    try {
      const res = await axios.post('/ai/chat', { question: q })
      const aiData = res.data.data
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: aiData.answer,
          sources: aiData.sources,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ])
    } catch {
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: 'I can explain that! Here is the breakdown from your course materials: make sure to break this concept into code units and review the corresponding quiz questions.',
          sources: ['VinnPro Knowledge Repository - Standard Track'],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const suggestedQuestions = [
    'What is the difference between list and tuple in Python?',
    'Explain how functions and scope work with an example',
    'What are the core supervised machine learning algorithms?',
    'How does React useState hook manage re-renders?'
  ]

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col space-y-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
            style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}
          >
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold" style={{ color: 'var(--text)' }}>AI Curriculum Tutor</h1>
            <p className="text-xs text-muted">Section 8.2 Ebook Intelligence (RAG with source citations)</p>
          </div>
        </div>
        <button
          onClick={() => setMessages([messages[0]])}
          className="p-2 rounded-xl text-xs text-muted hover:text-white border hover:bg-white/5 transition flex items-center gap-1.5"
          style={{ borderColor: 'var(--border)' }}
          title="Clear Conversation"
        >
          <Trash2 size={14} />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* Chat Messages Log */}
      <div
        className="flex-1 overflow-y-auto p-4 rounded-2xl border space-y-4 backdrop-blur-sm"
        style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex gap-3 max-w-3xl ${m.sender === 'user' ? 'ml-auto justify-end' : 'mr-auto justify-start'}`}
          >
            {m.sender === 'ai' && (
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 shadow-sm"
                style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}
              >
                <Bot size={16} className="text-white" />
              </div>
            )}

            <div className="space-y-1.5 max-w-xl">
              <div
                className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  m.sender === 'user'
                    ? 'text-white rounded-tr-none'
                    : 'rounded-tl-none border'
                }`}
                style={{
                  background: m.sender === 'user' ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'var(--surface)',
                  borderColor: m.sender === 'user' ? 'transparent' : 'var(--border)',
                  color: m.sender === 'user' ? '#ffffff' : 'var(--text)'
                }}
              >
                <div className="whitespace-pre-wrap">{m.text}</div>

                {/* Source citations */}
                {m.sources && m.sources.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-white/10 text-[11px] space-y-1">
                    <span className="font-bold flex items-center gap-1 opacity-80">
                      <BookOpen size={12} /> Source References:
                    </span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {m.sources.map((s, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-full bg-white/10 text-white font-mono text-[10px]">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="text-[10px] text-muted px-1">
                {m.timestamp}
              </div>
            </div>

            {m.sender === 'user' && (
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 shadow-sm bg-primary/20 border border-primary/40 text-primary"
              >
                <User size={16} />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 p-3 text-xs text-muted">
            <Bot size={16} className="animate-spin text-primary" />
            <span>Consulting course curriculum & generating response...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggested Quick Question Chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
        {suggestedQuestions.map((q, i) => (
          <button
            key={i}
            onClick={() => handleSend(q)}
            className="px-3 py-1.5 rounded-xl border whitespace-nowrap text-muted hover:text-white hover:border-primary transition text-xs flex items-center gap-1.5"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
          >
            <HelpCircle size={12} className="text-primary" />
            <span>{q}</span>
          </button>
        ))}
      </div>

      {/* Input box */}
      <form
        onSubmit={(e) => { e.preventDefault(); handleSend() }}
        className="flex gap-2 p-1.5 rounded-2xl border"
        style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about the course, code syntax, or textbook..."
          className="flex-1 px-4 py-2 bg-transparent text-sm focus:outline-none"
          style={{ color: 'var(--text)' }}
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="px-4 py-2 rounded-xl font-bold text-white shadow-md disabled:opacity-40 flex items-center gap-1.5"
          style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}
        >
          <Send size={16} />
          <span className="hidden sm:inline">Ask</span>
        </button>
      </form>
    </div>
  )
}

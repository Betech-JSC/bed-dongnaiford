"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  MessageCircle,
  X,
  Send,
  Loader2,
  Bot,
  User,
  Phone,
  GripVertical,
} from "lucide-react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface Position {
  x: number;
  y: number;
}

const INITIAL_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "Xin chào! 👋 Tôi là trợ lý AI của **Ford Đồng Nai**. Tôi có thể giúp bạn:\n\n• Tư vấn các dòng xe Ford\n• Tra cứu giá xe & ước tính lăn bánh\n• Đặt lịch lái thử\n• Thông tin dịch vụ bảo dưỡng\n\nBạn cần hỗ trợ gì ạ?",
  timestamp: new Date(),
};

const BUBBLE_SIZE = 56; // 14 * 4 = 56px (w-14)
const CHAT_WIDTH = 360;
const CHAT_HEIGHT = 520;
const EDGE_MARGIN = 16;

export default function AIChatWidget() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showPulse, setShowPulse] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Drag state
  const [position, setPosition] = useState<Position>({ x: -1, y: -1 });
  const [isDragging, setIsDragging] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);
  const dragOffset = useRef<Position>({ x: 0, y: 0 });
  const bubbleRef = useRef<HTMLButtonElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);

  // Set mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize position (bottom-right by default)
  useEffect(() => {
    const saved = localStorage.getItem("dnf_chat_position");
    if (saved) {
      try {
        const pos = JSON.parse(saved);
        // Validate saved position is still within viewport
        const maxX = window.innerWidth - BUBBLE_SIZE - EDGE_MARGIN;
        const maxY = window.innerHeight - BUBBLE_SIZE - EDGE_MARGIN;
        setPosition({
          x: Math.min(Math.max(EDGE_MARGIN, pos.x), maxX),
          y: Math.min(Math.max(EDGE_MARGIN, pos.y), maxY),
        });
      } catch {
        setDefaultPosition();
      }
    } else {
      setDefaultPosition();
    }
  }, []);

  const setDefaultPosition = () => {
    setPosition({
      x: window.innerWidth - BUBBLE_SIZE - 24,
      y: window.innerHeight - BUBBLE_SIZE - 24,
    });
  };

  // Save position to localStorage
  useEffect(() => {
    if (position.x >= 0 && position.y >= 0) {
      localStorage.setItem("dnf_chat_position", JSON.stringify(position));
    }
  }, [position]);

  // Drag handlers — unified for mouse and touch
  const handleDragStart = useCallback(
    (clientX: number, clientY: number) => {
      setIsDragging(true);
      setHasDragged(false);
      dragOffset.current = {
        x: clientX - position.x,
        y: clientY - position.y,
      };
    },
    [position]
  );

  const handleDragMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!isDragging) return;
      setHasDragged(true);

      const maxX = window.innerWidth - BUBBLE_SIZE - EDGE_MARGIN;
      const maxY = window.innerHeight - BUBBLE_SIZE - EDGE_MARGIN;

      setPosition({
        x: Math.min(Math.max(EDGE_MARGIN, clientX - dragOffset.current.x), maxX),
        y: Math.min(Math.max(EDGE_MARGIN, clientY - dragOffset.current.y), maxY),
      });
    },
    [isDragging]
  );

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);

    // Snap to nearest horizontal edge
    const midX = window.innerWidth / 2;
    setPosition((prev) => ({
      x:
        prev.x + BUBBLE_SIZE / 2 < midX
          ? EDGE_MARGIN
          : window.innerWidth - BUBBLE_SIZE - EDGE_MARGIN,
      y: prev.y,
    }));
  }, [isDragging]);

  // Mouse events
  useEffect(() => {
    if (!isDragging) return;

    const onMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      handleDragMove(e.clientX, e.clientY);
    };
    const onMouseUp = () => handleDragEnd();

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  // Touch events
  useEffect(() => {
    if (!isDragging) return;

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        e.preventDefault();
        handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const onTouchEnd = () => handleDragEnd();

    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  // Calculate chat window position relative to bubble
  const getChatPosition = (): React.CSSProperties => {
    const bubbleCenterX = position.x + BUBBLE_SIZE / 2;
    const isRightSide = bubbleCenterX > window.innerWidth / 2;

    // Horizontal: align to right edge if bubble is on right, left edge if on left
    const chatX = isRightSide
      ? Math.max(EDGE_MARGIN, position.x + BUBBLE_SIZE - CHAT_WIDTH)
      : Math.min(position.x, window.innerWidth - CHAT_WIDTH - EDGE_MARGIN);

    // Vertical: place above the bubble, fall below if not enough space
    const spaceAbove = position.y - EDGE_MARGIN;
    const chatY =
      spaceAbove >= CHAT_HEIGHT + 12
        ? position.y - CHAT_HEIGHT - 12
        : position.y + BUBBLE_SIZE + 12;

    // Clamp within viewport
    const clampedY = Math.min(
      Math.max(EDGE_MARGIN, chatY),
      window.innerHeight - CHAT_HEIGHT - EDGE_MARGIN
    );

    return {
      left: `${chatX}px`,
      top: `${clampedY}px`,
    };
  };

  // Load session from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("dnf_chat_session");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.sessionId) setSessionId(data.sessionId);
        if (data.messages?.length > 1) {
          setMessages(
            data.messages.map((m: any) => ({
              ...m,
              timestamp: new Date(m.timestamp),
            }))
          );
        }
      } catch {
        // Ignore parse errors
      }
    }
  }, []);

  // Save session to localStorage
  useEffect(() => {
    if (sessionId || messages.length > 1) {
      localStorage.setItem(
        "dnf_chat_session",
        JSON.stringify({
          sessionId,
          messages: messages.slice(-30),
        })
      );
    }
  }, [sessionId, messages]);

  // Scroll to bottom when new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        setShowPulse(false);
      }, 300);
    }
  }, [isOpen]);

  // Close chat when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        bubbleRef.current &&
        !bubbleRef.current.contains(event.target as Node) &&
        windowRef.current &&
        !windowRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMsg: Message = {
      id: `user_${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          message: trimmed,
          session_id: sessionId,
        }),
      });

      if (!res.ok) throw new Error("API error");

      const data = await res.json();
      const reply = data?.data?.reply || data?.reply;
      const newSessionId = data?.data?.session_id || data?.session_id;

      if (newSessionId && !sessionId) {
        setSessionId(newSessionId);
      }

      if (reply) {
        const botMsg: Message = {
          id: `bot_${Date.now()}`,
          role: "assistant",
          content: reply,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMsg]);
      }
    } catch {
      const errorMsg: Message = {
        id: `error_${Date.now()}`,
        role: "assistant",
        content:
          "Xin lỗi, tôi đang gặp sự cố kết nối. Bạn vui lòng gọi Hotline **0918 90 90 60** để được hỗ trợ trực tiếp nhé!",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, sessionId]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatContent = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br />")
      .replace(
        /• (.*?)(?=<br|$)/g,
        '<span class="flex gap-1.5 items-start"><span class="text-[#0562d2] mt-0.5">•</span><span>$1</span></span>'
      );
  };

  // Don't render until mounted and position is initialized
  if (!mounted || position.x < 0) return null;

  return (
    <>
      {/* Draggable Chat Bubble */}
      <button
        ref={bubbleRef}
        onMouseDown={(e) => {
          e.preventDefault();
          handleDragStart(e.clientX, e.clientY);
        }}
        onTouchStart={(e) => {
          if (e.touches.length === 1) {
            handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
          }
        }}
        onClick={() => {
          // Only toggle if not dragged
          if (!hasDragged) setIsOpen((prev) => !prev);
        }}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          touchAction: "none",
        }}
        className={`fixed z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-colors duration-200 cursor-grab active:cursor-grabbing select-none ${
          isOpen
            ? "bg-[#333] hover:bg-[#1a1a1a]"
            : "bg-[#0562d2] hover:bg-[#044ea7]"
        } ${isDragging ? "scale-110 shadow-2xl !cursor-grabbing" : ""}`}
        title={isOpen ? "Đóng chat" : "Chat với AI tư vấn (kéo để di chuyển)"}
        aria-label={isOpen ? "Đóng chat" : "Mở chat AI tư vấn Ford Đồng Nai"}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white pointer-events-none" />
        ) : (
          <>
            <MessageCircle className="w-6 h-6 text-white pointer-events-none" />
            {showPulse && (
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white animate-pulse pointer-events-none" />
            )}
          </>
        )}

        {/* Drag hint indicator */}
        {!isOpen && !isDragging && (
          <span className="absolute -bottom-1 -left-1 w-4 h-4 bg-white/90 rounded-full flex items-center justify-center shadow-sm pointer-events-none">
            <GripVertical className="w-2.5 h-2.5 text-gray-500" />
          </span>
        )}
      </button>

      {/* Chat Window — positioned relative to bubble */}
      <div
        ref={windowRef}
        style={{
          ...getChatPosition(),
          width: `${CHAT_WIDTH}px`,
        }}
        className={`fixed z-50 max-w-[calc(100vw-32px)] transition-all duration-300 origin-bottom-right ${
          isOpen
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col h-[520px]">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#00095B] to-[#0562D2] px-5 py-4 flex items-center gap-3 flex-shrink-0">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-white text-sm font-bold">
                Trợ lý AI Ford Đồng Nai
              </h3>
              <p className="text-white/70 text-xs">
                Tư vấn 24/7 • Phản hồi tức thì
              </p>
            </div>
            <a
              href="tel:0918909060"
              className="w-8 h-8 bg-white/15 hover:bg-white/25 rounded-full flex items-center justify-center transition-colors"
              title="Gọi Hotline"
            >
              <Phone className="w-4 h-4 text-white" />
            </a>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-[#f8f9fa]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 bg-[#0562d2] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] px-3.5 py-2.5 text-[13px] leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[#0562d2] text-white rounded-2xl rounded-br-md"
                      : "bg-white text-gray-700 rounded-2xl rounded-bl-md border border-gray-100 shadow-sm"
                  }`}
                  dangerouslySetInnerHTML={{
                    __html: formatContent(msg.content),
                  }}
                />
                {msg.role === "user" && (
                  <div className="w-7 h-7 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex gap-2 justify-start">
                <div className="w-7 h-7 bg-[#0562d2] rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md border border-gray-100 shadow-sm">
                  <div className="flex gap-1">
                    <span
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-gray-100 bg-white flex-shrink-0">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Nhập câu hỏi..."
                disabled={isLoading}
                className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0562d2] focus:border-transparent disabled:opacity-50 placeholder:text-gray-400"
                maxLength={2000}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 bg-[#0562d2] hover:bg-[#044ea7] disabled:bg-gray-300 rounded-full flex items-center justify-center transition-colors flex-shrink-0 cursor-pointer disabled:cursor-not-allowed"
                aria-label="Gửi tin nhắn"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                ) : (
                  <Send className="w-4 h-4 text-white" />
                )}
              </button>
            </div>
            <p className="text-[10px] text-gray-400 mt-1.5 text-center">
              Trợ lý AI có thể mắc lỗi. Liên hệ{" "}
              <a href="tel:0918909060" className="text-[#0562d2]">
                0918 90 90 60
              </a>{" "}
              để xác nhận.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

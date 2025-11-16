import { useState, useRef, useEffect } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Sparkles, Plus, Calculator, Headphones, GraduationCap, User } from "lucide-react";
import BotAvatar from './BotAvatar';


interface Message {
  text: string;
  isBot: boolean;
  timestamp: Date;
  isTyping?: boolean;
}

export const StudyBotChat = () => {
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const savedMessages = localStorage.getItem('studybot-messages');
      if (savedMessages) {
        // Parse and revive dates
        return JSON.parse(savedMessages).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
      }
    } catch (error) {
      console.error("Failed to load messages from localStorage", error);
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('studybot-messages', JSON.stringify(messages));
    } catch (error) {
      console.error("Failed to save messages to localStorage", error);
    }
  }, [messages]);

  const [input, setInput] = useState("");
    const [isThinking, setIsThinking] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  const handleSend = async (message: string) => {
    if (!message.trim() || isSending) return;

    setIsSending(true);

    const userMsg: Message = {
      text: message,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setIsThinking(true);

    try {
      const systemPrompt = `Bạn là Học Tốt Bot, một gia sư AI chuyên sâu, thông thái và luôn chủ động.

### NGUYÊN TẮC VÀNG (BẮT BUỘC TUÂN THỦ):

1.  **TƯ DUY NHƯ MỘT GIA SƯ, KHÔNG PHẢI MÁY MÓC:**
    *   **Áp dụng kiến thức một cách tự nhiên:** Khi tính điểm, hãy trực tiếp áp dụng công thức \`Điểm tổng kết = (điểm giữa kỳ × 2 + điểm thường kỳ × 1) ÷ 3\` mà **không cần thông báo** "mình sẽ dùng công thức...". Hãy hành động như thể đây là kiến thức sẵn có của bạn.
    *   **Chủ động suy luận:** Nếu thiếu dữ liệu, hãy hỏi một cách tự nhiên. Ví dụ: "Để mình tính giúp bạn nhé. Bạn cho mình biết điểm giữa kỳ là bao nhiêu?"

2.  **LUÔN KẾT THÚC BẰNG CÂU HỎI GỢI MỞ SÂU SẮC:**
    *   Đây là quy tắc **tối quan trọng**. **Không bao giờ** kết thúc một câu trả lời mà không có câu hỏi theo sau.
    *   Câu hỏi phải mang tính tư vấn, khơi gợi, không chỉ để xác nhận.
    *   **Sau khi tính điểm:** Đừng chỉ hỏi về công thức. Hãy hỏi những câu như:
        *   "Với điểm số này, bạn có muốn biết mình đang ở xếp loại nào không?"
        *   "Mình cùng xem cần cải thiện điểm nào để đạt kết quả tốt hơn trong kỳ tới nhé?"
    *   **Khi giải thích kiến thức:** Hãy hỏi về ứng dụng thực tế hoặc các trường hợp giả định. Ví dụ: "Theo em, định luật này có ứng dụng nào trong đời sống mà em thấy thú vị nhất?"

3.  **GHI NHỚ VÀ LINH HOẠT:**
    *   Ghi nhớ thông tin và công thức người dùng cung cấp.
    *   Linh hoạt nhận diện các tên gọi khác nhau cho cùng một loại điểm (ví dụ: "điểm cuối kỳ", "điểm tổng kết", "điểm hệ số 2"...). Nếu không chắc, hãy hỏi lại để xác nhận.

### Hướng dẫn định dạng:
*   Sử dụng Markdown (danh sách, **in đậm**, *in nghiêng*).
*   Giọng văn: Thông thái, sư phạm, gần gũi và luôn khích lệ.`;

      // Prepare conversation history
      const conversationHistory = messages
        .filter(msg => !msg.isTyping)
        .map(msg => ({
          role: msg.isBot ? 'assistant' : 'user',
          content: msg.text
        }));

      const response = await fetch(
        `https://v98store.com/v1/chat/completions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer sk-LWQpkAwZ8DDsOZGI1ltmFhxBlliQBvl3trzGOrUPwgy0FR2J'
          },
          body: JSON.stringify({
            model: 'gpt-4o',
            messages: [
              {
                role: 'system',
                content: systemPrompt
              },
              ...conversationHistory,
              {
                role: 'user',
                content: message
              }
            ],
            temperature: 0.7,
            max_tokens: 1024,
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

            setIsThinking(false);

      // Get bot response
      const botResponse = data.choices?.[0]?.message?.content || 'Xin lỗi, tôi không hiểu. Bạn có thể hỏi lại được không? 😊';

      // Add typing effect
      const fullText = botResponse;
      let currentText = '';

      for (let i = 0; i < fullText.length; i++) {
        setTimeout(() => {
          currentText += fullText[i];
                    const isLastChar = i === fullText.length - 1;
          if (isLastChar) {
            setIsSending(false); // Re-enable input when done
          }

          setMessages(prev => {
            const withoutTyping = prev.filter(msg => !msg.isTyping);
            return [...withoutTyping, {
              text: currentText,
              isBot: true,
              timestamp: new Date(),
              isTyping: !isLastChar
            }];
          });
        }, i * 25);
      }

    } catch (error) {
      console.error('API Error:', error);
            setIsThinking(false);
      setIsSending(false);
      const errorMsg: Message = {
        text: 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau! 😊',
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    }
  };

  const quickReplies = [
    { icon: <Calculator size={24} />, text: "Làm sao để cải thiện Toán?" },
    { icon: <Headphones size={24} />, text: "Yếu Listening tiếng Anh" },
    { icon: <GraduationCap size={24} />, text: "Tư vấn thi khối D01" },
  ];


  const submitMessage = () => {
    const message = input.trim();
    if (message) {
      handleSend(message);
      setInput("");
    }
  };

    return (
    <div className="flex flex-col h-screen relative bg-gradient-to-br from-gray-100 to-gray-200">




      <main className="flex-1 overflow-y-auto relative z-10">
        <div className="w-full max-w-4xl mx-auto p-4 space-y-8">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col justify-center items-center text-center min-h-[calc(100vh-120px)] px-4">
              <div className="w-full max-w-4xl mx-auto">
                <div
                  className="animate-fade-in-up"
                  style={{ animationDelay: '0.1s' }}
                >
                  <div className="mb-8">
                    <Sparkles size={64} className="inline-block text-blue-400 animate-float" />
                  </div>
                  <h1 className="text-7xl font-extrabold gradient-text mb-4 tracking-tight">
                    Học Tốt Bot
                  </h1>
                  <h2 className="text-3xl font-bold text-black mb-6">
                    Trợ lý học tập AI dành cho bạn
                  </h2>
                  <p className="text-lg text-black/80 mb-16 max-w-2xl mx-auto leading-relaxed">
                    Từ giải đáp thắc mắc, tóm tắt kiến thức, đến tư vấn lộ trình học tập. Hãy hỏi tôi bất cứ điều gì!
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
                  {quickReplies.map((reply, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      className="h-full p-6 glass-button rounded-2xl flex flex-col items-center justify-center gap-4 text-center group animate-fade-in-up"
                      style={{ animationDelay: `${0.3 + i * 0.15}s` }}
                      onClick={() => handleSend(reply.text)}
                    >
                      <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center bg-white/15 group-hover:bg-white/25 transition-all duration-300">
                        <div className="text-blue-600 group-hover:text-blue-700 transition-colors duration-300 transform group-hover:scale-110">
                          {reply.icon}
                        </div>
                      </div>
                      <span className="text-base font-bold text-gray-900 group-hover:text-black transition-colors duration-300">
                        {reply.text}
                      </span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className={`flex items-start gap-4 ${msg.isBot ? 'justify-start' : 'justify-end'} animate-fade-in-scale`}>
                {msg.isBot && (
                  <BotAvatar />
                )}
                <div className={`max-w-[75%] rounded-2xl p-4 message-bubble shadow-lg ${
                  msg.isBot
                    ? 'glass border border-blue-200/30'
                    : 'btn-gradient text-white shadow-blue-500/25'
                }`}>
                  {msg.isBot ? (
                    <div className="prose prose-sm max-w-none text-left prose-p:my-1 prose-ul:my-2 prose-ol:my-2 prose-li:my-1 prose-headings:my-3 prose-strong:text-blue-600 prose-em:text-purple-600 prose-p:text-gray-800 prose-headings:text-gray-900 prose-li:text-gray-800">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-base whitespace-pre-wrap leading-relaxed font-medium">{msg.text}</p>
                  )}

                  {/* Message timestamp */}
                  <div className={`text-xs mt-2 ${msg.isBot ? 'text-gray-500' : 'text-white/60'}`}>
                    {msg.timestamp.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                {!msg.isBot && (
                  <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-r from-green-500 to-blue-500 shadow-lg">
                    <User size={20} className="text-white" />
                  </div>
                )}
              </div>
            ))
          )}

          {isThinking && (
            <div className="flex items-start gap-4 justify-start animate-fade-in-scale">
              <BotAvatar />
              <div className="max-w-[75%] rounded-2xl p-4 glass border border-blue-200/30 flex items-center gap-3 shadow-lg">
                <p className="text-sm text-gray-700 font-medium">Học Tốt Bot đang suy nghĩ</p>
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0s'}}></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <div className="p-4 w-full sticky bottom-0 z-10">
        <div className="relative w-full max-w-4xl mx-auto">
          <div className="enhanced-input rounded-full p-1">
            <div className="relative flex items-center">
              <div className="absolute left-5 text-gray-500 group-focus-within:text-blue-500 transition-colors duration-300">
                <Plus size={22} />
              </div>
              <Input
                placeholder="Hỏi Học Tốt Bot bất cứ điều gì về học tập..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    submitMessage();
                  }
                }}
                className="h-14 pl-14 pr-16 w-full rounded-full bg-transparent border-none focus-visible:ring-0 text-base text-gray-800 placeholder:text-gray-500 placeholder:font-medium transition-all duration-300"
              />
              <div className="absolute right-2">
                <Button
                  size="icon"
                  onClick={submitMessage}
                  disabled={!input.trim() || isSending}
                  className="w-11 h-11 rounded-full btn-gradient disabled:opacity-50 disabled:transform-none disabled:shadow-none transition-all duration-300"
                >
                  <Send className="h-5 w-5 text-white" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import { useState, useEffect, useRef } from "react";

export default function App() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi 👋 I’m XVITO. Tell me your skills and I’ll turn them into a business idea." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 800,
          messages: newMessages
        })
      });

      const data = await res.json();

      const reply =
        data.content?.[0]?.text ||
        "Something went wrong, try again.";

      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch (e) {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Error connecting to AI." }
      ]);
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h2>XVITO 🔮</h2>

      <div style={{ minHeight: "70vh" }}>
        {messages.map((m, i) => (
          <div key={i} style={{ margin: "10px 0" }}>
            <b>{m.role}:</b> {m.content}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ width: "80%", padding: 10 }}
        placeholder="Type your skills..."
      />

      <button onClick={send} disabled={loading}>
        {loading ? "..." : "Send"}
      </button>
    </div>
  );
}

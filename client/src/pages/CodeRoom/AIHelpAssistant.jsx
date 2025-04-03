import React, { useState } from 'react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

const AIHelpAssistant = ({ selectedCode }) => {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    if (!question || !selectedCode) return;
    setLoading(true);
    setResponse('');
    try {
      const res = await axios.post('http://localhost:3000/ask-ai', {
        code: selectedCode,
        question: question,
      });
      setResponse(res.data.answer);
    } catch (err) {
      setResponse('⚠️ Failed to get response from AI.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-800 text-white p-4 rounded-xl shadow-xl w-full max-w-xl mx-auto mt-4">
      <h2 className="text-lg font-semibold mb-2">💬 Ask AI Assistant</h2>

      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Describe your issue or ask a question..."
        className="w-full p-3 rounded-md bg-zinc-700 text-white resize-none mb-3 border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        rows={3}
      />

      <button
        onClick={askAI}
        disabled={loading || !question}
        className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md transition flex items-center gap-2"
      >
        {loading && <Loader2 className="animate-spin w-4 h-4" />}
        Ask AI
      </button>

      {response && (
        <div className="mt-4 bg-zinc-700 p-3 rounded-md text-sm text-white whitespace-pre-wrap">
          <strong>Response:</strong>
          <p className="mt-1">{response}</p>
        </div>
      )}
    </div>
  );
};

export default AIHelpAssistant;

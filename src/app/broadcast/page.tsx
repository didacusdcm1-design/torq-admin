'use client';

import { useState } from 'react';

export default function BroadcastPage() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [target, setTarget] = useState('ALL');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!title || !message) return alert('Please fill in all fields');
    setLoading(true);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://torq-api.onrender.com';
      const res = await fetch(API_URL + '/notifications/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, message, target }),
      });

      if (!res.ok) throw new Error('Failed to send broadcast');
      alert('? Broadcast sent successfully!');
      setTitle('');
      setMessage('');
    } catch (error) {
      alert('? Error sending broadcast.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Broadcast Center</h1>
        <p className="text-gray-400 mt-2">Send push notifications and alerts to your users.</p>
      </div>

      <div className="bg-[#111111] border border-[#222] rounded-2xl p-6 shadow-xl">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">Target Audience</label>
          <select value={target} onChange={(e) => setTarget(e.target.value)} className="w-full bg-black border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-yellow-500">
            <option value="ALL">Everyone (Riders & Customers)</option>
            <option value="RIDERS">All Riders</option>
            <option value="CUSTOMERS">All Customers</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">Notification Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Important Update" className="w-full bg-black border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-yellow-500" />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
          <textarea rows={4} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type your message here..." className="w-full bg-black border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-yellow-500 resize-none" />
        </div>

        <button onClick={handleSend} disabled={loading} className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-lg transition-colors flex justify-center items-center">
          {loading ? 'Sending...' : 'Send Broadcast Now'}
        </button>
      </div>
    </div>
  );
}

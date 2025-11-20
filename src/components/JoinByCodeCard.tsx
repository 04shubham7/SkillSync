"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { Input } from './ui/input';
import SpotlightCard from './ui/SpotlightCard';
import { Users } from 'lucide-react';

export default function JoinByCodeCard() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleJoin = async () => {
    if (!code.trim()) {
      setError('Please enter a meeting code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/interviews/join', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ code: code.trim().toUpperCase() }),
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err?.error || 'Meeting not found');
        setLoading(false);
        return;
      }

      const data = await res.json();
      router.push(data.redirect || `/meeting/${data.id}`);
    } catch (err) {
      console.error(err);
      setError('Failed to join meeting');
      setLoading(false);
    }
  };

  return (
    <SpotlightCard
      className="h-full w-full cursor-pointer flex flex-col justify-start items-start p-4 md:p-8 bg-white/5 shadow-xl backdrop-blur-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:border-green-400/40 group-hover:bg-white/10 dark:border-neutral-800"
      spotlightColor="rgba(34, 197, 94, 0.6)"
    >
      <div className="w-full h-full flex flex-col justify-between" style={{ minHeight: '100%' }}>
        <div className="flex items-start justify-start mb-6">
          <div
            className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-white/10 to-white/5 border border-white/20 group-hover:from-green-400/30 group-hover:to-green-600/20 transition-all duration-300 shadow-md"
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
            }}
          >
            <Users className="w-6 h-6 sm:w-8 sm:h-8 text-white drop-shadow-lg" />
          </div>
        </div>

        <div className="w-full space-y-3">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-black dark:text-white mb-2 text-start drop-shadow-sm">
            Join by Code
          </h3>
          <p className="text-sm sm:text-base text-black dark:text-white/80 text-start font-normal mb-4">
            Enter meeting code to join
          </p>

          <div className="space-y-2">
            <Input
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''));
                setError('');
              }}
              placeholder="ABCD1234"
              className="w-full text-center text-lg font-mono tracking-wider"
              maxLength={12}
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleJoin();
              }}
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
            <Button
              onClick={handleJoin}
              disabled={loading || !code.trim()}
              className="w-full"
            >
              {loading ? 'Joining...' : 'Join Meeting'}
            </Button>
          </div>
        </div>
      </div>
    </SpotlightCard>
  );
}

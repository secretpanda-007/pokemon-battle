import React from 'react';
import dynamic from 'next/dynamic';

// Use dynamic import with SSR disabled to prevent hydration issues with socket.io
const PokemonBattle = dynamic(() => import('../components/PokemonBattle'), { 
  ssr: false 
});

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <PokemonBattle />
      </div>
    </div>
  );
}

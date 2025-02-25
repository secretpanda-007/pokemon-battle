import React from 'react';
import dynamic from 'next/dynamic';

// Prevent hydration issues with client-side only component
const PokemonBattle = dynamic(() => import('../components/PokemonBattle'), { 
  ssr: false 
});

export default function Home() {
  return <PokemonBattle />;
}

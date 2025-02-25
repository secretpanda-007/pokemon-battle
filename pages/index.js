import dynamic from 'next/dynamic';

const PokemonBattle = dynamic(() => import('../components/PokemonBattle'), { ssr: false });

export default function Home() {
  return <PokemonBattle />;
}

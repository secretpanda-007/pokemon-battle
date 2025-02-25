import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const PokemonBattle = () => {
  // Socket reference for WebSocket connection
  const socketRef = useRef(null);

  // Complete list of original 151 Pokémon with types and base HP (images removed)
  const originalPokemonList = [
    { id: 1, name: 'Bulbasaur', type: 'Grass', secondaryType: 'Poison', hp: 45 },
    { id: 2, name: 'Ivysaur', type: 'Grass', secondaryType: 'Poison', hp: 60 },
    { id: 3, name: 'Venusaur', type: 'Grass', secondaryType: 'Poison', hp: 80 },
    { id: 4, name: 'Charmander', type: 'Fire', secondaryType: null, hp: 39 },
    { id: 5, name: 'Charmeleon', type: 'Fire', secondaryType: null, hp: 58 },
    { id: 6, name: 'Charizard', type: 'Fire', secondaryType: 'Flying', hp: 78 },
    { id: 7, name: 'Squirtle', type: 'Water', secondaryType: null, hp: 44 },
    { id: 8, name: 'Wartortle', type: 'Water', secondaryType: null, hp: 59 },
    { id: 9, name: 'Blastoise', type: 'Water', secondaryType: null, hp: 79 },
    { id: 10, name: 'Caterpie', type: 'Bug', secondaryType: null, hp: 45 },
    { id: 11, name: 'Metapod', type: 'Bug', secondaryType: null, hp: 50 },
    { id: 12, name: 'Butterfree', type: 'Bug', secondaryType: 'Flying', hp: 60 },
    { id: 13, name: 'Weedle', type: 'Bug', secondaryType: 'Poison', hp: 40 },
    { id: 14, name: 'Kakuna', type: 'Bug', secondaryType: 'Poison', hp: 45 },
    { id: 15, name: 'Beedrill', type: 'Bug', secondaryType: 'Poison', hp: 65 },
    { id: 16, name: 'Pidgey', type: 'Normal', secondaryType: 'Flying', hp: 40 },
    { id: 17, name: 'Pidgeotto', type: 'Normal', secondaryType: 'Flying', hp: 63 },
    { id: 18, name: 'Pidgeot', type: 'Normal', secondaryType: 'Flying', hp: 83 },
    { id: 19, name: 'Rattata', type: 'Normal', secondaryType: null, hp: 30 },
    { id: 20, name: 'Raticate', type: 'Normal', secondaryType: null, hp: 55 },
    { id: 21, name: 'Spearow', type: 'Normal', secondaryType: 'Flying', hp: 40 },
    { id: 22, name: 'Fearow', type: 'Normal', secondaryType: 'Flying', hp: 65 },
    { id: 23, name: 'Ekans', type: 'Poison', secondaryType: null, hp: 35 },
    { id: 24, name: 'Arbok', type: 'Poison', secondaryType: null, hp: 60 },
    { id: 25, name: 'Pikachu', type: 'Electric', secondaryType: null, hp: 35 },
    { id: 26, name: 'Raichu', type: 'Electric', secondaryType: null, hp: 60 },
    { id: 27, name: 'Sandshrew', type: 'Ground', secondaryType: null, hp: 50 },
    { id: 28, name: 'Sandslash', type: 'Ground', secondaryType: null, hp: 75 },
    { id: 29, name: 'Nidoran♀', type: 'Poison', secondaryType: null, hp: 55 },
    { id: 30, name: 'Nidorina', type: 'Poison', secondaryType: null, hp: 70 },
    { id: 31, name: 'Nidoqueen', type: 'Poison', secondaryType: 'Ground', hp: 90 },
    { id: 32, name: 'Nidoran♂', type: 'Poison', secondaryType: null, hp: 46 },
    { id: 33, name: 'Nidorino', type: 'Poison', secondaryType: null, hp: 61 },
    { id: 34, name: 'Nidoking', type: 'Poison', secondaryType: 'Ground', hp: 81 },
    { id: 35, name: 'Clefairy', type: 'Normal', secondaryType: null, hp: 70 },
    { id: 36, name: 'Clefable', type: 'Normal', secondaryType: null, hp: 95 },
    { id: 37, name: 'Vulpix', type: 'Fire', secondaryType: null, hp: 38 },
    { id: 38, name: 'Ninetales', type: 'Fire', secondaryType: null, hp: 73 },
    { id: 39, name: 'Jigglypuff', type: 'Normal', secondaryType: null, hp: 115 },
    { id: 40, name: 'Wigglytuff', type: 'Normal', secondaryType: null, hp: 140 },
    { id: 41, name: 'Zubat', type: 'Poison', secondaryType: 'Flying', hp: 40 },
    { id: 42, name: 'Golbat', type: 'Poison', secondaryType: 'Flying', hp: 75 },
    { id: 43, name: 'Oddish', type: 'Grass', secondaryType: 'Poison', hp: 45 },
    { id: 44, name: 'Gloom', type: 'Grass', secondaryType: 'Poison', hp: 60 },
    { id: 45, name: 'Vileplume', type: 'Grass', secondaryType: 'Poison', hp: 75 },
    { id: 46, name: 'Paras', type: 'Bug', secondaryType: 'Grass', hp: 35 },
    { id: 47, name: 'Parasect', type: 'Bug', secondaryType: 'Grass', hp: 60 },
    { id: 48, name: 'Venonat', type: 'Bug', secondaryType: 'Poison', hp: 60 },
    { id: 49, name: 'Venomoth', type: 'Bug', secondaryType: 'Poison', hp: 70 },
    { id: 50, name: 'Diglett', type: 'Ground', secondaryType: null, hp: 10 },
    { id: 51, name: 'Dugtrio', type: 'Ground', secondaryType: null, hp: 35 },
    { id: 52, name: 'Meowth', type: 'Normal', secondaryType: null, hp: 40 },
    { id: 53, name: 'Persian', type: 'Normal', secondaryType: null, hp: 65 },
    { id: 54, name: 'Psyduck', type: 'Water', secondaryType: null, hp: 50 },
    { id: 55, name: 'Golduck', type: 'Water', secondaryType: null, hp: 80 },
    { id: 56, name: 'Mankey', type: 'Fighting', secondaryType: null, hp: 40 },
    { id: 57, name: 'Primeape', type: 'Fighting', secondaryType: null, hp: 65 },
    { id: 58, name: 'Growlithe', type: 'Fire', secondaryType: null, hp: 55 },
    { id: 59, name: 'Arcanine', type: 'Fire', secondaryType: null, hp: 90 },
    { id: 60, name: 'Poliwag', type: 'Water', secondaryType: null, hp: 40 },
    { id: 61, name: 'Poliwhirl', type: 'Water', secondaryType: null, hp: 65 },
    { id: 62, name: 'Poliwrath', type: 'Water', secondaryType: 'Fighting', hp: 90 },
    { id: 63, name: 'Abra', type: 'Psychic', secondaryType: null, hp: 25 },
    { id: 64, name: 'Kadabra', type: 'Psychic', secondaryType: null, hp: 40 },
    { id: 65, name: 'Alakazam', type: 'Psychic', secondaryType: null, hp: 55 },
    { id: 66, name: 'Machop', type: 'Fighting', secondaryType: null, hp: 70 },
    { id: 67, name: 'Machoke', type: 'Fighting', secondaryType: null, hp: 80 },
    { id: 68, name: 'Machamp', type: 'Fighting', secondaryType: null, hp: 90 },
    { id: 69, name: 'Bellsprout', type: 'Grass', secondaryType: 'Poison', hp: 50 },
    { id: 70, name: 'Weepinbell', type: 'Grass', secondaryType: 'Poison', hp: 65 },
    { id: 71, name: 'Victreebel', type: 'Grass', secondaryType: 'Poison', hp: 80 },
    { id: 72, name: 'Tentacool', type: 'Water', secondaryType: 'Poison', hp: 40 },
    { id: 73, name: 'Tentacruel', type: 'Water', secondaryType: 'Poison', hp: 80 },
    { id: 74, name: 'Geodude', type: 'Rock', secondaryType: 'Ground', hp: 40 },
    { id: 75, name: 'Graveler', type: 'Rock', secondaryType: 'Ground', hp: 55 },
    { id: 76, name: 'Golem', type: 'Rock', secondaryType: 'Ground', hp: 80 },
    { id: 77, name: 'Ponyta', type: 'Fire', secondaryType: null, hp: 50 },
    { id: 78, name: 'Rapidash', type: 'Fire', secondaryType: null, hp: 65 },
    { id: 79, name: 'Slowpoke', type: 'Water', secondaryType: 'Psychic', hp: 90 },
    { id: 80, name: 'Slowbro', type: 'Water', secondaryType: 'Psychic', hp: 95 },
    { id: 81, name: 'Magnemite', type: 'Electric', secondaryType: null, hp: 25 },
    { id: 82, name: 'Magneton', type: 'Electric', secondaryType: null, hp: 50 },
    { id: 83, name: 'Farfetch\'d', type: 'Normal', secondaryType: 'Flying', hp: 52 },
    { id: 84, name: 'Doduo', type: 'Normal', secondaryType: 'Flying', hp: 35 },
    { id: 85, name: 'Dodrio', type: 'Normal', secondaryType: 'Flying', hp: 60 },
    { id: 86, name: 'Seel', type: 'Water', secondaryType: null, hp: 65 },
    { id: 87, name: 'Dewgong', type: 'Water', secondaryType: 'Ice', hp: 90 },
    { id: 88, name: 'Grimer', type: 'Poison', secondaryType: null, hp: 80 },
    { id: 89, name: 'Muk', type: 'Poison', secondaryType: null, hp: 105 },
    { id: 90, name: 'Shellder', type: 'Water', secondaryType: null, hp: 30 },
    { id: 91, name: 'Cloyster', type: 'Water', secondaryType: 'Ice', hp: 50 },
    { id: 92, name: 'Gastly', type: 'Ghost', secondaryType: 'Poison', hp: 30 },
    { id: 93, name: 'Haunter', type: 'Ghost', secondaryType: 'Poison', hp: 45 },
    { id: 94, name: 'Gengar', type: 'Ghost', secondaryType: 'Poison', hp: 60 },
    { id: 95, name: 'Onix', type: 'Rock', secondaryType: 'Ground', hp: 35 },
    { id: 96, name: 'Drowzee', type: 'Psychic', secondaryType: null, hp: 60 },
    { id: 97, name: 'Hypno', type: 'Psychic', secondaryType: 'null', hp: 85 },
    { id: 98, name: 'Krabby', type: 'Water', secondaryType: null, hp: 30 },
    { id: 99, name: 'Kingler', type: 'Water', secondaryType: null, hp: 55 },
    { id: 100, name: 'Voltorb', type: 'Electric', secondaryType: null, hp: 40 },
    { id: 101, name: 'Electrode', type: 'Electric', secondaryType: null, hp: 60 },
    { id: 102, name: 'Exeggcute', type: 'Grass', secondaryType: 'Psychic', hp: 60 },
    { id: 103, name: 'Exeggutor', type: 'Grass', secondaryType: 'Psychic', hp: 95 },
    { id: 104, name: 'Cubone', type: 'Ground', secondaryType: null, hp: 50 },
    { id: 105, name: 'Marowak', type: 'Ground', secondaryType: null, hp: 60 },
    { id: 106, name: 'Hitmonlee', type: 'Fighting', secondaryType: null, hp: 50 },
    { id: 107, name: 'Hitmonchan', type: 'Fighting', secondaryType: null, hp: 50 },
    { id: 108, name: 'Lickitung', type: 'Normal', secondaryType: null, hp: 90 },
    { id: 109, name: 'Koffing', type: 'Poison', secondaryType: null, hp: 40 },
    { id: 110, name: 'Weezing', type: 'Poison', secondaryType: null, hp: 65 },
    { id: 111, name: 'Rhyhorn', type: 'Ground', secondaryType: 'Rock', hp: 80 },
    { id: 112, name: 'Rhydon', type: 'Ground', secondaryType: 'Rock', hp: 105 },
    { id: 113, name: 'Chansey', type: 'Normal', secondaryType: null, hp: 250 },
    { id: 114, name: 'Tangela', type: 'Grass', secondaryType: null, hp: 65 },
    { id: 115, name: 'Kangaskhan', type: 'Normal', secondaryType: null, hp: 105 },
    { id: 116, name: 'Horsea', type: 'Water', secondaryType: null, hp: 30 },
    { id: 117, name: 'Seadra', type: 'Water', secondaryType: null, hp: 55 },
    { id: 118, name: 'Goldeen', type: 'Water', secondaryType: null, hp: 45 },
    { id: 119, name: 'Seaking', type: 'Water', secondaryType: null, hp: 80 },
    { id: 120, name: 'Staryu', type: 'Water', secondaryType: null, hp: 30 },
    { id: 121, name: 'Starmie', type: 'Water', secondaryType: 'Psychic', hp: 60 },
    { id: 122, name: 'Mr. Mime', type: 'Psychic', secondaryType: null, hp: 40 },
    { id: 123, name: 'Scyther', type: 'Bug', secondaryType: 'Flying', hp: 70 },
    { id: 124, name: 'Jynx', type: 'Ice', secondaryType: 'Psychic', hp: 65 },
    { id: 125, name: 'Electabuzz', type: 'Electric', secondaryType: null, hp: 65 },
    { id: 126, name: 'Magmar', type: 'Fire', secondaryType: null, hp: 65 },
    { id: 127, name: 'Pinsir', type: 'Bug', secondaryType: null, hp: 65 },
    { id: 128, name: 'Tauros', type: 'Normal', secondaryType: null, hp: 75 },
    { id: 129, name: 'Magikarp', type: 'Water', secondaryType: null, hp: 20 },
    { id: 130, name: 'Gyarados', type: 'Water', secondaryType: 'Flying', hp: 95 },
    { id: 131, name: 'Lapras', type: 'Water', secondaryType: 'Ice', hp: 130 },
    { id: 132, name: 'Ditto', type: 'Normal', secondaryType: null, hp: 48 },
    { id: 133, name: 'Eevee', type: 'Normal', secondaryType: null, hp: 55 },
    { id: 134, name: 'Vaporeon', type: 'Water', secondaryType: null, hp: 130 },
    { id: 135, name: 'Jolteon', type: 'Electric', secondaryType: null, hp: 65 },
    { id: 136, name: 'Flareon', type: 'Fire', secondaryType: null, hp: 65 },
    { id: 137, name: 'Porygon', type: 'Normal', secondaryType: null, hp: 65 },
    { id: 138, name: 'Omanyte', type: 'Rock', secondaryType: 'Water', hp: 35 },
    { id: 139, name: 'Omastar', type: 'Rock', secondaryType: 'Water', hp: 70 },
    { id: 140, name: 'Kabuto', type: 'Rock', secondaryType: 'Water', hp: 30 },
    { id: 141, name: 'Kabutops', type: 'Rock', secondaryType: 'Water', hp: 60 },
    { id: 142, name: 'Aerodactyl', type: 'Rock', secondaryType: 'Flying', hp: 80 },
    { id: 143, name: 'Snorlax', type: 'Normal', secondaryType: null, hp: 160 },
    { id: 144, name: 'Articuno', type: 'Ice', secondaryType: 'Flying', hp: 90 },
    { id: 145, name: 'Zapdos', type: 'Electric', secondaryType: 'Flying', hp: 90 },
    { id: 146, name: 'Moltres', type: 'Fire', secondaryType: 'Flying', hp: 90 },
    { id: 147, name: 'Dratini', type: 'Dragon', secondaryType: null, hp: 41 },
    { id: 148, name: 'Dragonair', type: 'Dragon', secondaryType: null, hp: 61 },
    { id: 149, name: 'Dragonite', type: 'Dragon', secondaryType: 'Flying', hp: 91 },
    { id: 150, name: 'Mewtwo', type: 'Psychic', secondaryType: null, hp: 106 },
    { id: 151, name: 'Mew', type: 'Psychic', secondaryType: null, hp: 100 }
  ];

  // State variables
  const [playerTeam, setPlayerTeam] = useState([]);
  const [opponentTeam, setOpponentTeam] = useState([]);
  const [playerActivePokemon, setPlayerActivePokemon] = useState(null);
  const [opponentActivePokemon, setOpponentActivePokemon] = useState(null);
  const [battleLog, setBattleLog] = useState([]);
  const [gameState, setGameState] = useState('selecting'); // 'selecting', 'battle', 'playerTurn', 'opponentTurn', 'playerWin', 'opponentWin'
  const [selectedMove, setSelectedMove] = useState(null);
  const [gameMode, setGameMode] = useState('singleplayer'); // 'singleplayer', 'multiplayer'
  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [multiplayerStatus, setMultiplayerStatus] = useState('disconnected'); // 'disconnected', 'waiting', 'connected'
  const [teamSize, setTeamSize] = useState(6);
  const [showAllPokemon, setShowAllPokemon] = useState(false);

  // Initialize game on component mount
  useEffect(() => {
    if (gameMode === 'singleplayer') {
      generateRandomTeams();
    }
    
    // Clean up socket connection on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [gameMode]);

  // Extended type chart for all Generation 1 types
  const typeChart = {
    'Bug': {
      'Fighting': 0.5, 'Flying': 0.5, 'Poison': 0.5,
      'Ghost': 0.5, 'Fire': 0.5, 'Grass': 2,
      'Psychic': 2, 'Normal': 1, 'Ground': 1,
      'Rock': 1, 'Ice': 1, 'Dragon': 1,
      'Water': 1, 'Electric': 1
    },
    'Dragon': {
      'Dragon': 2, 'Normal': 1, 'Fighting': 1,
      'Flying': 1, 'Poison': 1, 'Ground': 1,
      'Rock': 1, 'Bug': 1, 'Ghost': 1,
      'Fire': 1, 'Water': 1, 'Grass': 1,
      'Electric': 1, 'Psychic': 1, 'Ice': 1
    },
    'Electric': {
      'Flying': 2, 'Water': 2, 'Dragon': 0.5,
      'Electric': 0.5, 'Grass': 0.5, 'Ground': 0,
      'Normal': 1, 'Fighting': 1, 'Poison': 1,
      'Rock': 1, 'Bug': 1, 'Ghost': 1,
      'Fire': 1, 'Psychic': 1, 'Ice': 1
    },
    'Fighting': {
      'Normal': 2, 'Ice': 2, 'Rock': 2,
      'Flying': 0.5, 'Poison': 0.5, 'Bug': 0.5,
      'Psychic': 0.5, 'Ghost': 0, 'Ground': 1,
      'Fire': 1, 'Water': 1, 'Grass': 1,
      'Electric': 1, 'Dragon': 1
    },
    'Fire': {
      'Bug': 2, 'Grass': 2, 'Ice': 2,
      'Dragon': 0.5, 'Fire': 0.5, 'Water': 0.5,
      'Rock': 0.5, 'Normal': 1, 'Fighting': 1,
      'Flying': 1, 'Poison': 1, 'Ground': 1,
      'Ghost': 1, 'Electric': 1, 'Psychic': 1
    },
    'Flying': {
      'Fighting': 2, 'Bug': 2, 'Grass': 2,
      'Electric': 0.5, 'Rock': 0.5, 'Normal': 1,
      'Poison': 1, 'Ground': 1, 'Ghost': 1,
      'Fire': 1, 'Water': 1, 'Electric': 1,
      'Psychic': 1, 'Ice': 1, 'Dragon': 1
    },
    'Ghost': {
      'Ghost': 2, 'Psychic': 2, 'Normal': 0,
      'Fighting': 0, 'Poison': 1, 'Ground': 1,
      'Rock': 1, 'Bug': 1, 'Fire': 1,
      'Water': 1, 'Grass': 1, 'Electric': 1,
      'Ice': 1, 'Dragon': 1, 'Flying': 1
    },
    'Grass': {
      'Ground': 2, 'Rock': 2, 'Water': 2,
      'Flying': 0.5, 'Poison': 0.5, 'Bug': 0.5,
      'Fire': 0.5, 'Grass': 0.5, 'Dragon': 0.5,
      'Normal': 1, 'Fighting': 1, 'Ghost': 1,
      'Electric': 1, 'Psychic': 1, 'Ice': 1
    },
    'Ground': {
      'Poison': 2, 'Rock': 2, 'Fire': 2,
      'Electric': 2, 'Bug': 0.5, 'Grass': 0.5,
      'Flying': 0, 'Normal': 1, 'Fighting': 1,
      'Ground': 1, 'Ghost': 1, 'Water': 1,
      'Psychic': 1, 'Ice': 1, 'Dragon': 1
    },
    'Ice': {
      'Flying': 2, 'Ground': 2, 'Grass': 2,
      'Dragon': 2, 'Fire': 0.5, 'Water': 0.5,
      'Ice': 0.5, 'Normal': 1, 'Fighting': 1,
      'Poison': 1, 'Rock': 1, 'Bug': 1,
      'Ghost': 1, 'Electric': 1, 'Psychic': 1
    },
    'Normal': {
      'Ghost': 0, 'Fighting': 1, 'Flying': 1,
      'Poison': 1, 'Ground': 1, 'Rock': 1,
      'Bug': 1, 'Fire': 1, 'Water': 1,
      'Grass': 1, 'Electric': 1, 'Psychic': 1,
      'Ice': 1, 'Dragon': 1
    },
    'Poison': {
      'Grass': 2, 'Poison': 0.5, 'Ground': 0.5,
      'Rock': 0.5, 'Bug': 1, 'Ghost': 0.5,
      'Normal': 1, 'Fighting': 1, 'Flying': 1,
      'Fire': 1, 'Water': 1, 'Electric': 1,
      'Psychic': 1, 'Ice': 1, 'Dragon': 1
    },
    'Psychic': {
      'Fighting': 2, 'Poison': 2, 'Psychic': 0.5,
      'Normal': 1, 'Flying': 1, 'Ground': 1,
      'Rock': 1, 'Bug': 1, 'Ghost': 1,
      'Fire': 1, 'Water': 1, 'Grass': 1,
      'Electric': 1, 'Ice': 1, 'Dragon': 1
    },
    'Rock': {
      'Flying': 2, 'Bug': 2, 'Fire': 2,
      'Ice': 2, 'Fighting': 0.5, 'Ground': 0.5,
      'Normal': 1, 'Poison': 1, 'Ghost': 1,
      'Water': 1, 'Grass': 1, 'Electric': 1,
      'Psychic': 1, 'Dragon': 1
    },
    'Water': {
      'Ground': 2, 'Rock': 2, 'Fire': 2,
      'Water': 0.5, 'Grass': 0.5, 'Dragon': 0.5,
      'Normal': 1, 'Fighting': 1, 'Flying': 1,
      'Poison': 1, 'Bug': 1, 'Ghost': 1,
      'Electric': 1, 'Psychic': 1, 'Ice': 1
    }
  };

  // Generate random teams of Pokémon
  const generateRandomTeams = () => {
    const shuffledPokemon = [...originalPokemonList].sort(() => 0.5 - Math.random());
    
    // Player team - first X Pokémon
    const playerPokemonTeam = shuffledPokemon.slice(0, teamSize).map(pokemon => ({
      ...pokemon,
      currentHp: pokemon.hp,
      moves: generateMoves(pokemon.type, pokemon.secondaryType)
    }));
    
    // Opponent team - next X Pokémon (for singleplayer)
    const opponentPokemonTeam = shuffledPokemon.slice(teamSize, teamSize * 2).map(pokemon => ({
      ...pokemon,
      currentHp: pokemon.hp,
      moves: generateMoves(pokemon.type, pokemon.secondaryType)
    }));
    
    setPlayerTeam(playerPokemonTeam);
    setOpponentTeam(opponentPokemonTeam);
    setPlayerActivePokemon(playerPokemonTeam[0]);
    setOpponentActivePokemon(opponentPokemonTeam[0]);
    setBattleLog(['Teams have been selected!', 'Click "Start Battle" to begin!']);
    setGameState('selecting');
  };

  // Generate enhanced moves based on Pokémon type(s)
  const generateMoves = (primaryType, secondaryType) => {
    const movesByType = {
      'Bug': [
        { name: 'String Shot', power: 10, type: 'Bug' },
        { name: 'Leech Life', power: 20, type: 'Bug' },
        { name: 'Pin Missile', power: 25, type: 'Bug' }
      ],
      'Dragon': [
        { name: 'Dragon Rage', power: 15, type: 'Dragon' },
        { name: 'Outrage', power: 25, type: 'Dragon' },
        { name: 'Draco Meteor', power: 30, type: 'Dragon' }
      ],
      'Electric': [
        { name: 'Thunder Shock', power: 15, type: 'Electric' },
        { name: 'Thunderbolt', power: 20, type: 'Electric' },
        { name: 'Thunder', power: 25, type: 'Electric' }
      ],
      'Fighting': [
        { name: 'Karate Chop', power: 15, type: 'Fighting' },
        { name: 'Submission', power: 20, type: 'Fighting' },
        { name: 'Hi Jump Kick', power: 25, type: 'Fighting' }
      ],
      'Fire': [
        { name: 'Ember', power: 15, type: 'Fire' },
        { name: 'Flamethrower', power: 20, type: 'Fire' },
        { name: 'Fire Blast', power: 25, type: 'Fire' }
      ],
      'Flying': [
        { name: 'Gust', power: 15, type: 'Flying' },
        { name: 'Wing Attack', power: 20, type: 'Flying' },
        { name: 'Sky Attack', power: 25, type: 'Flying' }
      ],
      'Ghost': [
        { name: 'Lick', power: 15, type: 'Ghost' },
        { name: 'Shadow Ball', power: 20, type: 'Ghost' },
        { name: 'Shadow Claw', power: 25, type: 'Ghost' }
      ],
      'Grass': [
        { name: 'Vine Whip', power: 15, type: 'Grass' },
        { name: 'Razor Leaf', power: 20, type: 'Grass' },
        { name: 'Solar Beam', power: 25, type: 'Grass' }
      ],
      'Ground': [
        { name: 'Mud Shot', power: 15, type: 'Ground' },
        { name: 'Earthquake', power: 20, type: 'Ground' },
        { name: 'Fissure', power: 25, type: 'Ground' }
      ],
      'Ice': [
        { name: 'Ice Shard', power: 15, type: 'Ice' },
        { name: 'Ice Beam', power: 20, type: 'Ice' },
        { name: 'Blizzard', power: 25, type: 'Ice' }
      ],
      'Normal': [
        { name: 'Tackle', power: 15, type: 'Normal' },
        { name: 'Quick Attack', power: 20, type: 'Normal' },
        { name: 'Hyper Beam', power: 25, type: 'Normal' }
      ],
      'Poison': [
        { name: 'Poison Sting', power: 15, type: 'Poison' },
        { name: 'Sludge', power: 20, type: 'Poison' },
        { name: 'Acid', power: 25, type: 'Poison' }
      ],
      'Psychic': [
        { name: 'Confusion', power: 15, type: 'Psychic' },
        { name: 'Psychic', power: 20, type: 'Psychic' },
        { name: 'Psybeam', power: 25, type: 'Psychic' }
      ],
      'Rock': [
        { name: 'Rock Throw', power: 15, type: 'Rock' },
        { name: 'Rock Slide', power: 20, type: 'Rock' },
        { name: 'Stone Edge', power: 25, type: 'Rock' }
      ],
      'Water': [
        { name: 'Water Gun', power: 15, type: 'Water' },
        { name: 'Bubble Beam', power: 20, type: 'Water' },
        { name: 'Hydro Pump', power: 25, type: 'Water' }
      ]
    };
    
    // Get primary type moves
    const primaryMoves = movesByType[primaryType] || movesByType['Normal'];
    
    // Get secondary type move if available
    let secondaryMove = null;
    if (secondaryType && movesByType[secondaryType]) {
      const secondaryMoves = movesByType[secondaryType];
      secondaryMove = secondaryMoves[Math.floor(Math.random() * secondaryMoves.length)];
    }
    
    // Create move list (3 or 4 moves)
    let moveList = [...primaryMoves];
    
    // Include a secondary type move if available
    if (secondaryMove) {
      // Replace one primary move with secondary type move
      moveList[Math.floor(Math.random() * moveList.length)] = secondaryMove;
    }
    
    // Add a general move if we have less than 4 moves
    if (moveList.length < 4) {
      moveList.push({ name: 'Tackle', power: 10, type: 'Normal' });
    }
    
    return moveList;
  };

  // Calculate type effectiveness
  const getTypeEffectiveness = (moveType, defenderType, defenderSecondaryType) => {
    let effectiveness = typeChart[moveType] && typeChart[moveType][defenderType] ? typeChart[moveType][defenderType] : 1;
    
    // Calculate effectiveness against secondary type if present
    if (defenderSecondaryType) {
      const secondaryEffectiveness = typeChart[moveType] && typeChart[moveType][defenderSecondaryType] 
        ? typeChart[moveType][defenderSecondaryType] 
        : 1;
      effectiveness *= secondaryEffectiveness;
    }
    
    return effectiveness;
  };

  // Start the battle
  const startBattle = () => {
    setBattleLog([
      'Battle started!',
      `Go ${playerActivePokemon.name}!`,
      `Opponent sent out ${opponentActivePokemon.name}!`
    ]);
    setGameState('playerTurn');
  };

  // Initialize socket connection
  const initializeSocket = async () => {
    if (!socketRef.current) {
      socketRef.current = io({ path: '/api/socket' });
      
      socketRef.current.on('connect', () => {
        console.log('Connected to socket server');
        setMultiplayerStatus('waiting');
      });
      
      socketRef.current.on('room_created', ({ roomId }) => {
        setRoomCode(roomId);
        setBattleLog([...battleLog, `Room created! Your room code is: ${roomId}`, 'Waiting for an opponent to join...']);
      });
      
      socketRef.current.on('joined_room', ({ roomId }) => {
        setRoomCode(roomId);
        setBattleLog([...battleLog, `Successfully joined room ${roomId}!`]);
      });
      
      socketRef.current.on('battle_ready', ({ players }) => {
        setBattleLog([...battleLog, `Battle starting between ${players[0].name} and ${players[1].name}!`]);
        setMultiplayerStatus('connected');
      });
      
      socketRef.current.on('opponent_team', ({ team }) => {
        setOpponentTeam(team);
        setOpponentActivePokemon(team[0]);
      });
      
      socketRef.current.on('opponent_action', (action) => {
        handleOpponentAction(action);
      });
      
      socketRef.current.on('opponent_disconnected', () => {
        setBattleLog([...battleLog, 'Your opponent has disconnected.']);
        setMultiplayerStatus('disconnected');
        setGameState('opponentWin');
      });
      
      socketRef.current.on('error', ({ message }) => {
        setBattleLog([...battleLog, `Error: ${message}`]);
        setMultiplayerStatus('disconnected');
      });
    }
  };
  
  // Create a new multiplayer room
  const createMultiplayerRoom = async () => {
    if (!playerName.trim()) {
      setBattleLog([...battleLog, 'Please enter your name first!']);
      return;
    }
    
    await initializeSocket();
    socketRef.current.emit('create_room', { name: playerName });
  };
  
  // Join an existing multiplayer room
  const joinMultiplayerRoom = async () => {
    if (!playerName.trim() || !roomCode) {
      setBattleLog([...battleLog, 'Please enter your name and a room code!']);
      return;
    }
    
    await initializeSocket();
    socketRef.current.emit('join_room', {
      roomId: roomCode,
      playerData: { name: playerName }
    });
  };
  
  // Handle opponent actions received via WebSocket
  const handleOpponentAction = (action) => {
    if (action.type === 'attack') {
      const move = action.move;
      const effectiveness = getTypeEffectiveness(
        move.type, 
        playerActivePokemon.type, 
        playerActivePokemon.secondaryType
      );
      
      const baseDamage = move.power;
      const damage = Math.floor(baseDamage * effectiveness * action.randomFactor);
      
      const newHp = Math.max(0, playerActivePokemon.currentHp - damage);
      const updatedPlayer = { ...playerActivePokemon, currentHp: newHp };
      setPlayerActivePokemon(updatedPlayer);
      
      setPlayerTeam(prev => 
        prev.map(pokemon => 
          pokemon.id === playerActivePokemon.id ? updatedPlayer : pokemon
        )
      );
      
      addToLog(`Opponent's ${action.pokemonName} used ${move.name}!`);
      addToLog(`Dealt ${damage} damage!`);
      
      if (newHp === 0) {
        addToLog(`${playerActivePokemon.name} fainted!`);
        const nextPlayer = playerTeam.find(p => p.id !== playerActivePokemon.id && p.currentHp > 0);
        
        if (nextPlayer) {
          setGameState('switching');
          addToLog('Choose your next Pokémon!');
        } else {
          addToLog('All your Pokémon have fainted!');
          setGameState('opponentWin');
        }
      } else {
        setGameState('playerTurn');
      }
    } else if (action.type === 'switch') {
      addToLog(`Opponent switched to ${action.pokemonName}!`);
      const switchedPokemon = opponentTeam.find(p => p.id === action.pokemonId);
      if (switchedPokemon) {
        setOpponentActivePokemon(switchedPokemon);
      }
      setGameState('playerTurn');
    } else if (action.type === 'chat') {
      const chatWindow = document.getElementById('chat-window');
      if (chatWindow) {
        const msgElement = document.createElement('div');
        msgElement.className = 'text-sm';
        msgElement.textContent = `${action.sender}: ${action.message}`;
        chatWindow.appendChild(msgElement);
        chatWindow.scrollTop = chatWindow.scrollHeight;
      }
    }
  };

  // Create a custom team
  const createCustomTeam = (selectedPokemon) => {
    if (selectedPokemon.length !== teamSize) {
      setBattleLog([...battleLog, `Please select exactly ${teamSize} Pokémon!`]);
      return;
    }
    
    const playerPokemonTeam = selectedPokemon.map(pokemon => ({
      ...pokemon,
      currentHp: pokemon.hp,
      moves: generateMoves(pokemon.type, pokemon.secondaryType)
    }));
    
    setPlayerTeam(playerPokemonTeam);
    setPlayerActivePokemon(playerPokemonTeam[0]);
    setBattleLog(['Custom team selected!', 'Click "Start Battle" to begin!']);
    setGameState('selecting');
    setShowAllPokemon(false);
    
    if (gameMode === 'multiplayer' && multiplayerStatus === 'connected' && socketRef.current) {
      socketRef.current.emit('team_selected', {
        roomId: roomCode,
        team: playerPokemonTeam
      });
    }
  };

  // Filter Pokémon by type and/or search term
  const getFilteredPokemon = () => {
    return originalPokemonList.filter(pokemon => {
      const matchesType = filterType === 'All' || 
                          pokemon.type === filterType || 
                          pokemon.secondaryType === filterType;
      const matchesSearch = pokemon.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesType && matchesSearch;
    });
  };

  // Add message to battle log
  const addToLog = (message) => {
    setBattleLog(prev => [...prev, message]);
  };

  // Handle player's attack
  const handlePlayerAttack = (moveIndex) => {
    if (gameState !== 'playerTurn') return;
    
    setSelectedMove(moveIndex);
    const move = playerActivePokemon.moves[moveIndex];
    const effectiveness = getTypeEffectiveness(
      move.type, 
      opponentActivePokemon.type, 
      opponentActivePokemon.secondaryType
    );
    
    const baseDamage = move.power;
    const randomFactor = 0.85 + Math.random() * 0.3;
    const damage = Math.floor(baseDamage * effectiveness * randomFactor);
    
    let effectivenessMessage = '';
    if (effectiveness > 1) {
      effectivenessMessage = "It's super effective!";
    } else if (effectiveness < 1 && effectiveness > 0) {
      effectivenessMessage = "It's not very effective...";
    } else if (effectiveness === 0) {
      effectivenessMessage = "It has no effect!";
    }
    
    const newHp = Math.max(0, opponentActivePokemon.currentHp - damage);
    const updatedOpponent = { ...opponentActivePokemon, currentHp: newHp };
    setOpponentActivePokemon(updatedOpponent);
    
    setOpponentTeam(prev => 
      prev.map(pokemon => 
        pokemon.id === opponentActivePokemon.id ? updatedOpponent : pokemon
      )
    );
    
    addToLog(`${playerActivePokemon.name} used ${move.name}!`);
    if (damage > 0) {
      addToLog(`Dealt ${damage} damage! ${effectivenessMessage}`);
    }
    
    if (gameMode === 'multiplayer' && multiplayerStatus === 'connected' && socketRef.current) {
      socketRef.current.emit('battle_action', {
        roomId: roomCode,
        action: {
          type: 'attack',
          pokemonName: playerActivePokemon.name,
          move: move,
          randomFactor: randomFactor
        }
      });
    }
    
    if (newHp === 0) {
      addToLog(`${opponentActivePokemon.name} fainted!`);
      const nextOpponent = opponentTeam.find(p => p.id !== opponentActivePokemon.id && p.currentHp > 0);
      
      if (nextOpponent) {
        setTimeout(() => {
          setOpponentActivePokemon(nextOpponent);
          addToLog(`Opponent sent out ${nextOpponent.name}!`);
          setGameState('playerTurn');
        }, 1500);
      } else {
        addToLog('You defeated all opponent Pokémon!');
        setGameState('playerWin');
      }
    } else {
      setGameState('opponentTurn');
      if (gameMode === 'singleplayer') {
        setTimeout(() => {
          console.log('Triggering opponent attack'); // Debug log
          handleOpponentAttack();
        }, 1500);
      }
    }
  };

  // Handle opponent's attack (for singleplayer)
  const handleOpponentAttack = () => {
    console.log('Opponent attack executing'); // Debug log
    const moveIndex = Math.floor(Math.random() * opponentActivePokemon.moves.length);
    const move = opponentActivePokemon.moves[moveIndex];
    const effectiveness = getTypeEffectiveness(
      move.type, 
      playerActivePokemon.type, 
      playerActivePokemon.secondaryType
    );
    
    const baseDamage = move.power;
    const randomFactor = 0.85 + Math.random() * 0.3;
    const damage = Math.floor(baseDamage * effectiveness * randomFactor);
    
    let effectivenessMessage = '';
    if (effectiveness > 1) {
      effectivenessMessage = "It's super effective!";
    } else if (effectiveness < 1 && effectiveness > 0) {
      effectivenessMessage = "It's not very effective...";
    } else if (effectiveness === 0) {
      effectivenessMessage = "It has no effect!";
    }
    
    const newHp = Math.max(0, playerActivePokemon.currentHp - damage);
    const updatedPlayer = { ...playerActivePokemon, currentHp: newHp };
    setPlayerActivePokemon(updatedPlayer);
    
    setPlayerTeam(prev => 
      prev.map(pokemon => 
        pokemon.id === playerActivePokemon.id ? updatedPlayer : pokemon
      )
    );
    
    addToLog(`${opponentActivePokemon.name} used ${move.name}!`);
    if (damage > 0) {
      addToLog(`Dealt ${damage} damage! ${effectivenessMessage}`);
    }
    
    if (newHp === 0) {
      addToLog(`${playerActivePokemon.name} fainted!`);
      const nextPlayer = playerTeam.find(p => p.id !== playerActivePokemon.id && p.currentHp > 0);
      
      if (nextPlayer) {
        setGameState('switching');
        addToLog('Choose your next Pokémon!');
      } else {
        addToLog('All your Pokémon have fainted!');
        setGameState('opponentWin');
      }
    } else {
      setGameState('playerTurn');
      setSelectedMove(null);
    }
  };

  // Handle player switching Pokémon
  const switchPokemon = (pokemon) => {
    if (gameState !== 'switching' && gameState !== 'playerTurn') return;
    if (pokemon.id === playerActivePokemon.id) return;
    if (pokemon.currentHp <= 0) return;
    
    setPlayerActivePokemon(pokemon);
    addToLog(`You switched to ${pokemon.name}!`);
    
    if (gameMode === 'multiplayer' && multiplayerStatus === 'connected' && socketRef.current) {
      socketRef.current.emit('battle_action', {
        roomId: roomCode,
        action: {
          type: 'switch',
          pokemonId: pokemon.id,
          pokemonName: pokemon.name
        }
      });
    }
    
    if (gameState === 'playerTurn') {
      setGameState('opponentTurn');
      if (gameMode === 'singleplayer') {
        setTimeout(() => {
          handleOpponentAttack();
        }, 1500);
      }
    } else {
      setGameState('playerTurn');
    }
  };

  // Scroll battle log to bottom when updated
  useEffect(() => {
    const logElement = document.getElementById('battle-log');
    if (logElement) {
      logElement.scrollTop = logElement.scrollHeight;
    }
  }, [battleLog]);

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto p-4 bg-gray-100 rounded-lg shadow">
      {/* Game Header */}
      <div className="mb-4 text-center">
        <h1 className="text-2xl font-bold mb-2">Pokémon Battle Simulator</h1>
        <p>Battle with all original 151 Pokémon!</p>
        
        {/* Game Mode Selection */}
        <div className="mt-4 mb-4 flex justify-center gap-4">
          <button 
            className={`px-4 py-2 rounded ${gameMode === 'singleplayer' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
            onClick={() => {
              setGameMode('singleplayer');
              setMultiplayerStatus('disconnected');
              if (socketRef.current) socketRef.current.disconnect();
            }}
          >
            Single Player
          </button>
          <button 
            className={`px-4 py-2 rounded ${gameMode === 'multiplayer' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
            onClick={() => setGameMode('multiplayer')}
          >
            Multiplayer
          </button>
        </div>
      </div>
      
      {/* Multiplayer Setup */}
      {gameMode === 'multiplayer' && gameState === 'selecting' && multiplayerStatus === 'disconnected' && (
        <div className="mb-6 p-4 bg-white rounded shadow">
          <h2 className="text-xl font-bold mb-4">Multiplayer Setup</h2>
          
          <div className="mb-4">
            <label className="block mb-2">Your Trainer Name:</label>
            <input 
              type="text" 
              className="w-full p-2 border rounded"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>
          
          <div className="flex space-x-4">
            <button 
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              onClick={createMultiplayerRoom}
            >
              Create Room
            </button>
            
            <div className="flex-1">
              <input 
                type="text" 
                className="w-full p-2 border rounded"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                placeholder="Enter room code"
              />
            </div>
            
            <button 
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
              disabled={!roomCode}
              onClick={joinMultiplayerRoom}
            >
              Join Room
            </button>
          </div>
        </div>
      )}
      
      {/* Pokémon Selection */}
      {showAllPokemon && (
        <div className="mb-6 p-4 bg-white rounded shadow">
          <h2 className="text-xl font-bold mb-2">Create Your Team</h2>
          <p className="mb-4">Select {teamSize} Pokémon for your team:</p>
          
          {/* Filter controls */}
          <div className="flex mb-4 gap-4">
            <div className="flex-1">
              <label className="block mb-1">Filter by Type:</label>
              <select 
                className="w-full p-2 border rounded"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="All">All Types</option>
                <option value="Bug">Bug</option>
                <option value="Dragon">Dragon</option>
                <option value="Electric">Electric</option>
                <option value="Fighting">Fighting</option>
                <option value="Fire">Fire</option>
                <option value="Flying">Flying</option>
                <option value="Ghost">Ghost</option>
                <option value="Grass">Grass</option>
                <option value="Ground">Ground</option>
                <option value="Ice">Ice</option>
                <option value="Normal">Normal</option>
                <option value="Poison">Poison</option>
                <option value="Psychic">Psychic</option>
                <option value="Rock">Rock</option>
                <option value="Water">Water</option>
              </select>
            </div>
            
            <div className="flex-1">
              <label className="block mb-1">Search:</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search Pokémon"
              />
            </div>
          </div>
          
          {/* Pokémon Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mb-4 max-h-96 overflow-y-auto">
            {getFilteredPokemon().map((pokemon) => (
              <div 
                key={pokemon.id} 
                className={`flex flex-col items-center p-2 rounded cursor-pointer transition-colors border ${
                  playerTeam.some(p => p.id === pokemon.id) 
                    ? 'bg-blue-100 border-blue-500' 
                    : 'bg-white hover:bg-gray-100 border-gray-200'
                }`}
                onClick={() => {
                  if (playerTeam.some(p => p.id === pokemon.id)) {
                    setPlayerTeam(playerTeam.filter(p => p.id !== pokemon.id));
                  } else if (playerTeam.length < teamSize) {
                    setPlayerTeam([...playerTeam, pokemon]);
                  }
                }}
              >
                <div className="font-bold text-sm">{pokemon.name}</div>
                <div className="text-xs">
                  {pokemon.type}
                  {pokemon.secondaryType && `/${pokemon.secondaryType}`}
                </div>
                <div className="text-xs">HP: {pokemon.hp}</div>
              </div>
            ))}
          </div>
          
          {/* Selected Team */}
          <h3 className="font-bold mt-4 mb-2">Selected Team ({playerTeam.length}/{teamSize}):</h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-4">
            {playerTeam.map((pokemon) => (
              <div key={pokemon.id} className="flex flex-col items-center bg-blue-100 p-2 rounded shadow">
                <div className="font-bold text-sm">{pokemon.name}</div>
                <div className="text-xs">
                  {pokemon.type}
                  {pokemon.secondaryType && `/${pokemon.secondaryType}`}
                </div>
                <button 
                  className="mt-1 text-xs bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => setPlayerTeam(playerTeam.filter(p => p.id !== pokemon.id))}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          
          <div className="flex space-x-4">
            <button 
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              onClick={() => createCustomTeam(playerTeam)}
              disabled={playerTeam.length !== teamSize}
            >
              Confirm Team
            </button>
            <button 
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              onClick={() => setShowAllPokemon(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
      {/* Team Selection / Battle Start */}
      {gameState === 'selecting' && !showAllPokemon && (
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">Your Team:</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-4">
            {playerTeam.map((pokemon) => (
              <div key={pokemon.id} className="flex flex-col items-center bg-white p-2 rounded shadow">
                <div className="font-bold text-sm">{pokemon.name}</div>
                <div className="text-xs">
                  {pokemon.type}
                  {pokemon.secondaryType && `/${pokemon.secondaryType}`}
                </div>
                <div className="text-xs">HP: {pokemon.hp}</div>
              </div>
            ))}
          </div>
          
          <h2 className="text-xl font-bold mb-2">Opponent's Team:</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-4">
            {opponentTeam.map((pokemon) => (
              <div key={pokemon.id} className="flex flex-col items-center bg-white p-2 rounded shadow">
                <div className="font-bold text-sm">{pokemon.name}</div>
                <div className="text-xs">
                  {pokemon.type}
                  {pokemon.secondaryType && `/${pokemon.secondaryType}`}
                </div>
                <div className="text-xs">HP: {pokemon.hp}</div>
              </div>
            ))}
          </div>
          
          <div className="flex flex-wrap gap-4 mt-4">
            <button 
              className="bg-yellow-500 text-black font-bold border-2 border-black scale-105 shadow-lg transform px-4 py-2 rounded"
              onClick={startBattle}
              disabled={gameMode === 'multiplayer' && multiplayerStatus !== 'connected'}
            >
              Start Battle!
            </button>
            <button 
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              onClick={generateRandomTeams}
              disabled={gameMode === 'multiplayer' && multiplayerStatus === 'connected'}
            >
              Generate New Teams
            </button>
            <button 
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
              onClick={() => setShowAllPokemon(true)}
            >
              Create Custom Team
            </button>
            <div className="flex items-center gap-2">
              <label>Team Size:</label>
              <select 
                className="p-1 border rounded"
                value={teamSize}
                onChange={(e) => setTeamSize(parseInt(e.target.value))}
              >
                <option value="3">3</option>
                <option value="6">6</option>
                <option value="9">9</option>
              </select>
            </div>
          </div>
        </div>
      )}
      
      {/* Battle Arena */}
      {gameState !== 'selecting' && (
        <div>
          {/* Battle Status */}
          <div className="text-center mb-2">
            {gameState === 'playerTurn' && <p className="text-lg font-bold text-green-600">Your turn!</p>}
            {gameState === 'opponentTurn' && <p className="text-lg font-bold text-red-600">Opponent's turn...</p>}
            {gameState === 'switching' && <p className="text-lg font-bold text-blue-600">Choose your next Pokémon!</p>}
            {gameState === 'playerWin' && <p className="text-lg font-bold text-green-600">You won the battle!</p>}
            {gameState === 'opponentWin' && <p className="text-lg font-bold text-red-600">You lost the battle!</p>}
          </div>
          
          {/* Battle Arena */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-4">
            {/* Player Pokémon */}
            <div className="flex flex-col items-center mb-4 md:mb-0">
              <div className="text-lg font-bold">{playerActivePokemon?.name}</div>
              <div className="w-32 bg-gray-300 rounded-full h-4">
                <div
                  className="bg-green-500 h-4 rounded-full transition-all duration-300"
                  style={{ width: `${(playerActivePokemon?.currentHp / playerActivePokemon?.hp) * 100}%` }}
                ></div>
              </div>
              <div className="text-sm">
                HP: {playerActivePokemon?.currentHp}/{playerActivePokemon?.hp}
              </div>
              <div className="text-sm">
                Type: {playerActivePokemon?.type}
                {playerActivePokemon?.secondaryType && `/${playerActivePokemon?.secondaryType}`}
              </div>
            </div>
            
            {/* VS */}
            <div className="text-2xl font-bold">VS</div>
            
            {/* Opponent Pokémon */}
            <div className="flex flex-col items-center">
              <div className="text-lg font-bold">{opponentActivePokemon?.name}</div>
              <div className="w-32 bg-gray-300 rounded-full h-4">
                <div
                  className="bg-red-500 h-4 rounded-full transition-all duration-300"
                  style={{ width: `${(opponentActivePokemon?.currentHp / opponentActivePokemon?.hp) * 100}%` }}
                ></div>
              </div>
              <div className="text-sm">
                HP: {opponentActivePokemon?.currentHp}/{opponentActivePokemon?.hp}
              </div>
              <div className="text-sm">
                Type: {opponentActivePokemon?.type}
                {opponentActivePokemon?.secondaryType && `/${opponentActivePokemon?.secondaryType}`}
              </div>
            </div>
          </div>
          
          {/* Battle Log */}
          <div 
            id="battle-log"
            className="h-32 overflow-y-auto p-2 mb-4 bg-white border border-gray-300 rounded"
          >
            {battleLog.map((log, index) => (
              <div key={index} className="mb-1">{log}</div>
            ))}
          </div>
          
          {/* Move Buttons */}
          {(gameState === 'playerTurn' || gameState === 'opponentTurn') && (
            <div className="mb-4">
              <h3 className="font-bold mb-1">Moves:</h3>
              <div className="grid grid-cols-2 gap-2">
                {playerActivePokemon?.moves.map((move, index) => (
                  <button
                    key={index}
                    className={`p-2 rounded transition-all duration-150 ${
                      gameState === 'playerTurn'
                        ? selectedMove === index
                          ? 'bg-yellow-500 text-black font-bold border-2 border-black scale-105 shadow-lg transform'
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                        : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    }`}
                    onClick={() => handlePlayerAttack(index)}
                    disabled={gameState !== 'playerTurn'}
                  >
                    {move.name} ({move.type}) - {move.power} PWR
                    {selectedMove === index && <span className="ml-1">✓</span>}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Pokémon Switching */}
          {(gameState === 'playerTurn' || gameState === 'switching') && (
            <div>
              <h3 className="font-bold mb-1">Switch Pokémon:</h3>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {playerTeam.map((pokemon) => (
                  <button
                    key={pokemon.id}
                    className={`p-1 rounded transition-all duration-150 ${
                      pokemon.currentHp <= 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : pokemon.id === playerActivePokemon?.id
                          ? 'bg-yellow-500 text-black font-bold border-2 border-black scale-105 shadow-lg transform'
                          : 'bg-purple-500 hover:bg-purple-600 text-white'
                    }`}
                    onClick={() => switchPokemon(pokemon)}
                    disabled={pokemon.currentHp <= 0 || pokemon.id === playerActivePokemon?.id}
                  >
                    <div className="text-xs">{pokemon.name}</div>
                    <div className="text-xs">HP: {pokemon.currentHp}/{pokemon.hp}</div>
                    {pokemon.id === playerActivePokemon?.id && <span className="text-xs">Active</span>}
                    {pokemon.currentHp <= 0 && <span className="text-xs">Fainted</span>}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Chat (for multiplayer) */}
          {gameMode === 'multiplayer' && multiplayerStatus === 'connected' && (
            <div className="mt-4 mb-4">
              <h3 className="font-bold mb-1">Chat:</h3>
              <div className="bg-white p-2 border rounded h-20 overflow-y-auto mb-2" id="chat-window">
                <div className="text-sm">System: Battle started!</div>
                <div className="text-sm">System: Good luck and have fun!</div>
                <div className="text-sm">System: Room Code: {roomCode}</div>
              </div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  className="flex-1 p-2 border rounded"
                  placeholder="Send a message"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && e.target.value.trim() && socketRef.current) {
                      const chatMsg = e.target.value.trim();
                      const chatWindow = document.getElementById('chat-window');
                      if (chatWindow) {
                        const msgElement = document.createElement('div');
                        msgElement.className = 'text-sm';
                        msgElement.textContent = `${playerName}: ${chatMsg}`;
                        chatWindow.appendChild(msgElement);
                        chatWindow.scrollTop = chatWindow.scrollHeight;
                      }
                      socketRef.current.emit('battle_action', {
                        roomId: roomCode,
                        action: {
                          type: 'chat',
                          message: chatMsg,
                          sender: playerName
                        }
                      });
                      e.target.value = '';
                    }
                  }}
                />
                <button 
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                  onClick={(e) => {
                    const input = e.target.previousSibling;
                    if (input.value.trim() && socketRef.current) {
                      const chatMsg = input.value.trim();
                      const chatWindow = document.getElementById('chat-window');
                      if (chatWindow) {
                        const msgElement = document.createElement('div');
                        msgElement.className = 'text-sm';
                        msgElement.textContent = `${playerName}: ${chatMsg}`;
                        chatWindow.appendChild(msgElement);
                        chatWindow.scrollTop = chatWindow.scrollHeight;
                      }
                      socketRef.current.emit('battle_action', {
                        roomId: roomCode,
                        action: {
                          type: 'chat',
                          message: chatMsg,
                          sender: playerName
                        }
                      });
                      input.value = '';
                    }
                  }}
                >
                  Send
                </button>
              </div>
            </div>
          )}
          
          {/* Reset Button */}
          {(gameState === 'playerWin' || gameState === 'opponentWin') && (
            <button
              className="w-full bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded mt-4"
              onClick={generateRandomTeams}
            >
              New Battle
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PokemonBattle;

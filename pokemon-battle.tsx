import React, { useState, useEffect } from 'react';

const PokemonBattle = () => {
  // Basic Pokémon data
  const pokemonList = [
    { id: 1, name: 'Bulbasaur', type: 'Grass', hp: 120, image: '/api/placeholder/80/80' },
    { id: 2, name: 'Charmander', type: 'Fire', hp: 110, image: '/api/placeholder/80/80' },
    { id: 3, name: 'Squirtle', type: 'Water', hp: 130, image: '/api/placeholder/80/80' },
    { id: 4, name: 'Pikachu', type: 'Electric', hp: 100, image: '/api/placeholder/80/80' },
    { id: 5, name: 'Jigglypuff', type: 'Normal', hp: 150, image: '/api/placeholder/80/80' },
    { id: 6, name: 'Meowth', type: 'Normal', hp: 105, image: '/api/placeholder/80/80' },
    { id: 7, name: 'Psyduck', type: 'Water', hp: 115, image: '/api/placeholder/80/80' },
    { id: 8, name: 'Geodude', type: 'Rock', hp: 125, image: '/api/placeholder/80/80' },
    { id: 9, name: 'Gastly', type: 'Ghost', hp: 95, image: '/api/placeholder/80/80' },
    { id: 10, name: 'Jynx', type: 'Ice', hp: 110, image: '/api/placeholder/80/80' },
    { id: 11, name: 'Magikarp', type: 'Water', hp: 80, image: '/api/placeholder/80/80' },
    { id: 12, name: 'Eevee', type: 'Normal', hp: 110, image: '/api/placeholder/80/80' }
  ];

  // State variables
  const [playerTeam, setPlayerTeam] = useState([]);
  const [opponentTeam, setOpponentTeam] = useState([]);
  const [playerActivePokemon, setPlayerActivePokemon] = useState(null);
  const [opponentActivePokemon, setOpponentActivePokemon] = useState(null);
  const [battleLog, setBattleLog] = useState([]);
  const [gameState, setGameState] = useState('selecting'); // 'selecting', 'battle', 'playerTurn', 'opponentTurn', 'playerWin', 'opponentWin'
  const [selectedMove, setSelectedMove] = useState(null);

  // Initialize game on component mount
  useEffect(() => {
    generateRandomTeams();
  }, []);

  // Generate random teams of 6 Pokémon each
  const generateRandomTeams = () => {
    const shuffledPokemon = [...pokemonList].sort(() => 0.5 - Math.random());
    
    // Player team - first 6 Pokémon
    const playerPokemonTeam = shuffledPokemon.slice(0, 6).map(pokemon => ({
      ...pokemon,
      currentHp: pokemon.hp,
      moves: generateMoves(pokemon.type)
    }));
    
    // Opponent team - next 6 Pokémon
    const opponentPokemonTeam = shuffledPokemon.slice(6, 12).map(pokemon => ({
      ...pokemon,
      currentHp: pokemon.hp,
      moves: generateMoves(pokemon.type)
    }));
    
    setPlayerTeam(playerPokemonTeam);
    setOpponentTeam(opponentPokemonTeam);
    setPlayerActivePokemon(playerPokemonTeam[0]);
    setOpponentActivePokemon(opponentPokemonTeam[0]);
    setBattleLog(['Teams have been selected!', 'Click "Start Battle" to begin!']);
    setGameState('selecting');
  };

  // Generate moves based on Pokémon type
  const generateMoves = (type) => {
    const movesByType = {
      'Grass': [
        { name: 'Vine Whip', power: 15, type: 'Grass' },
        { name: 'Razor Leaf', power: 20, type: 'Grass' },
        { name: 'Solar Beam', power: 25, type: 'Grass' }
      ],
      'Fire': [
        { name: 'Ember', power: 15, type: 'Fire' },
        { name: 'Flamethrower', power: 20, type: 'Fire' },
        { name: 'Fire Blast', power: 25, type: 'Fire' }
      ],
      'Water': [
        { name: 'Water Gun', power: 15, type: 'Water' },
        { name: 'Bubble Beam', power: 20, type: 'Water' },
        { name: 'Hydro Pump', power: 25, type: 'Water' }
      ],
      'Electric': [
        { name: 'Thunder Shock', power: 15, type: 'Electric' },
        { name: 'Thunderbolt', power: 20, type: 'Electric' },
        { name: 'Thunder', power: 25, type: 'Electric' }
      ],
      'Normal': [
        { name: 'Tackle', power: 15, type: 'Normal' },
        { name: 'Quick Attack', power: 20, type: 'Normal' },
        { name: 'Hyper Beam', power: 25, type: 'Normal' }
      ],
      'Rock': [
        { name: 'Rock Throw', power: 15, type: 'Rock' },
        { name: 'Rock Slide', power: 20, type: 'Rock' },
        { name: 'Stone Edge', power: 25, type: 'Rock' }
      ],
      'Ghost': [
        { name: 'Lick', power: 15, type: 'Ghost' },
        { name: 'Shadow Ball', power: 20, type: 'Ghost' },
        { name: 'Shadow Claw', power: 25, type: 'Ghost' }
      ],
      'Ice': [
        { name: 'Ice Shard', power: 15, type: 'Ice' },
        { name: 'Ice Beam', power: 20, type: 'Ice' },
        { name: 'Blizzard', power: 25, type: 'Ice' }
      ]
    };
    
    // Get 3 type-specific moves
    const typeMoves = movesByType[type] || movesByType['Normal'];
    
    // Add one general move
    const generalMove = { name: 'Tackle', power: 10, type: 'Normal' };
    
    return [...typeMoves, generalMove];
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

  // Add message to battle log
  const addToLog = (message) => {
    setBattleLog(prev => [...prev, message]);
  };

  // Calculate type effectiveness
  const getTypeEffectiveness = (moveType, defenderType) => {
    const typeChart = {
      'Fire': { 'Grass': 2, 'Water': 0.5, 'Fire': 0.5, 'Ice': 2, 'Rock': 0.5 },
      'Water': { 'Fire': 2, 'Grass': 0.5, 'Water': 0.5, 'Rock': 2 },
      'Grass': { 'Fire': 0.5, 'Water': 2, 'Grass': 0.5, 'Rock': 2 },
      'Electric': { 'Water': 2, 'Electric': 0.5, 'Rock': 1 },
      'Normal': { 'Rock': 0.5, 'Ghost': 0 },
      'Rock': { 'Fire': 2, 'Ice': 2, 'Normal': 1 },
      'Ghost': { 'Normal': 0, 'Ghost': 2 },
      'Ice': { 'Grass': 2, 'Fire': 0.5, 'Ice': 0.5, 'Water': 0.5 }
    };
    
    return (typeChart[moveType] && typeChart[moveType][defenderType]) || 1;
  };

  // Handle player's attack
  const handlePlayerAttack = (moveIndex) => {
    if (gameState !== 'playerTurn') return;
    
    setSelectedMove(moveIndex);
    const move = playerActivePokemon.moves[moveIndex];
    const effectiveness = getTypeEffectiveness(move.type, opponentActivePokemon.type);
    
    // Calculate damage
    const baseDamage = move.power;
    const randomFactor = 0.85 + Math.random() * 0.3; // Random factor between 0.85 and 1.15
    const damage = Math.floor(baseDamage * effectiveness * randomFactor);
    
    // Effectiveness message
    let effectivenessMessage = '';
    if (effectiveness > 1) {
      effectivenessMessage = "It's super effective!";
    } else if (effectiveness < 1 && effectiveness > 0) {
      effectivenessMessage = "It's not very effective...";
    } else if (effectiveness === 0) {
      effectivenessMessage = "It has no effect!";
    }
    
    // Apply damage
    const newHp = Math.max(0, opponentActivePokemon.currentHp - damage);
    
    // Update opponent Pokémon
    const updatedOpponent = { ...opponentActivePokemon, currentHp: newHp };
    setOpponentActivePokemon(updatedOpponent);
    
    // Update opponent team
    setOpponentTeam(prev => 
      prev.map(pokemon => 
        pokemon.id === opponentActivePokemon.id ? updatedOpponent : pokemon
      )
    );
    
    // Update battle log
    addToLog(`${playerActivePokemon.name} used ${move.name}!`);
    if (damage > 0) {
      addToLog(`Dealt ${damage} damage! ${effectivenessMessage}`);
    }
    
    // Check if opponent fainted
    if (newHp === 0) {
      addToLog(`${opponentActivePokemon.name} fainted!`);
      
      // Find next opponent Pokémon
      const nextOpponent = opponentTeam.find(p => p.id !== opponentActivePokemon.id && p.currentHp > 0);
      
      if (nextOpponent) {
        // Switch to next Pokémon
        setTimeout(() => {
          setOpponentActivePokemon(nextOpponent);
          addToLog(`Opponent sent out ${nextOpponent.name}!`);
          setGameState('playerTurn');
        }, 1500);
      } else {
        // Player wins
        addToLog('You defeated all opponent Pokémon!');
        setGameState('playerWin');
      }
    } else {
      // Switch to opponent's turn
      setGameState('opponentTurn');
      
      // Opponent attacks after a delay
      setTimeout(() => {
        handleOpponentAttack();
      }, 1500);
    }
  };

  // Handle opponent's attack
  const handleOpponentAttack = () => {
    if (gameState !== 'opponentTurn') return;
    
    // Choose a random move
    const moveIndex = Math.floor(Math.random() * opponentActivePokemon.moves.length);
    const move = opponentActivePokemon.moves[moveIndex];
    const effectiveness = getTypeEffectiveness(move.type, playerActivePokemon.type);
    
    // Calculate damage
    const baseDamage = move.power;
    const randomFactor = 0.85 + Math.random() * 0.3;
    const damage = Math.floor(baseDamage * effectiveness * randomFactor);
    
    // Effectiveness message
    let effectivenessMessage = '';
    if (effectiveness > 1) {
      effectivenessMessage = "It's super effective!";
    } else if (effectiveness < 1 && effectiveness > 0) {
      effectivenessMessage = "It's not very effective...";
    } else if (effectiveness === 0) {
      effectivenessMessage = "It has no effect!";
    }
    
    // Apply damage
    const newHp = Math.max(0, playerActivePokemon.currentHp - damage);
    
    // Update player Pokémon
    const updatedPlayer = { ...playerActivePokemon, currentHp: newHp };
    setPlayerActivePokemon(updatedPlayer);
    
    // Update player team
    setPlayerTeam(prev => 
      prev.map(pokemon => 
        pokemon.id === playerActivePokemon.id ? updatedPlayer : pokemon
      )
    );
    
    // Update battle log
    addToLog(`${opponentActivePokemon.name} used ${move.name}!`);
    if (damage > 0) {
      addToLog(`Dealt ${damage} damage! ${effectivenessMessage}`);
    }
    
    // Check if player fainted
    if (newHp === 0) {
      addToLog(`${playerActivePokemon.name} fainted!`);
      
      // Find next player Pokémon
      const nextPlayer = playerTeam.find(p => p.id !== playerActivePokemon.id && p.currentHp > 0);
      
      if (nextPlayer) {
        // Switch Pokémon view to team selection
        setGameState('switching');
        addToLog('Choose your next Pokémon!');
      } else {
        // Opponent wins
        addToLog('All your Pokémon have fainted!');
        setGameState('opponentWin');
      }
    } else {
      // Back to player's turn
      setGameState('playerTurn');
      setSelectedMove(null);
    }
  };

  // Handle player switching Pokémon
  const switchPokemon = (pokemon) => {
    if (gameState !== 'switching' && gameState !== 'playerTurn') return;
    if (pokemon.id === playerActivePokemon.id) return; // Already active
    if (pokemon.currentHp <= 0) return; // Fainted Pokémon
    
    setPlayerActivePokemon(pokemon);
    addToLog(`You switched to ${pokemon.name}!`);
    
    if (gameState === 'playerTurn') {
      // If voluntary switch during player's turn, opponent gets a turn
      setGameState('opponentTurn');
      setTimeout(() => {
        handleOpponentAttack();
      }, 1500);
    } else {
      // If switching after a Pokémon fainted, player's turn continues
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
        <p>Battle with randomly selected teams of 6 Pokémon!</p>
      </div>
      
      {/* Team Selection / Battle Start */}
      {gameState === 'selecting' && (
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">Your Team:</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-4">
            {playerTeam.map((pokemon) => (
              <div key={pokemon.id} className="flex flex-col items-center bg-white p-2 rounded shadow">
                <img src={pokemon.image} alt={pokemon.name} className="w-16 h-16 mb-1" />
                <div className="font-bold text-sm">{pokemon.name}</div>
                <div className="text-xs">Type: {pokemon.type}</div>
                <div className="text-xs">HP: {pokemon.hp}</div>
              </div>
            ))}
          </div>
          
          <h2 className="text-xl font-bold mb-2">Opponent's Team:</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-4">
            {opponentTeam.map((pokemon) => (
              <div key={pokemon.id} className="flex flex-col items-center bg-white p-2 rounded shadow">
                <img src={pokemon.image} alt={pokemon.name} className="w-16 h-16 mb-1" />
                <div className="font-bold text-sm">{pokemon.name}</div>
                <div className="text-xs">Type: {pokemon.type}</div>
                <div className="text-xs">HP: {pokemon.hp}</div>
              </div>
            ))}
          </div>
          
          <div className="flex space-x-4 mt-4">
            <button 
              className="bg-yellow-500 text-black font-bold border-2 border-black scale-105 shadow-lg transform px-4 py-2 rounded"
              onClick={startBattle}
            >
              Start Battle!
            </button>
            <button 
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              onClick={generateRandomTeams}
            >
              Generate New Teams
            </button>
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
              <img src={playerActivePokemon?.image} alt={playerActivePokemon?.name} className="my-2" />
              <div className="w-32 bg-gray-300 rounded-full h-4">
                <div
                  className="bg-green-500 h-4 rounded-full transition-all duration-300"
                  style={{ width: `${(playerActivePokemon?.currentHp / playerActivePokemon?.hp) * 100}%` }}
                ></div>
              </div>
              <div className="text-sm">
                HP: {playerActivePokemon?.currentHp}/{playerActivePokemon?.hp}
              </div>
              <div className="text-sm">Type: {playerActivePokemon?.type}</div>
            </div>
            
            {/* VS */}
            <div className="text-2xl font-bold">VS</div>
            
            {/* Opponent Pokémon */}
            <div className="flex flex-col items-center">
              <div className="text-lg font-bold">{opponentActivePokemon?.name}</div>
              <img src={opponentActivePokemon?.image} alt={opponentActivePokemon?.name} className="my-2" />
              <div className="w-32 bg-gray-300 rounded-full h-4">
                <div
                  className="bg-red-500 h-4 rounded-full transition-all duration-300"
                  style={{ width: `${(opponentActivePokemon?.currentHp / opponentActivePokemon?.hp) * 100}%` }}
                ></div>
              </div>
              <div className="text-sm">
                HP: {opponentActivePokemon?.currentHp}/{opponentActivePokemon?.hp}
              </div>
              <div className="text-sm">Type: {opponentActivePokemon?.type}</div>
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
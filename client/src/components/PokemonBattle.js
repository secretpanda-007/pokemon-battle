import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const PokemonBattle = () => {
  const socketRef = useRef(null);
  const battleLogRef = useRef(null);
  const chatWindowRef = useRef(null);

  const originalPokemonList = [
    { id: 1, name: 'Bulbasaur', type: 'Grass', secondaryType: 'Poison', hp: 45, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png' },
    { id: 2, name: 'Ivysaur', type: 'Grass', secondaryType: 'Poison', hp: 60, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png' },
    { id: 3, name: 'Venusaur', type: 'Grass', secondaryType: 'Poison', hp: 80, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png' },
    { id: 4, name: 'Charmander', type: 'Fire', secondaryType: null, hp: 39, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png' },
    { id: 5, name: 'Charmeleon', type: 'Fire', secondaryType: null, hp: 58, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/5.png' },
    { id: 6, name: 'Charizard', type: 'Fire', secondaryType: 'Flying', hp: 78, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png' },
    { id: 7, name: 'Squirtle', type: 'Water', secondaryType: null, hp: 44, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png' },
    { id: 8, name: 'Wartortle', type: 'Water', secondaryType: null, hp: 59, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/8.png' },
    { id: 9, name: 'Blastoise', type: 'Water', secondaryType: null, hp: 79, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png' },
    { id: 10, name: 'Caterpie', type: 'Bug', secondaryType: null, hp: 45, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10.png' },
    { id: 11, name: 'Metapod', type: 'Bug', secondaryType: null, hp: 50, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/11.png' },
    { id: 12, name: 'Butterfree', type: 'Bug', secondaryType: 'Flying', hp: 60, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/12.png' },
    { id: 13, name: 'Weedle', type: 'Bug', secondaryType: 'Poison', hp: 40, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/13.png' },
    { id: 14, name: 'Kakuna', type: 'Bug', secondaryType: 'Poison', hp: 45, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/14.png' },
    { id: 15, name: 'Beedrill', type: 'Bug', secondaryType: 'Poison', hp: 65, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/15.png' },
    { id: 16, name: 'Pidgey', type: 'Normal', secondaryType: 'Flying', hp: 40, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/16.png' },
    { id: 17, name: 'Pidgeotto', type: 'Normal', secondaryType: 'Flying', hp: 63, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/17.png' },
    { id: 18, name: 'Pidgeot', type: 'Normal', secondaryType: 'Flying', hp: 83, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/18.png' },
    { id: 19, name: 'Rattata', type: 'Normal', secondaryType: null, hp: 30, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/19.png' },
    { id: 20, name: 'Raticate', type: 'Normal', secondaryType: null, hp: 55, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/20.png' },
    { id: 21, name: 'Spearow', type: 'Normal', secondaryType: 'Flying', hp: 40, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/21.png' },
    { id: 22, name: 'Fearow', type: 'Normal', secondaryType: 'Flying', hp: 65, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/22.png' },
    { id: 23, name: 'Ekans', type: 'Poison', secondaryType: null, hp: 35, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/23.png' },
    { id: 24, name: 'Arbok', type: 'Poison', secondaryType: null, hp: 60, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/24.png' },
    { id: 25, name: 'Pikachu', type: 'Electric', secondaryType: null, hp: 35, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png' },
    { id: 26, name: 'Raichu', type: 'Electric', secondaryType: null, hp: 60, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/26.png' },
    { id: 27, name: 'Sandshrew', type: 'Ground', secondaryType: null, hp: 50, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/27.png' },
    { id: 28, name: 'Sandslash', type: 'Ground', secondaryType: null, hp: 75, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/28.png' },
    { id: 29, name: 'Nidoran♀', type: 'Poison', secondaryType: null, hp: 55, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/29.png' },
    { id: 30, name: 'Nidorina', type: 'Poison', secondaryType: null, hp: 70, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/30.png' },
    { id: 31, name: 'Nidoqueen', type: 'Poison', secondaryType: 'Ground', hp: 90, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/31.png' },
    { id: 32, name: 'Nidoran♂', type: 'Poison', secondaryType: null, hp: 46, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/32.png' },
    { id: 33, name: 'Nidorino', type: 'Poison', secondaryType: null, hp: 61, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/33.png' },
    { id: 34, name: 'Nidoking', type: 'Poison', secondaryType: 'Ground', hp: 81, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/34.png' },
    { id: 35, name: 'Clefairy', type: 'Normal', secondaryType: null, hp: 70, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/35.png' },
    { id: 36, name: 'Clefable', type: 'Normal', secondaryType: null, hp: 95, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/36.png' },
    { id: 37, name: 'Vulpix', type: 'Fire', secondaryType: null, hp: 38, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/37.png' },
    { id: 38, name: 'Ninetales', type: 'Fire', secondaryType: null, hp: 73, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/38.png' },
    { id: 39, name: 'Jigglypuff', type: 'Normal', secondaryType: null, hp: 115, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/39.png' },
    { id: 40, name: 'Wigglytuff', type: 'Normal', secondaryType: null, hp: 140, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/40.png' },
    { id: 41, name: 'Zubat', type: 'Poison', secondaryType: 'Flying', hp: 40, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/41.png' },
    { id: 42, name: 'Golbat', type: 'Poison', secondaryType: 'Flying', hp: 75, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/42.png' },
    { id: 43, name: 'Oddish', type: 'Grass', secondaryType: 'Poison', hp: 45, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/43.png' },
    { id: 44, name: 'Gloom', type: 'Grass', secondaryType: 'Poison', hp: 60, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/44.png' },
    { id: 45, name: 'Vileplume', type: 'Grass', secondaryType: 'Poison', hp: 75, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/45.png' },
    { id: 46, name: 'Paras', type: 'Bug', secondaryType: 'Grass', hp: 35, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/46.png' },
    { id: 47, name: 'Parasect', type: 'Bug', secondaryType: 'Grass', hp: 60, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/47.png' },
    { id: 48, name: 'Venonat', type: 'Bug', secondaryType: 'Poison', hp: 60, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/48.png' },
    { id: 49, name: 'Venomoth', type: 'Bug', secondaryType: 'Poison', hp: 70, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/49.png' },
    { id: 50, name: 'Diglett', type: 'Ground', secondaryType: null, hp: 10, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/50.png' },
    { id: 51, name: 'Dugtrio', type: 'Ground', secondaryType: null, hp: 35, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/51.png' },
    { id: 52, name: 'Meowth', type: 'Normal', secondaryType: null, hp: 40, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/52.png' },
    { id: 53, name: 'Persian', type: 'Normal', secondaryType: null, hp: 65, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/53.png' },
    { id: 54, name: 'Psyduck', type: 'Water', secondaryType: null, hp: 50, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/54.png' },
    { id: 55, name: 'Golduck', type: 'Water', secondaryType: null, hp: 80, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/55.png' },
    { id: 56, name: 'Mankey', type: 'Fighting', secondaryType: null, hp: 40, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/56.png' },
    { id: 57, name: 'Primeape', type: 'Fighting', secondaryType: null, hp: 65, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/57.png' },
    { id: 58, name: 'Growlithe', type: 'Fire', secondaryType: null, hp: 55, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/58.png' },
    { id: 59, name: 'Arcanine', type: 'Fire', secondaryType: null, hp: 90, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/59.png' },
    { id: 60, name: 'Poliwag', type: 'Water', secondaryType: null, hp: 40, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/60.png' },
    { id: 61, name: 'Poliwhirl', type: 'Water', secondaryType: null, hp: 65, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/61.png' },
    { id: 62, name: 'Poliwrath', type: 'Water', secondaryType: 'Fighting', hp: 90, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/62.png' },
    { id: 63, name: 'Abra', type: 'Psychic', secondaryType: null, hp: 25, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/63.png' },
    { id: 64, name: 'Kadabra', type: 'Psychic', secondaryType: null, hp: 40, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/64.png' },
    { id: 65, name: 'Alakazam', type: 'Psychic', secondaryType: null, hp: 55, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/65.png' },
    { id: 66, name: 'Machop', type: 'Fighting', secondaryType: null, hp: 70, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/66.png' },
    { id: 67, name: 'Machoke', type: 'Fighting', secondaryType: null, hp: 80, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/67.png' },
    { id: 68, name: 'Machamp', type: 'Fighting', secondaryType: null, hp: 90, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/68.png' },
    { id: 69, name: 'Bellsprout', type: 'Grass', secondaryType: 'Poison', hp: 50, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/69.png' },
    { id: 70, name: 'Weepinbell', type: 'Grass', secondaryType: 'Poison', hp: 65, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/70.png' },
    { id: 71, name: 'Victreebel', type: 'Grass', secondaryType: 'Poison', hp: 80, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/71.png' },
    { id: 72, name: 'Tentacool', type: 'Water', secondaryType: 'Poison', hp: 40, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/72.png' },
    { id: 73, name: 'Tentacruel', type: 'Water', secondaryType: 'Poison', hp: 80, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/73.png' },
    { id: 74, name: 'Geodude', type: 'Rock', secondaryType: 'Ground', hp: 40, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/74.png' },
    { id: 75, name: 'Graveler', type: 'Rock', secondaryType: 'Ground', hp: 55, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/75.png' },
    { id: 76, name: 'Golem', type: 'Rock', secondaryType: 'Ground', hp: 80, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/76.png' },
    { id: 77, name: 'Ponyta', type: 'Fire', secondaryType: null, hp: 50, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/77.png' },
    { id: 78, name: 'Rapidash', type: 'Fire', secondaryType: null, hp: 65, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/78.png' },
    { id: 79, name: 'Slowpoke', type: 'Water', secondaryType: 'Psychic', hp: 90, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/79.png' },
    { id: 80, name: 'Slowbro', type: 'Water', secondaryType: 'Psychic', hp: 95, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/80.png' },
    { id: 81, name: 'Magnemite', type: 'Electric', secondaryType: null, hp: 25, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/81.png' },
    { id: 82, name: 'Magneton', type: 'Electric', secondaryType: null, hp: 50, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/82.png' },
    { id: 83, name: "Farfetch'd", type: 'Normal', secondaryType: 'Flying', hp: 52, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/83.png' },
    { id: 84, name: 'Doduo', type: 'Normal', secondaryType: 'Flying', hp: 35, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/84.png' },
    { id: 85, name: 'Dodrio', type: 'Normal', secondaryType: 'Flying', hp: 60, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/85.png' },
    { id: 86, name: 'Seel', type: 'Water', secondaryType: null, hp: 65, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/86.png' },
    { id: 87, name: 'Dewgong', type: 'Water', secondaryType: 'Ice', hp: 90, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/87.png' },
    { id: 88, name: 'Grimer', type: 'Poison', secondaryType: null, hp: 80, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/88.png' },
    { id: 89, name: 'Muk', type: 'Poison', secondaryType: null, hp: 105, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/89.png' },
    { id: 90, name: 'Shellder', type: 'Water', secondaryType: null, hp: 30, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/90.png' },
    { id: 91, name: 'Cloyster', type: 'Water', secondaryType: 'Ice', hp: 50, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/91.png' },
    { id: 92, name: 'Gastly', type: 'Ghost', secondaryType: 'Poison', hp: 30, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/92.png' },
    { id: 93, name: 'Haunter', type: 'Ghost', secondaryType: 'Poison', hp: 45, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/93.png' },
    { id: 94, name: 'Gengar', type: 'Ghost', secondaryType: 'Poison', hp: 60, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png' },
    { id: 95, name: 'Onix', type: 'Rock', secondaryType: 'Ground', hp: 35, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/95.png' },
    { id: 96, name: 'Drowzee', type: 'Psychic', secondaryType: null, hp: 60, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/96.png' },
    { id: 97, name: 'Hypno', type: 'Psychic', secondaryType: null, hp: 85, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/97.png' },
    { id: 98, name: 'Krabby', type: 'Water', secondaryType: null, hp: 30, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/98.png' },
    { id: 99, name: 'Kingler', type: 'Water', secondaryType: null, hp: 55, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/99.png' },
    { id: 100, name: 'Voltorb', type: 'Electric', secondaryType: null, hp: 40, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/100.png' },
    { id: 101, name: 'Electrode', type: 'Electric', secondaryType: null, hp: 60, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/101.png' },
    { id: 102, name: 'Exeggcute', type: 'Grass', secondaryType: 'Psychic', hp: 60, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/102.png' },
    { id: 103, name: 'Exeggutor', type: 'Grass', secondaryType: 'Psychic', hp: 95, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/103.png' },
    { id: 104, name: 'Cubone', type: 'Ground', secondaryType: null, hp: 50, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/104.png' },
    { id: 105, name: 'Marowak', type: 'Ground', secondaryType: null, hp: 60, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/105.png' },
    { id: 106, name: 'Hitmonlee', type: 'Fighting', secondaryType: null, hp: 50, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/106.png' },
    { id: 107, name: 'Hitmonchan', type: 'Fighting', secondaryType: null, hp: 50, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/107.png' },
    { id: 108, name: 'Lickitung', type: 'Normal', secondaryType: null, hp: 90, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/108.png' },
    { id: 109, name: 'Koffing', type: 'Poison', secondaryType: null, hp: 40, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/109.png' },
    { id: 110, name: 'Weezing', type: 'Poison', secondaryType: null, hp: 65, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/110.png' },
    { id: 111, name: 'Rhyhorn', type: 'Ground', secondaryType: 'Rock', hp: 80, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/111.png' },
    { id: 112, name: 'Rhydon', type: 'Ground', secondaryType: 'Rock', hp: 105, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/112.png' },
    { id: 113, name: 'Chansey', type: 'Normal', secondaryType: null, hp: 250, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/113.png' },
    { id: 114, name: 'Tangela', type: 'Grass', secondaryType: null, hp: 65, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/114.png' },
    { id: 115, name: 'Kangaskhan', type: 'Normal', secondaryType: null, hp: 105, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/115.png' },
    { id: 116, name: 'Horsea', type: 'Water', secondaryType: null, hp: 30, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/116.png' },
    { id: 117, name: 'Seadra', type: 'Water', secondaryType: null, hp: 55, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/117.png' },
    { id: 118, name: 'Goldeen', type: 'Water', secondaryType: null, hp: 45, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/118.png' },
    { id: 119, name: 'Seaking', type: 'Water', secondaryType: null, hp: 80, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/119.png' },
    { id: 120, name: 'Staryu', type: 'Water', secondaryType: null, hp: 30, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/120.png' },
    { id: 121, name: 'Starmie', type: 'Water', secondaryType: 'Psychic', hp: 60, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/121.png' },
    { id: 122, name: 'Mr. Mime', type: 'Psychic', secondaryType: null, hp: 40, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/122.png' },
    { id: 123, name: 'Scyther', type: 'Bug', secondaryType: 'Flying', hp: 70, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/123.png' },
    { id: 124, name: 'Jynx', type: 'Ice', secondaryType: 'Psychic', hp: 65, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/124.png' },
    { id: 125, name: 'Electabuzz', type: 'Electric', secondaryType: null, hp: 65, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/125.png' },
    { id: 126, name: 'Magmar', type: 'Fire', secondaryType: null, hp: 65, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/126.png' },
    { id: 127, name: 'Pinsir', type: 'Bug', secondaryType: null, hp: 65, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/127.png' },
    { id: 128, name: 'Tauros', type: 'Normal', secondaryType: null, hp: 75, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/128.png' },
    { id: 129, name: 'Magikarp', type: 'Water', secondaryType: null, hp: 20, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/129.png' },
    { id: 130, name: 'Gyarados', type: 'Water', secondaryType: 'Flying', hp: 95, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/130.png' },
    { id: 131, name: 'Lapras', type: 'Water', secondaryType: 'Ice', hp: 130, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/131.png' },
    { id: 132, name: 'Ditto', type: 'Normal', secondaryType: null, hp: 48, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/132.png' },
    { id: 133, name: 'Eevee', type: 'Normal', secondaryType: null, hp: 55, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/133.png' },
    { id: 134, name: 'Vaporeon', type: 'Water', secondaryType: null, hp: 130, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/134.png' },
    { id: 135, name: 'Jolteon', type: 'Electric', secondaryType: null, hp: 65, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/135.png' },
    { id: 136, name: 'Flareon', type: 'Fire', secondaryType: null, hp: 65, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/136.png' },
    { id: 137, name: 'Porygon', type: 'Normal', secondaryType: null, hp: 65, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/137.png' },
    { id: 138, name: 'Omanyte', type: 'Rock', secondaryType: 'Water', hp: 35, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/138.png' },
    { id: 139, name: 'Omastar', type: 'Rock', secondaryType: 'Water', hp: 70, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/139.png' },
    { id: 140, name: 'Kabuto', type: 'Rock', secondaryType: 'Water', hp: 30, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/140.png' },
    { id: 141, name: 'Kabutops', type: 'Rock', secondaryType: 'Water', hp: 60, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/141.png' },
    { id: 142, name: 'Aerodactyl', type: 'Rock', secondaryType: 'Flying', hp: 80, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/142.png' },
    { id: 143, name: 'Snorlax', type: 'Normal', secondaryType: null, hp: 160, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/143.png' },
    { id: 144, name: 'Articuno', type: 'Ice', secondaryType: 'Flying', hp: 90, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/144.png' },
    { id: 145, name: 'Zapdos', type: 'Electric', secondaryType: 'Flying', hp: 90, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/145.png' },
    { id: 146, name: 'Moltres', type: 'Fire', secondaryType: 'Flying', hp: 90, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/146.png' },
    { id: 147, name: 'Dratini', type: 'Dragon', secondaryType: null, hp: 41, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/147.png' },
    { id: 148, name: 'Dragonair', type: 'Dragon', secondaryType: null, hp: 61, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/148.png' },
    { id: 149, name: 'Dragonite', type: 'Dragon', secondaryType: 'Flying', hp: 91, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/149.png' },
    { id: 150, name: 'Mewtwo', type: 'Psychic', secondaryType: null, hp: 106, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png' },
    { id: 151, name: 'Mew', type: 'Psychic', secondaryType: null, hp: 100, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/151.png' }
  ];

  const [playerTeam, setPlayerTeam] = useState([]);
  const [opponentTeam, setOpponentTeam] = useState([]);
  const [playerActivePokemon, setPlayerActivePokemon] = useState(null);
  const [opponentActivePokemon, setOpponentActivePokemon] = useState(null);
  const [battleLog, setBattleLog] = useState([]);
  const [gameState, setGameState] = useState('selecting');
  const [selectedMove, setSelectedMove] = useState(null);
  const [gameMode, setGameMode] = useState('singleplayer');
  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [multiplayerStatus, setMultiplayerStatus] = useState('disconnected');
  const [teamSize, setTeamSize] = useState(6);
  const [showAllPokemon, setShowAllPokemon] = useState(false);
  const [chatMessage, setChatMessage] = useState('');

  useEffect(() => {
    if (gameMode === 'singleplayer') {
      generateRandomTeams();
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [gameMode]);

  useEffect(() => {
    if (battleLogRef.current) {
      battleLogRef.current.scrollTop = battleLogRef.current.scrollHeight;
    }
  }, [battleLog]);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [battleLog]);

  const typeChart = {
    'Bug': { 'Fighting': 0.5, 'Flying': 0.5, 'Poison': 0.5, 'Ghost': 0.5, 'Fire': 0.5, 'Grass': 2, 'Psychic': 2, 'Normal': 1, 'Ground': 1, 'Rock': 1, 'Ice': 1, 'Dragon': 1, 'Water': 1, 'Electric': 1 },
    'Dragon': { 'Dragon': 2, 'Normal': 1, 'Fighting': 1, 'Flying': 1, 'Poison': 1, 'Ground': 1, 'Rock': 1, 'Bug': 1, 'Ghost': 1, 'Fire': 1, 'Water': 1, 'Grass': 1, 'Electric': 1, 'Psychic': 1, 'Ice': 1 },
    'Electric': { 'Flying': 2, 'Water': 2, 'Dragon': 0.5, 'Electric': 0.5, 'Grass': 0.5, 'Ground': 0, 'Normal': 1, 'Fighting': 1, 'Poison': 1, 'Rock': 1, 'Bug': 1, 'Ghost': 1, 'Fire': 1, 'Psychic': 1, 'Ice': 1 },
    'Fighting': { 'Normal': 2, 'Ice': 2, 'Rock': 2, 'Flying': 0.5, 'Poison': 0.5, 'Bug': 0.5, 'Psychic': 0.5, 'Ghost': 0, 'Ground': 1, 'Fire': 1, 'Water': 1, 'Grass': 1, 'Electric': 1, 'Dragon': 1 },
    'Fire': { 'Bug': 2, 'Grass': 2, 'Ice': 2, 'Dragon': 0.5, 'Fire': 0.5, 'Water': 0.5, 'Rock': 0.5, 'Normal': 1, 'Fighting': 1, 'Flying': 1, 'Poison': 1, 'Ground': 1, 'Ghost': 1, 'Electric': 1, 'Psychic': 1 },
    'Flying': { 'Fighting': 2, 'Bug': 2, 'Grass': 2, 'Electric': 0.5, 'Rock': 0.5, 'Normal': 1, 'Poison': 1, 'Ground': 1, 'Ghost': 1, 'Fire': 1, 'Water': 1, 'Electric': 1, 'Psychic': 1, 'Ice': 1, 'Dragon': 1 },
    'Ghost': { 'Ghost': 2, 'Psychic': 2, 'Normal': 0, 'Fighting': 0, 'Poison': 1, 'Ground': 1, 'Rock': 1, 'Bug': 1, 'Fire': 1, 'Water': 1, 'Grass': 1, 'Electric': 1, 'Ice': 1, 'Dragon': 1, 'Flying': 1 },
    'Grass': { 'Ground': 2, 'Rock': 2, 'Water': 2, 'Flying': 0.5, 'Poison': 0.5, 'Bug': 0.5, 'Fire': 0.5, 'Grass': 0.5, 'Dragon': 0.5, 'Normal': 1, 'Fighting': 1, 'Ghost': 1, 'Electric': 1, 'Psychic': 1, 'Ice': 1 },
    'Ground': { 'Poison': 2, 'Rock': 2, 'Fire': 2, 'Electric': 2, 'Bug': 0.5, 'Grass': 0.5, 'Flying': 0, 'Normal': 1, 'Fighting': 1, 'Ground': 1, 'Ghost': 1, 'Water': 1, 'Psychic': 1, 'Ice': 1, 'Dragon': 1 },
    'Ice': { 'Flying': 2, 'Ground': 2, 'Grass': 2, 'Dragon': 2, 'Fire': 0.5, 'Water': 0.5, 'Ice': 0.5, 'Normal': 1, 'Fighting': 1, 'Poison': 1, 'Rock': 1, 'Bug': 1, 'Ghost': 1, 'Electric': 1, 'Psychic': 1 },
    'Normal': { 'Ghost': 0, 'Fighting': 1, 'Flying': 1, 'Poison': 1, 'Ground': 1, 'Rock': 1, 'Bug': 1, 'Fire': 1, 'Water': 1, 'Grass': 1, 'Electric': 1, 'Psychic': 1, 'Ice': 1, 'Dragon': 1 },
    'Poison': { 'Grass': 2, 'Poison': 0.5, 'Ground': 0.5, 'Rock': 0.5, 'Bug': 1, 'Ghost': 0.5, 'Normal': 1, 'Fighting': 1, 'Flying': 1, 'Fire': 1, 'Water': 1, 'Electric': 1, 'Psychic': 1, 'Ice': 1, 'Dragon': 1 },
    'Psychic': { 'Fighting': 2, 'Poison': 2, 'Psychic': 0.5, 'Normal': 1, 'Flying': 1, 'Ground': 1, 'Rock': 1, 'Bug': 1, 'Ghost': 1, 'Fire': 1, 'Water': 1, 'Grass': 1, 'Electric': 1, 'Ice': 1, 'Dragon': 1 },
    'Rock': { 'Flying': 2, 'Bug': 2, 'Fire': 2, 'Ice': 2, 'Fighting': 0.5, 'Ground': 0.5, 'Normal': 1, 'Poison': 1, 'Ghost': 1, 'Water': 1, 'Grass': 1, 'Electric': 1, 'Psychic': 1, 'Dragon': 1 },
    'Water': { 'Ground': 2, 'Rock': 2, 'Fire': 2, 'Water': 0.5, 'Grass': 0.5, 'Dragon': 0.5, 'Normal': 1, 'Fighting': 1, 'Flying': 1, 'Poison': 1, 'Bug': 1, 'Ghost': 1, 'Electric': 1, 'Psychic': 1, 'Ice': 1 }
  };

  const generateRandomTeams = () => {
    const shuffledPokemon = [...originalPokemonList].sort(() => 0.5 - Math.random());
    const playerPokemonTeam = shuffledPokemon.slice(0, teamSize).map(pokemon => ({
      ...pokemon,
      currentHp: pokemon.hp,
      moves: generateMoves(pokemon.type, pokemon.secondaryType)
    }));
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

  const generateMoves = (primaryType, secondaryType) => {
    const movesByType = {
      'Bug': [{ name: 'String Shot', power: 10, type: 'Bug' }, { name: 'Leech Life', power: 20, type: 'Bug' }, { name: 'Pin Missile', power: 25, type: 'Bug' }],
      'Dragon': [{ name: 'Dragon Rage', power: 15, type: 'Dragon' }, { name: 'Outrage', power: 25, type: 'Dragon' }, { name: 'Draco Meteor', power: 30, type: 'Dragon' }],
      'Electric': [{ name: 'Thunder Shock', power: 15, type: 'Electric' }, { name: 'Thunderbolt', power: 20, type: 'Electric' }, { name: 'Thunder', power: 25, type: 'Electric' }],
      'Fighting': [{ name: 'Karate Chop', power: 15, type: 'Fighting' }, { name: 'Submission', power: 20, type: 'Fighting' }, { name: 'Hi Jump Kick', power: 25, type: 'Fighting' }],
      'Fire': [{ name: 'Ember', power: 15, type: 'Fire' }, { name: 'Flamethrower', power: 20, type: 'Fire' }, { name: 'Fire Blast', power: 25, type: 'Fire' }],
      'Flying': [{ name: 'Gust', power: 15, type: 'Flying' }, { name: 'Wing Attack', power: 20, type: 'Flying' }, { name: 'Sky Attack', power: 25, type: 'Flying' }],
      'Ghost': [{ name: 'Lick', power: 15, type: 'Ghost' }, { name: 'Shadow Ball', power: 20, type: 'Ghost' }, { name: 'Shadow Claw', power: 25, type: 'Ghost' }],
      'Grass': [{ name: 'Vine Whip', power: 15, type: 'Grass' }, { name: 'Razor Leaf', power: 20, type: 'Grass' }, { name: 'Solar Beam', power: 25, type: 'Grass' }],
      'Ground': [{ name: 'Mud Shot', power: 15, type: 'Ground' }, { name: 'Earthquake', power: 20, type: 'Ground' }, { name: 'Fissure', power: 25, type: 'Ground' }],
      'Ice': [{ name: 'Ice Shard', power: 15, type: 'Ice' }, { name: 'Ice Beam', power: 20, type: 'Ice' }, { name: 'Blizzard', power: 25, type: 'Ice' }],
      'Normal': [{ name: 'Tackle', power: 15, type: 'Normal' }, { name: 'Quick Attack', power: 20, type: 'Normal' }, { name: 'Hyper Beam', power: 25, type: 'Normal' }],
      'Poison': [{ name: 'Poison Sting', power: 15, type: 'Poison' }, { name: 'Sludge', power: 20, type: 'Poison' }, { name: 'Acid', power: 25, type: 'Poison' }],
      'Psychic': [{ name: 'Confusion', power: 15, type: 'Psychic' }, { name: 'Psychic', power: 20, type: 'Psychic' }, { name: 'Psybeam', power: 25, type: 'Psychic' }],
      'Rock': [{ name: 'Rock Throw', power: 15, type: 'Rock' }, { name: 'Rock Slide', power: 20, type: 'Rock' }, { name: 'Stone Edge', power: 25, type: 'Rock' }],
      'Water': [{ name: 'Water Gun', power: 15, type: 'Water' }, { name: 'Bubble Beam', power: 20, type: 'Water' }, { name: 'Hydro Pump', power: 25, type: 'Water' }]
    };
    const primaryMoves = movesByType[primaryType] || movesByType['Normal'];
    let secondaryMove = null;
    if (secondaryType && movesByType[secondaryType]) {
      const secondaryMoves = movesByType[secondaryType];
      secondaryMove = secondaryMoves[Math.floor(Math.random() * secondaryMoves.length)];
    }
    let moveList = [...primaryMoves];
    if (secondaryMove) moveList[Math.floor(Math.random() * moveList.length)] = secondaryMove;
    if (moveList.length < 4) moveList.push({ name: 'Tackle', power: 10, type: 'Normal' });
    return moveList;
  };

  const getTypeEffectiveness = (moveType, defenderType, defenderSecondaryType) => {
    let effectiveness = typeChart[moveType]?.[defenderType] ?? 1;
    if (defenderSecondaryType) {
      const secondaryEffectiveness = typeChart[moveType]?.[defenderSecondaryType] ?? 1;
      effectiveness *= secondaryEffectiveness;
    }
    return effectiveness;
  };

  const startBattle = () => {
    setBattleLog([
      'Battle started!',
      `Go ${playerActivePokemon.name}!`,
      `Opponent sent out ${opponentActivePokemon.name}!`
    ]);
    setGameState('playerTurn');
  };

  const initializeSocket = () => {
    if (!socketRef.current) {
      socketRef.current = io('YOUR_SERVER_URL', { path: '/api/socket' }); // Replace with your deployed server URL
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

  const createMultiplayerRoom = () => {
    if (!playerName.trim()) {
      setBattleLog([...battleLog, 'Please enter your name first!']);
      return;
    }
    initializeSocket();
    socketRef.current.emit('create_room', { name: playerName });
  };

  const joinMultiplayerRoom = () => {
    if (!playerName.trim() || !roomCode) {
      setBattleLog([...battleLog, 'Please enter your name and a room code!']);
      return;
    }
    initializeSocket();
    socketRef.current.emit('join_room', {
      roomId: roomCode,
      playerData: { name: playerName }
    });
  };

  const sendChatMessage = () => {
    if (!chatMessage.trim() || !socketRef.current || multiplayerStatus !== 'connected') return;
    socketRef.current.emit('battle_action', {
      roomId: roomCode,
      action: { type: 'chat', sender: playerName, message: chatMessage }
    });
    setBattleLog([...battleLog, `${playerName}: ${chatMessage}`]);
    setChatMessage('');
  };

  const handleOpponentAction = (action) => {
    if (action.type === 'attack') {
      const move = action.move;
      const effectiveness = getTypeEffectiveness(move.type, playerActivePokemon.type, playerActivePokemon.secondaryType);
      const baseDamage = move.power;
      const damage = Math.floor(baseDamage * effectiveness * action.randomFactor);
      const newHp = Math.max(0, playerActivePokemon.currentHp - damage);
      const updatedPlayer = { ...playerActivePokemon, currentHp: newHp };
      setPlayerActivePokemon(updatedPlayer);
      setPlayerTeam(prev => prev.map(pokemon => pokemon.id === playerActivePokemon.id ? updatedPlayer : pokemon));
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
      if (switchedPokemon) setOpponentActivePokemon(switchedPokemon);
      setGameState('playerTurn');
    } else if (action.type === 'chat') {
      addToLog(`${action.sender}: ${action.message}`);
    }
  };

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
      socketRef.current.emit('team_selected', { roomId: roomCode, team: playerPokemonTeam });
    }
  };

  const getFilteredPokemon = () => {
    return originalPokemonList.filter(pokemon => {
      const matchesType = filterType === 'All' || pokemon.type === filterType || pokemon.secondaryType === filterType;
      const matchesSearch = pokemon.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesType && matchesSearch;
    });
  };

  const addToLog = (message) => {
    setBattleLog(prev => [...prev, message]);
  };

  const handlePlayerAttack = (moveIndex) => {
    if (gameState !== 'playerTurn') return;
    setSelectedMove(moveIndex);
    const move = playerActivePokemon.moves[moveIndex];
    const effectiveness = getTypeEffectiveness(move.type, opponentActivePokemon.type, opponentActivePokemon.secondaryType);
    const baseDamage = move.power;
    const randomFactor = 0.85 + Math.random() * 0.3;
    const damage = Math.floor(baseDamage * effectiveness * randomFactor);
    let effectivenessMessage = effectiveness > 1 ? "It's super effective!" :
                              effectiveness < 1 && effectiveness > 0 ? "It's not very effective..." :
                              effectiveness === 0 ? "It has no effect!" : "";
    const newHp = Math.max(0, opponentActivePokemon.currentHp - damage);
    const updatedOpponent = { ...opponentActivePokemon, currentHp: newHp };
    setOpponentActivePokemon(updatedOpponent);
    setOpponentTeam(prev => prev.map(pokemon => pokemon.id === opponentActivePokemon.id ? updatedOpponent : pokemon));
    addToLog(`${playerActivePokemon.name} used ${move.name}!`);
    if (damage > 0) addToLog(`Dealt ${damage} damage! ${effectivenessMessage}`);
    if (gameMode === 'multiplayer' && multiplayerStatus === 'connected' && socketRef.current) {
      socketRef.current.emit('battle_action', {
        roomId: roomCode,
        action: { type: 'attack', pokemonName: playerActivePokemon.name, move, randomFactor }
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
        setTimeout(() => handleOpponentAttack(), 1500);
      }
    }
  };

  const handleOpponentAttack = () => {
    const moveIndex = Math.floor(Math.random() * opponentActivePokemon.moves.length);
    const move = opponentActivePokemon.moves[moveIndex];
    const effectiveness = getTypeEffectiveness(move.type, playerActivePokemon.type, playerActivePokemon.secondaryType);
    const baseDamage = move.power;
    const randomFactor = 0.85 + Math.random() * 0.3;
    const damage = Math.floor(baseDamage * effectiveness * randomFactor);
    let effectivenessMessage = effectiveness > 1 ? "It's super effective!" :
                              effectiveness < 1 && effectiveness > 0 ? "It's not very effective..." :
                              effectiveness === 0 ? "It has no effect!" : "";
    const newHp = Math.max(0, playerActivePokemon.currentHp - damage);
    const updatedPlayer = { ...playerActivePokemon, currentHp: newHp };
    setPlayerActivePokemon(updatedPlayer);
    setPlayerTeam(prev => prev.map(pokemon => pokemon.id === playerActivePokemon.id ? updatedPlayer : pokemon));
    addToLog(`${opponentActivePokemon.name} used ${move.name}!`);
    if (damage > 0) addToLog(`Dealt ${damage} damage! ${effectivenessMessage}`);
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

  const switchPokemon = (pokemon) => {
    if (gameState !== 'switching' && gameState !== 'playerTurn') return;
    if (pokemon.id === playerActivePokemon.id || pokemon.currentHp <= 0) return;
    setPlayerActivePokemon(pokemon);
    addToLog(`You switched to ${pokemon.name}!`);
    if (gameMode === 'multiplayer' && multiplayerStatus === 'connected' && socketRef.current) {
      socketRef.current.emit('battle_action', {
        roomId: roomCode,
        action: { type: 'switch', pokemonId: pokemon.id, pokemonName: pokemon.name }
      });
    }
    if (gameState === 'playerTurn') {
      setGameState('opponentTurn');
      if (gameMode === 'singleplayer') {
        setTimeout(() => handleOpponentAttack(), 1500);
      }
    } else {
      setGameState('playerTurn');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 via-green-100 to-yellow-100 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl p-8 border-8 border-poke-red relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="w-64 h-64 bg-poke-red rounded-full absolute -top-32 -left-32 border-8 border-white"></div>
          <div className="w-64 h-64 bg-poke-red rounded-full absolute -bottom-32 -right-32 border-8 border-white"></div>
        </div>

        <div className="mb-8 text-center relative z-10">
          <h1 className="text-5xl font-extrabold text-poke-red mb-3 drop-shadow-lg">Pokémon Battle Simulator</h1>
          <p className="text-xl text-gray-700 font-semibold tracking-wide">Unleash the Power of the Original 151!</p>
          <div className="mt-6 flex justify-center gap-6">
            <button
              className={`px-8 py-3 rounded-full font-bold text-xl transition-all duration-300 shadow-lg ${gameMode === 'singleplayer' ? 'bg-poke-blue text-white border-4 border-poke-yellow transform scale-105' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
              onClick={() => {
                setGameMode('singleplayer');
                setMultiplayerStatus('disconnected');
                setRoomCode('');
                setPlayerName('');
                setOpponentTeam([]);
                setOpponentActivePokemon(null);
                if (socketRef.current) socketRef.current.disconnect();
              }}
            >
              Single Player
            </button>
            <button
              className={`px-8 py-3 rounded-full font-bold text-xl transition-all duration-300 shadow-lg ${gameMode === 'multiplayer' ? 'bg-poke-blue text-white border-4 border-poke-yellow transform scale-105' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
              onClick={() => setGameMode('multiplayer')}
            >
              Multiplayer
            </button>
          </div>
        </div>

        {gameMode === 'multiplayer' && gameState === 'selecting' && multiplayerStatus === 'disconnected' && (
          <div className="mb-10 p-8 bg-gray-50 rounded-xl shadow-inner border-4 border-poke-blue relative z-10">
            <h2 className="text-3xl font-bold text-poke-blue mb-6 drop-shadow-md">Multiplayer Arena</h2>
            <div className="mb-6">
              <label className="block mb-2 text-xl text-gray-800 font-semibold">Trainer Name:</label>
              <input
                type="text"
                className="w-full p-4 border-2 border-poke-yellow rounded-lg focus:outline-none focus:ring-4 focus:ring-poke-blue bg-white text-gray-800 text-lg shadow-md"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your trainer name"
              />
            </div>
            <div className="flex space-x-6">
              <button
                className="bg-poke-green hover:bg-green-700 text-white px-8 py-3 rounded-full font-bold text-xl transition-all duration-300 shadow-lg border-2 border-poke-yellow"
                onClick={createMultiplayerRoom}
              >
                Create Room
              </button>
              <input
                type="text"
                className="flex-1 p-4 border-2 border-poke-yellow rounded-lg focus:outline-none focus:ring-4 focus:ring-poke-blue bg-white text-gray-800 text-lg shadow-md"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                placeholder="Enter room code"
              />
              <button
                className="bg-poke-purple hover:bg-purple-700 text-white px-8 py-3 rounded-full font-bold text-xl transition-all duration-300 shadow-lg border-2 border-poke-yellow disabled:opacity-50"
                disabled={!roomCode}
                onClick={joinMultiplayerRoom}
              >
                Join Room
              </button>
            </div>
          </div>
        )}

        {showAllPokemon && (
          <div className="mb-10 p-8 bg-white rounded-xl shadow-lg border-4 border-poke-yellow relative z-10">
            <h2 className="text-3xl font-bold text-poke-yellow mb-6 drop-shadow-md">Assemble Your Team</h2>
            <p className="text-lg text-gray-700 mb-6 font-semibold">Pick {teamSize} Pokémon to dominate the battlefield!</p>
            <div className="flex mb-8 gap-6">
              <div className="flex-1">
                <label className="block mb-2 text-xl text-gray-800 font-semibold">Filter by Type:</label>
                <select
                  className="w-full p-4 border-2 border-poke-yellow rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-4 focus:ring-poke-blue text-lg shadow-md"
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
                <label className="block mb-2 text-xl text-gray-800 font-semibold">Search:</label>
                <input
                  type="text"
                  className="w-full p-4 border-2 border-poke-yellow rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-4 focus:ring-poke-blue text-lg shadow-md"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search Pokémon"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 mb-8 max-h-96 overflow-y-auto">
              {getFilteredPokemon().map((pokemon) => (
                <div
                  key={pokemon.id}
                  className={`flex flex-col items-center p-4 rounded-xl cursor-pointer transition-all duration-300 border-4 ${playerTeam.some(p => p.id === pokemon.id) ? 'bg-blue-100 border-poke-blue shadow-xl' : 'bg-gray-50 border-gray-300 hover:bg-gray-100 hover:shadow-xl'}`}
                  onClick={() => {
                    if (playerTeam.some(p => p.id === pokemon.id)) {
                      setPlayerTeam(playerTeam.filter(p => p.id !== pokemon.id));
                    } else if (playerTeam.length < teamSize) {
                      setPlayerTeam([...playerTeam, pokemon]);
                    }
                  }}
                >
                  <img src={pokemon.sprite} alt={pokemon.name} className="w-20 h-20 mb-2 pixelated" />
                  <div className="font-bold text-xl text-poke-blue">{pokemon.name}</div>
                  <div className="text-sm text-gray-600">{pokemon.type}{pokemon.secondaryType && `/${pokemon.secondaryType}`}</div>
                  <div className="text-sm text-gray-600">HP: {pokemon.hp}</div>
                </div>
              ))}
            </div>
            <h3 className="font-bold text-2xl text-poke-blue mb-4 drop-shadow-md">Selected Team ({playerTeam.length}/{teamSize}):</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 mb-8">
              {playerTeam.map((pokemon) => (
                <div key={pokemon.id} className="flex flex-col items-center bg-blue-100 p-4 rounded-xl shadow-lg border-4 border-poke-blue">
                  <img src={pokemon.sprite} alt={pokemon.name} className="w-16 h-16 mb-2 pixelated" />
                  <div className="font-bold text-lg text-poke-blue">{pokemon.name}</div>
                  <div className="text-sm text-gray-600">{pokemon.type}{pokemon.secondaryType && `/${pokemon.secondaryType}`}</div>
                  <button
                    className="mt-2 text-sm bg-poke-red hover:bg-red-700 text-white px-4 py-1 rounded-full transition-all duration-300 shadow-md"
                    onClick={() => setPlayerTeam(playerTeam.filter(p => p.id !== pokemon.id))}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <div className="flex space-x-6 justify-center">
              <button
                className="bg-poke-green hover:bg-green-700 text-white px-8 py-3 rounded-full font-bold text-xl transition-all duration-300 shadow-lg border-2 border-poke-yellow disabled:opacity-50"
                onClick={() => createCustomTeam(playerTeam)}
                disabled={playerTeam.length !== teamSize}
              >
                Confirm Team
              </button>
              <button
                className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-full font-bold text-xl transition-all duration-300 shadow-lg border-2 border-poke-yellow"
                onClick={() => setShowAllPokemon(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {gameState === 'selecting' && !showAllPokemon && (
          <div className="mb-10 relative z-10">
            <h2 className="text-3xl font-bold text-poke-blue mb-6 drop-shadow-md">Your Team</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 mb-8">
              {playerTeam.map((pokemon) => (
                <div key={pokemon.id} className="flex flex-col items-center bg-white p-4 rounded-xl shadow-lg border-4 border-poke-blue transition-all duration-300 hover:shadow-xl">
                  <img src={pokemon.sprite} alt={pokemon.name} className="w-20 h-20 mb-2 pixelated" />
                  <div className="font-bold text-xl text-poke-blue">{pokemon.name}</div>
                  <div className="text-sm text-gray-600">{pokemon.type}{pokemon.secondaryType && `/${pokemon.secondaryType}`}</div>
                  <div className="text-sm text-gray-600">HP: {pokemon.hp}</div>
                </div>
              ))}
            </div>
            <h2 className="text-3xl font-bold text-poke-red mb-6 drop-shadow-md">Opponent's Team</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 mb-8">
              {opponentTeam.map((pokemon) => (
                <div key={pokemon.id} className="flex flex-col items-center bg-white p-4 rounded-xl shadow-lg border-4 border-poke-red transition-all duration-300 hover:shadow-xl">
                  <img src={pokemon.sprite} alt={pokemon.name} className="w-20 h-20 mb-2 pixelated" />
                  <div className="font-bold text-xl text-poke-red">{pokemon.name}</div>
                  <div className="text-sm text-gray-600">{pokemon.type}{pokemon.secondaryType && `/${pokemon.secondaryType}`}</div>
                  <div className="text-sm text-gray-600">HP: {pokemon.hp}</div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-6 mt-6 justify-center">
              <button
                className="bg-poke-yellow hover:bg-yellow-500 text-black font-bold px-10 py-4 rounded-full border-4 border-poke-red shadow-lg transform transition-all duration-300 hover:scale-105"
                onClick={startBattle}
                disabled={!playerTeam.length || !opponentTeam.length}
              >
                Start Battle
              </button>
              <button
                className="bg-poke-green hover:bg-green-700 text-white font-bold px-10 py-4 rounded-full border-4 border-poke-yellow shadow-lg transform

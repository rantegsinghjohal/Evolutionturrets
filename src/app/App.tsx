import { useState } from 'react';
import { MainMenu } from './components/MainMenu';
import { HowToPlay } from './components/HowToPlay';
import { Game } from './components/Game';
import { GameScreen } from './types/game';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('menu');
  
  return (
    <div className="size-full">
      {currentScreen === 'menu' && (
        <MainMenu
          onPlay={() => setCurrentScreen('game')}
          onHowToPlay={() => setCurrentScreen('howToPlay')}
        />
      )}
      
      {currentScreen === 'howToPlay' && (
        <HowToPlay onBack={() => setCurrentScreen('menu')} />
      )}
      
      {currentScreen === 'game' && (
        <Game onMainMenu={() => setCurrentScreen('menu')} />
      )}
    </div>
  );
}

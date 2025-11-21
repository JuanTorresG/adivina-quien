import { Board } from './components/Board';
import { Chat } from './components/Chat';
import { breeds } from "./data/breeds";
import { useChat } from './hooks/useChat';

const App = () => {
  const { currentQuestion, gamePhase, handleUserAnswer, isCpuThinking, messages, restartGame, onGuestAnswer, possibleBreeds } = useChat({ initialBreeds: breeds });

  return (
    <div className='min-h-screen bg-slate-100 col-end-1 col-span-12 row-end-7 row-span-7 grid grid-cols-10 gap-4 p-4'>
      <div className='col-span-10 md:col-span-7'>
        <Board breeds={possibleBreeds} />
      </div>
      <div className='col-span-10 md:col-span-3'>
        <Chat
          currentQuestion={currentQuestion}
          gamePhase={gamePhase}
          handleUserAnswer={handleUserAnswer}
          isCpuThinking={isCpuThinking}
          messages={messages}
          restartGame={restartGame}
          onGuestAnswer={onGuestAnswer}
        />
      </div>
    </div >
  );
};
export default App;
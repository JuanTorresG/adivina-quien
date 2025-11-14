import { useChat } from '../hooks/useChat';

export const Chat = () => {
    const { currentQuestion, gamePhase, handleUserAnswer, isCpuThinking, messages, restartGame, onGuestAnswer } = useChat();

    return (
        <div className="flex flex-col h-full bg-white/30 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg overflow-hidden">
            <div className="p-4 border-b border-white/50">
                <h2 className="text-xl font-bold text-slate-800 text-center">Adivina quien</h2>
            </div>

            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                {messages.map(m => (
                    <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md rounded-lg p-3 shadow ${m.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-white text-gray-800'}`}>
                            <p className="text-sm" dangerouslySetInnerHTML={{ __html: m.text.replaceAll(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                        </div>
                    </div>
                ))}

                {isCpuThinking && (
                    <div className="flex justify-start">
                        <div className="max-w-xs lg:max-w-md bg-white text-gray-800 rounded-lg p-3 shadow">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:0.2s]" />
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:0.4s]" />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-4 bg-white/20 border-t border-white/50">
                {gamePhase === 'over' && (
                    <button onClick={restartGame} className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow">Jugar de Nuevo</button>
                )}

                {gamePhase === 'guessing' && (
                    <div className="space-y-2">
                        <div className="text-center text-sm text-gray-700">¿Adiviné correctamente?</div>
                        <div className="grid grid-cols-2 gap-2">
                            <button onClick={() => onGuestAnswer(true)} className="px-4 py-2 bg-green-500 text-white rounded-lg">Sí</button>
                            <button onClick={() => onGuestAnswer(false)} className="px-4 py-2 bg-red-500 text-white rounded-lg">No</button>
                        </div>
                    </div>
                )}

                {currentQuestion && gamePhase === 'playing' && (
                    <div className="space-y-2">
                        {currentQuestion.type === 'YES_NO' && (
                            <div className="grid grid-cols-2 gap-2">
                                <button onClick={() => handleUserAnswer(currentQuestion, true)} className="px-4 py-2 bg-green-500 text-white rounded-lg">Sí</button>
                                <button onClick={() => handleUserAnswer(currentQuestion, false)} className="px-4 py-2 bg-red-500 text-white rounded-lg">No</button>
                            </div>
                        )}

                        {currentQuestion.type === 'CHOICE' && currentQuestion.options && (
                            <div className={`grid grid-cols-${Math.min(currentQuestion.options.length, 3)} gap-2`}>
                                {currentQuestion.options.map(opt => (
                                    <button key={opt.value} onClick={() => handleUserAnswer(currentQuestion, opt.value)} className="px-4 py-2 bg-white text-slate-800 rounded-lg">{opt.text}</button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chat;
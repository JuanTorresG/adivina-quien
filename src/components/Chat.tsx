import { useEffect, useRef, useMemo } from "react";
import type { GamePhase, Message, Question } from "../types";

interface Props {
    currentQuestion: Question | null;
    gamePhase: GamePhase;
    handleUserAnswer: (question: Question, value: boolean | string) => Promise<void>;
    isCpuThinking: boolean;
    messages: Message[];
    restartGame: () => void;
    onGuestAnswer: (value: boolean) => void;
}

export const Chat = (props: Props) => {
    const { currentQuestion, gamePhase, handleUserAnswer, isCpuThinking, messages, restartGame, onGuestAnswer } = props;

    const messagesRef = useRef<HTMLDivElement | null>(null);
    const endRef = useRef<HTMLDivElement | null>(null);

    const choiceCols = useMemo(() => {
        const count = currentQuestion?.options?.length ?? 0;
        const cols = Math.min(Math.max(count, 1), 3);
        return cols === 1 ? "grid-cols-1" : cols === 2 ? "grid-cols-2" : "grid-cols-3";
    }, [currentQuestion]);

    useEffect(() => {
        if (endRef.current) {
            try {
                endRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
            } catch {
                if (messagesRef.current) {
                    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
                }
            }
        } else if (messagesRef.current) {
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        }
    }, [messages.length, isCpuThinking]);

    return (
        <div className="flex flex-col h-4/5 bg-white/30 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg overflow-hidden">
            <div className="p-4 border-b border-white/50">
                <h2 className="text-xl font-bold text-slate-800 text-center">Adivina quien</h2>
            </div>
            <div
                ref={messagesRef}
                className="flex-1 p-4 space-y-4 overflow-y-auto"
                role="log"
                aria-live="polite"
            >
                {messages.map(m => (
                    <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div
                            className={`max-w-xs lg:max-w-md rounded-lg p-3 shadow ${m.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-white text-gray-800'}`}
                        >
                            <p
                                className="text-sm"
                                dangerouslySetInnerHTML={{
                                    __html: String(m.text).replaceAll(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                                }}
                            />
                        </div>
                    </div>
                ))}

                {isCpuThinking && (
                    <div className="flex justify-start">
                        <div className="max-w-xs lg:max-w-md bg-white text-gray-800 rounded-lg p-3 shadow">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: "0.15s" }} />
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: "0.3s" }} />
                            </div>
                        </div>
                    </div>
                )}
                <div ref={endRef} />
            </div>

            <div className="p-4 bg-white/20 border-t border-white/50">
                {gamePhase === 'over' && (
                    <button onClick={restartGame} className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow">
                        Jugar de Nuevo
                    </button>
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
                        {currentQuestion.type === 'YESNO' && (
                            <div className="grid grid-cols-2 gap-2">
                                <button onClick={() => handleUserAnswer(currentQuestion, true)} className="px-4 py-2 bg-green-500 text-white rounded-lg">Sí</button>
                                <button onClick={() => handleUserAnswer(currentQuestion, false)} className="px-4 py-2 bg-red-500 text-white rounded-lg">No</button>
                            </div>
                        )}

                        {currentQuestion.type === 'CHOICE' && currentQuestion.options && (
                            <div className={`grid ${choiceCols} gap-2`}>
                                {currentQuestion.options.map(opt => (
                                    <button
                                        key={opt.value}
                                        onClick={() => handleUserAnswer(currentQuestion, opt.value)}
                                        className="px-4 py-2 bg-white text-slate-800 rounded-lg"
                                        aria-label={opt.text}
                                    >
                                        {opt.text}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
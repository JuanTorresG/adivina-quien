// tests/useChat.simulation.spec.ts
import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';

import { breeds } from '../data/breeds';
import type { Breed, Question } from '../types';
import { useChat } from '../hooks/useChat';
import { questions } from '../data/questions';

// Aumenta el timeout de Vitest si el motor de reglas es lento
vi.setConfig({ testTimeout: 30000 });

// Re-usa deriveAnswer (idéntico al de la otra prueba)
const deriveAnswer = (breed: any, factKey: string) => {
    switch (factKey) {
        case 'answer_categoria':
            return breed.categoria;
        case 'answer_size': {
            const s: string = (breed.size ?? '').toString().toLowerCase();
            if (s.includes('pequeño')) return 'pequeño';
            if (s.includes('mediano')) return 'mediano';
            if (s.includes('grande') || s.includes('gigante') || s.includes('muy grande')) return 'grande';
            return s || 'desconocido';
        }
        case 'answer_hipoalergenico':
            return Boolean(breed.hipoalergenico);
        case 'answer_high_energy':
            return typeof breed.nivel_energia === 'number' ? breed.nivel_energia >= 4 : false;
        case 'answer_needs_exercise':
            return typeof breed.necesidad_ejercicio === 'number' ? breed.necesidad_ejercicio >= 4 : false;
        case 'answer_bueno_con_ninos':
            return typeof breed.bueno_con_ninos === 'number' ? breed.bueno_con_ninos >= 4 : false;
        case 'answer_acepta_otras_mascotas':
            return typeof breed.buen_con_otras_mascotas === 'number' ? breed.buen_con_otras_mascotas >= 4 : false;
        case 'answer_tolerancia_soledad':
            return typeof breed.tolerancia_soledad === 'number' ? breed.tolerancia_soledad >= 3 : false;
        case 'answer_sheds':
            return typeof breed.muda === 'number' ? breed.muda >= 4 : false;
        case 'answer_high_grooming':
            return typeof breed.aseo === 'number' ? breed.aseo >= 4 : false;
        case 'answer_vocal': {
            const vocalVal = (breed.vocalizacion ?? breed.ladrido ?? 0) as number;
            return vocalVal >= 4;
        }
        case 'answer_playful':
            return typeof breed.jugueton === 'number' ? breed.jugueton >= 4 : false;
        case 'answer_intelligent':
            return typeof breed.inteligencia === 'number' ? breed.inteligencia >= 4 : false;
        case 'answer_barks':
            return typeof breed.ladrido === 'number' ? breed.ladrido >= 4 : false;
        case 'answer_trainable':
            return typeof breed.adiestramiento === 'number' ? breed.adiestramiento >= 4 : false;
        case 'answer_has_predisposition':
            return Array.isArray(breed.predisposiciones_salud) && breed.predisposiciones_salud.length > 0;
        case 'answer_predisposition_name':
            return Array.isArray(breed.predisposiciones_salud) && breed.predisposiciones_salud.length > 0
                ? String(breed.predisposiciones_salud[0])
                : '';
        case 'answer_rasgos_fisicos': {
            const r = (breed.rasgos_fisicos ?? '').toString().toLowerCase();
            if (r.includes('guantes')) return 'guantes_blancos';
            if (r.includes('ticking') || r.includes('aguti') || r.includes('agutí')) return 'ticked_aguti';
            if (r.includes('sin pelo') || r.includes('sin pelo aparente') || breed.name?.toLowerCase() === 'sphynx')
                return 'sin_pelo';
            if (r.includes('moteado') || breed.name?.toLowerCase().includes('dálmata')) return 'moteado';
            if (r.includes('cara chata') || r.includes('braquicefalia') || breed.name?.toLowerCase().includes('persa'))
                return 'cara_chata';
            return 'otro';
        }
        default:
            if (factKey.startsWith('answer_')) {
                const prop = factKey.replace(/^answer_/, '');
                return (breed as any)[prop];
            }
            return (breed as any)[factKey];
    }
};

describe('useChat Hook Simulation', () => {
    const simulateGameForBreed = async (secretBreed: Breed) => {
        const { result } = renderHook(() => useChat());

        // Esperamos la primera pregunta
        await waitFor(() => expect(result.current.currentQuestion).not.toBeNull(), { timeout: 7000 });

        while (result.current.gamePhase === 'playing' && result.current.currentQuestion) {
            const question: Question = result.current.currentQuestion;

            // Deriva la respuesta correcta para la raza
            const correctAnswer = deriveAnswer(secretBreed as any, question.factKey);

            // Responde (usa act)
            await act(async () => {
                // handleUserAnswer debe aceptar (question, answer) o (factKey, answer) según tu implementación.
                // Aquí asumimos que recibe (question, answer).
                await result.current.handleUserAnswer(question, correctAnswer);
            });

            // Espera a que la CPU termine de pensar
            await waitFor(() => expect(result.current.isCpuThinking).toBe(false), { timeout: 7000 });
        }

        return result;
    };

    test('debería adivinar correctamente "Golden Retriever"', async () => {
        const secretBreed = breeds.find(b => b.name === 'Golden Retriever');
        if (!secretBreed) throw new Error('Raza no encontrada');

        const result = await simulateGameForBreed(secretBreed as Breed);

        await waitFor(() => expect(result.current.gamePhase).toBe('guessing'), { timeout: 7000 });

        const lastMessage = result.current.messages.at(-1);
        expect(lastMessage?.sender).toBe('cpu');
        expect(lastMessage?.text).toContain('Golden Retriever');
    });

    describe('Prueba de cobertura total de razas', () => {
        // limita la paralelización para no sobrecargar el entorno de tests
        for (const breed of breeds) {
            test(`debería adivinar correctamente: ${breed.name}`, async () => {
                const result = await simulateGameForBreed(breed as Breed);

                await waitFor(() => expect(result.current.gamePhase).toBe('guessing'), { timeout: 20000 });

                const lastMessage = result.current.messages.at(-1);
                expect(lastMessage?.sender).toBe('cpu');
                expect(lastMessage?.text).toContain(breed.name);
            });
        }
    });
});

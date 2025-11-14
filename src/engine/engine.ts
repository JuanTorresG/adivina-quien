import { Engine } from 'json-rules-engine';
import { rules } from '../data/rules';

export const createEngine = (): Engine => {
    const engine = new Engine(rules, {
        allowUndefinedFacts: true,
    });

    return engine;
};
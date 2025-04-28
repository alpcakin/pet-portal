import { Pet } from './Pet';

export class Kitten extends Pet {
    constructor(id: number, name: string) {
        super(id, name, 'kitten');
    }
}

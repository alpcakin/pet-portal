import { Pet } from './Pet';

export class Puppy extends Pet {
    constructor(id: number, name: string) {
        super(id, name, 'puppy');
    }
}

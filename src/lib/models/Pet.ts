export class Pet {
    constructor(
        public id: number,
        public name: string,
        public type: string,
        public hunger: number = 50,
        public happiness: number = 50,
        public adopted: boolean = false,
        public ownerId: number | null = null
    ) {}

    feed() {
        this.hunger = Math.max(0, this.hunger - 20);
    }

    play() {
        this.happiness = Math.min(100, this.happiness + 30);
    }

    treat() {
        this.hunger = Math.max(0, this.hunger - 10);
        this.happiness = Math.min(100, this.happiness + 10);
    }
}

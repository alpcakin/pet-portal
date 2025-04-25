export interface Pet {
	id: number;
	name: string;
	type: 'puppy' | 'kitten';
	hunger: number;
	happiness: number;
	adopted: boolean;
	ownerId: number | null;
}

export interface User {
	id: number;
	name: string;
	passwordHash: string;
	pets: number[];
	budget: number;
	inventory: {
		food: number;
		toy: number;
		treat: number;
	};
}

export type SafeUser = Omit<User, 'passwordHash'>;

export interface IFoodItem {
    id: number;
    name: string;
    ratings: number;
    price: number;
    quantity: number;
    image: string;
    description: string;
    stars?: boolean[];
}
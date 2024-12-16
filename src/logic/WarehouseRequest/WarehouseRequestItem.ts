export class WarehouseRequestItem {
    public readonly productName: string;
    public readonly quantity: number;

    public constructor(productName: string, quantity: number) {
        this.productName = productName;
        this.quantity = quantity;
    }
}

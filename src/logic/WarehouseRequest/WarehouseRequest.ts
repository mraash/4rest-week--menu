import * as XLSX from 'xlsx';
import { WarehouseRequestItem } from './WarehouseRequestItem';

export class WarehouseRequest {
    private items: WarehouseRequestItem[];

    public constructor(productList: Array<{name: string, quantity: number}>) {
        this.items = [];

        productList.forEach(item => {
            this.items.push(new WarehouseRequestItem(item.name, item.quantity));
        });
    }

    public getItems(): WarehouseRequestItem[] {
        return this.items;
    }

    public getItem(index: number): WarehouseRequestItem {
        const item = this.getItems()[index];

        if (item == undefined) {
            throw new Error(`Invalid index "${index}"`);
        }

        return item;
    }

    public static fromXlsx(worksheet: XLSX.WorkSheet): WarehouseRequest {
        const table = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        return WarehouseRequest.fromCellTable(table);
    }

    public static fromCellTable(sheet: ReturnType<typeof XLSX.utils.sheet_to_json>): WarehouseRequest {
        const nameHeader = 'Nosaukums';
        const quantityHeader = 'Kopā';

        let headerRowIndex: number | null = null;

        for (let rowI = 0; rowI < 30; rowI++) {
            if (sheet[rowI].includes(nameHeader) && sheet[rowI].includes(quantityHeader)) {
                headerRowIndex = rowI;
                break;
            }
        }

        if (headerRowIndex === null) {
            throw new Error('Wrong excel format');
        }

        let nameColumnIndex: number | null = null;
        let quantityColumnIndex: number | null = null;

        for (let cellI = 0; cellI < 30; cellI++) {
            if (sheet[headerRowIndex][cellI] === nameHeader) {
                nameColumnIndex = cellI;
            }

            if (sheet[headerRowIndex][cellI] === quantityHeader) {
                quantityColumnIndex = cellI;
            }
        }

        if (nameColumnIndex === null || quantityColumnIndex === null) {
            throw new Error('Wrong excel format');
        }

        const result: Array<{name: string, quantity: number}> = [];

        for (let i = headerRowIndex + 1; true; i++) {
            const productName = sheet[i][nameColumnIndex];
            const quantity = parseFloat(sheet[i][quantityColumnIndex]);

            if (!productName || isNaN(quantity)) {
                break;
            }

            result.push({
                name: productName,
                quantity: quantity,
            });
        }

        return new WarehouseRequest(result);
    }
}

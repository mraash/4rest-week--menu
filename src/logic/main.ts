import * as XLSX from 'xlsx';
import { WarehouseRequest } from './WarehouseRequest/WarehouseRequest';

export type Item = {
    header: string,
    file: File | null,
};

type HandledItem = {
    header: string,
    warehouseRequest: WarehouseRequest | null,
};

export const main = (items: Item[]) => {
    convertInputsToHandledInputs(items).then((handledItems) => {
        type CellValue = string | number | null;
        type Row = CellValue[];

        const result: Array<Row> = [['Nosaukums']];

        handledItems.forEach(item => {
            if (item.warehouseRequest === null) {
                return;
            }

            result[0].push(item.header);
            const currentColumnIndex = result[0].length - 1;

            for (let i = 0; i < item.warehouseRequest.getItems().length; i++) {
                const currentProduct = item.warehouseRequest.getItem(i);

                for (let j = 1; j <= result.length; j++) {
                    // Push
                    if (j === result.length) {
                        const newRow: Row = [currentProduct.productName];
    
                        for (let k = 1; k < currentColumnIndex; k++) {
                            newRow.push(null);
                        }

                        newRow.push(currentProduct.quantity);
    
                        result.push(newRow);

                        break;
                    }

                    const comparedName = result[j][0] as string;
                    
                    // Join
                    if (currentProduct.productName === comparedName) {
                        result[j].push(currentProduct.quantity);

                        break;
                    }

                    // Slice
                    if (currentProduct.productName.localeCompare(comparedName, undefined, { sensitivity: 'base' }) < 0) {
                        const newRow: Row = [currentProduct.productName];
    
                        for (let k = 1; k < currentColumnIndex; k++) {
                            newRow.push(null);
                        }
    
                        newRow.push(currentProduct.quantity);
    
                        result.splice(j, 0, newRow);
    
                        break;
                    }

                    // Continue
                }
            }

            for (let i = 1; i < result.length; i++) {
                if (result[i].length < result[0].length) {
                    result[i].push(null);
                }
            }
        });

        const worksheet = XLSX.utils.aoa_to_sheet(result);
        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        XLSX.writeFile(workbook, 'result.xlsx', { sheetStubs: true });
    });
};

function convertInputsToHandledInputs(items: Item[]): Promise<Array<HandledItem>> {
    const inputItemToHandledItem = (input: Item): Promise<HandledItem> => {
        return new Promise((resolve) => {
            const file = input.file;

            if (file === null) {
                resolve({ header: input.header, warehouseRequest: null });

                return;
            }

            const reader = new FileReader();

            reader.onload = (event) => {
                const fileContent = new Uint8Array(event.target!.result as ArrayBuffer);
                const workbook = XLSX.read(fileContent, { type: 'array' });

                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];

                const warehouseRequest = WarehouseRequest.fromXlsx(firstSheet);

                resolve({ header: input.header, warehouseRequest: warehouseRequest });
            };

            reader.readAsArrayBuffer(file);

            return null;
        });
    }

    const promises: Promise<HandledItem>[] = items.map(item => inputItemToHandledItem(item));

    return new Promise(resolve => {
        Promise.all(promises).then(values => resolve(values));
    });
}

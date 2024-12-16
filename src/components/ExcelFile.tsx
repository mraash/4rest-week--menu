import { ChangeEvent, FC } from 'react';

export type ExcelFileProps = {
    formFileName: string,
    formInputName: string,
    inputValue: string,
};

export type ExcelFileFullProps = ExcelFileProps & {
    onInputChange: (e: ChangeEvent<HTMLInputElement>) => void,
    onFileChange: (e: ChangeEvent<HTMLInputElement>) => void,
};

export const ExcelFile: FC<ExcelFileFullProps> = (props) => {
    return (
        <div>
            <input
                name={ props.formInputName }
                value={ props.inputValue }
                onChange={ props.onInputChange }
                placeholder='Column header...'
                style={{ marginRight: '10px' }}
            />
            <input
                name={ props.formFileName }
                type="file"
                onChange={ props.onFileChange }
            />
        </div>
    );
};

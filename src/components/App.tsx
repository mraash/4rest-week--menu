import { ChangeEvent, FormEventHandler, useState } from 'react'
import { ExcelFile, ExcelFileProps } from './ExcelFile'
import { main } from '../logic/main';

export const App = () => {
    const [files, setFiles] = useState<Array<ExcelFileProps & { fileValue: File | null }>>([
        { formFileName: 'file-1', formInputName: 'header-1', inputValue: 'Pr', fileValue: null },
        { formFileName: 'file-2', formInputName: 'header-2', inputValue: 'Ot', fileValue: null },
        { formFileName: 'file-3', formInputName: 'header-3', inputValue: 'Tr', fileValue: null },
        { formFileName: 'file-4', formInputName: 'header-4', inputValue: 'Ct', fileValue: null },
        { formFileName: 'file-5', formInputName: 'header-5', inputValue: 'Pk', fileValue: null },
        { formFileName: 'file-6', formInputName: 'header-6', inputValue: 'Se', fileValue: null },
        { formFileName: 'file-7', formInputName: 'header-7', inputValue: 'Sv', fileValue: null },
    ]);

    const onInputChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
        const updatedFiles = [...files];
        updatedFiles[index].inputValue = e.target.value;

        setFiles(updatedFiles);
    };

    const onFileChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files!.item(0);

        const updatedFiles = [...files];
        updatedFiles[index].fileValue = file;

        setFiles(updatedFiles);
    };

    const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        main(files.map(item => {
            return {
                header: item.inputValue,
                file: item.fileValue,
            };
        }));
    };

    return (
        <form id="form-main" onSubmit={ onSubmit }>
            { files.map((file, index) => {
                return (
                    <div
                        key={ file.formFileName }
                        style={{
                            marginBottom: '10px',
                        }}
                    >
                        <ExcelFile
                            { ...file }
                            onInputChange={ (e) => { onInputChange(e, index) } }
                            onFileChange={ (e) => { onFileChange(e, index) } }
                        />
                    </div>
                )
            }) }
            <div
                style={{
                    margin: '10px 0 0 0'
                }}
            >
                <button type='submit' form="form-main">Submit</button>
            </div>
        </form>
    )
}

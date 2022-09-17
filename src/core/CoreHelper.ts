// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function downloadFile(fileName: string, file: Blob) {
    const url = window.URL.createObjectURL(
        new Blob([file]),
    );
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
        'download',
        fileName,
    );

    // Append to html link element page
    document.body.appendChild(link);

    // Start download
    link.click();

    // Clean up and remove the link
    link.parentNode?.removeChild(link);
}

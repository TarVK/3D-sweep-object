/**
 * Downloads a given string to the client as a file
 * @param data The data to be downloaded
 * @param filename The name of the file to download
 * @param type The file type to download
 */
export const download = (data: string, filename: string, type: string) => {
    const file = new Blob([data], {type: type});

    const a = document.createElement("a"),
        url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 0);
};

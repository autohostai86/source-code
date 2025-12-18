/** @format */

export function CHANGELABEL(str) {
    return str
        .toLowerCase()
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

export function TERN2HTML(str) {
    // remove first #@#
    // eslint-disable-next-line no-param-reassign
    let data = str;
    if (data === undefined) data = '-';
    if (data.includes('#@#')) {
        let dataPeases = data.split('#@#');
        dataPeases = dataPeases.map((d) => `<br /><li>${d}</li><br />`);
        const RefactedData = `<ol>${dataPeases.join('')}</ol>`;
        data = RefactedData;
    }
    // let datatr = singleField.data;
    data = JSON.stringify(data);
    const regex = /\\n/g;
    data = data.replace(/\\f/g, '');
    data = data.replace(regex, '<br />');
    data = JSON.parse(data);
    // console.log(data);
    return { __html: data };
}

export default {};

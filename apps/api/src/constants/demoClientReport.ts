/** @format */

export default function clientReport(clientName, clientId, reportId) {
    const randColor = () => {
        return (
            '#' +
            Math.floor(Math.random() * 16777215)
                .toString(16)
                .padStart(6, '0')
                .toUpperCase()
        );
    };
    const randomId = Date.now();
    return {
        '62869398dc08eb010068be07': {
            id: '62869398dc08eb010068be07',
            name: clientName,
            isDir: true,
            color: `${randColor()}`,
            parentId: '62869398dc08eb010068be19',
            childrenIds: [randomId, `${randomId}2`],
            childrenCount: 2,
        },
        'e598a85f843d': {
            id: 'e598a85f843d',
            name: 'Raw Medical Records',
            isDir: true,
            modDate: '2020-10-24T17:48:39.866Z',
            clientId,
            reportId,
            childrenIds: ['9514a3d74d58'],
            childrenCount: 1,
            parentId: 'qwerty123457',
        },
        'b6667221f24c': {
            id: 'b6667221f24c',
            name: 'Completed Reports',
            isDir: true,
            clientId,
            reportId,
            modDate: '2020-10-21T15:59:46.786Z',
            parentId: 'qwerty123457',
            childrenIds: ['148ffc6cc2e7'],
            childrenCount: 1,
        },
    };
}

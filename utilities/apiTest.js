const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const util = require('util');

const readFile = util.promisify(fs.readFile);

async function run() {
    for (let index = 1; index < 3; index++) {
        let isExists = fs.existsSync(`./N/N${index}.pdf`);
        if (isExists) {
            const pdf = await readFile(`./N/N${index}.pdf`);
            const excel = await readFile(`./N/N${index}.xlsx`);

            let isDocExists = fs.existsSync(`./N/N${index}.doc`);
            let doc;
            if (isDocExists) {
                doc = await readFile(`./N/N${index}.doc`);
            }

            // Create a form and append image with additional fields
            const formData = new FormData();

            const now = `${Date.now()}`;

            formData.append('userId', '62b073c13ae0cd08f60da992');
            formData.append('orgId', '62b04ce2e52486001294ed61');
            formData.append('adminId', '62b073933ae0cd08f60da980');
            formData.append('superAdminId', '62b04ce2e52486001294ed5f');
            formData.append('processName', 'test');
            formData.append(
                'configType',
                JSON.stringify({
                    isCombine: true,
                    isSplit: false,
                    isHyperLinking: false,
                    isOCR: false,
                    isROR: true,
                    isBookmark: false,
                    isUnwanted: false,
                }),
            );
            formData.append('clientType', 'test1');
            formData.append('reportType', 'CT Scan');
            formData.append('recievedDate', '2022-07-02T00:00:00.000Z');
            formData.append('pdfQuality', 'good');
            formData.append('folderName', now);
            formData.append('uploadType', 'split_combine_files');
            formData.append('socketId', 'OfsO9SWeFueE2nirAAAX');

            formData.append('files', pdf, {
                type: 'application/pdf',
                mimetype: 'application/pdf',
                contentType: 'application/pdf',
                filename: `N${index}.pdf`,
            });
            formData.append('files', excel, {
                mimetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                filename: `N${index}.xlsx`,
            });
            if (doc !== undefined) {
                formData.append('files', doc, {
                    mimetype: 'application/msword',
                    type: 'application/msword',
                    contentType: 'application/msword',
                    filename: `N${index}.doc`,
                });
            }

            // Send form data with axios
            try {
                const response = await axios.post('http://217.146.95.81/api/upload/split-combine', formData, {
                    headers: {
                        'content-type': 'multipart/form-data',
                    },
                    maxContentLength: Infinity,
                    maxBodyLength: Infinity,
                });

                console.log('response: ', response.data);
            } catch (error) {
                console.log('error: ', error);
            }
        }
    }
}

run();

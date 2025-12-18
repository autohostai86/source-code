/** @format */
import MaterialTable from 'material-table'
import { observer } from 'mobx-react-lite'
import React, { useEffect, useState } from 'react'
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import tableIcons from 'apps/client/src/components/TableIcon'
import useStore from 'apps/client/src/mobx/UseStore'
import OfflineService from 'apps/client/src/services/OfflineService'
import { baseURL } from 'apps/client/src/utils/API'
import fallBack from "../../../assets/img/fallback_Image.jpg";

const Index: React.FC = () => {
    const { UserState, UiState } = useStore();
    const [customerData, setCustomerData] = useState([]);

    const getCustomerData = async () => {
        const postData = `botId=${UserState.currentBotData?.['_id']}&aptNo=${UserState.selectedListing?.['hostawayListId']}`
        const { error, msg, data } = await OfflineService.getCustomerData(postData);
        if (!error) {
            setCustomerData(data);
        } else {
            UiState.notify(msg, "error");
        }
    }

    const exportToExcel = async () => {
        // Create a new workbook
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Customer List");
    
        // Add columns
        worksheet.columns = [
            { header: "Name", key: "name", width: 20 },
            { header: "Email", key: "email", width: 30 },
            { header: "Phone", key: "phone", width: 15 },
            { header: "ID Proof", key: "idProof", width: 30 },
        ];
    
        // Add rows
        customerData.forEach((row, index) => {
            worksheet.addRow({
                name: row.name,
                email: row.email,
                phone: row.phone,
            });
    
            // Set the row height for rows with images
            const rowIndex = index + 2; // Header is on row 1
            worksheet.getRow(rowIndex).height = 60; // Adjust height to fit the image
        });
    
        // Add images to the worksheet
        const addImageToWorksheet = async (rowIndex, imageUrl) => {
            try {
                const response = await fetch(imageUrl);
                const blob = await response.blob();
                const buffer = await blob.arrayBuffer();
    
                const imageId = workbook.addImage({
                    buffer,
                    extension: "jpeg", // Adjust based on your image format
                });
    
                worksheet.addImage(imageId, {
                    tl: { col: 3, row: rowIndex - 1 }, // Adjust placement to center
                    ext: { width: 100, height: 100 }, // Adjust image size
                });
            } catch (error) {
                console.error("Error adding image:", error);
            }
        };
    
        // Iterate through customerData and add images
        for (let i = 0; i < customerData.length; i++) {
            if (customerData[i].idProof !== '') {
                const imageUrl = `${baseURL}/${customerData[i].idProof}`;
                await addImageToWorksheet(i + 2, imageUrl); // Row index starts from 2 due to header row
            }
        }
    
        // Save the Excel file
        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), `Customer_List_${UserState.selectedListing['internalListingName']}.xlsx`);
    };

    useEffect(() => {
        getCustomerData();
    },[])

    return (
        <>
            <MaterialTable
                title="Customers"
                icons={tableIcons}
                columns={[
                    // {title: 'Apartment Name', field:'aptName'},
                    // {title: 'Apartment No', field:'aptNo'},
                    {title: 'Name', field:'name'},
                    {title: 'Email', field:'email'},
                    {title: 'Phone No', field:'phone'},
                    {
                        title: 'ID Proof',
                        field: '',
                        render: (rowData) => {
                            const imageUrl = `${baseURL}/${rowData?.['idProof']}`;

                            // Check if the image URL is empty or invalid, and fallback to default image
                            const isValidImageUrl = imageUrl && imageUrl !== 'undefined' && imageUrl !== 'null';
                            
                            return (
                              <img
                                src={isValidImageUrl ? imageUrl : fallBack}
                                alt=""
                                style={{
                                  width: UiState.isMobile ? '100%' : '50%',
                                  // height: '15rem',
                                }}
                                // @ts-ignore
                                onError={(e) => e.target.src = fallBack}
                              />
                            );
                        }
                    },
                ]}
                data={customerData}
                components={{
                    Toolbar: () => (
                        <>
                        {
                            customerData.length > 0 && (
                                <div className="d-flex flex-wrap justify-content-between p-1">
                                    <h1 className=''>Customers</h1>
                                    <button className='btn btn-outline-dark' onClick={exportToExcel}>Export as excel</button>
                                </div>
                            )
                        }
                        </>
                    )
                }}
            />
        </>
    )
}

export default observer(Index);
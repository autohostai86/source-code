/* eslint-disable prettier/prettier */
/* eslint-disable radix */
/* eslint-disable no-underscore-dangle */
/** @format */
/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck
// import { toJS } from "mobx";
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState, forwardRef } from 'react';
import MaterialTable from "material-table";
import { Button } from 'reactstrap';

import useStore from '../../../../mobx/UseStore';
// import './index.scss';

import BotService from 'apps/client/src/services/BotService';
import AddBox from "@material-ui/icons/AddBox";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";
import { Icons } from "material-table";
import { toJS } from 'mobx';

const tableIcons: Icons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

// eslint-disable-next-line arrow-body-style
const Index: React.FC = ({apartmentNo}) => {
    // const history = useHistory();
    const { UserState, UiState } = useStore();
    const [questions, setQuestions] = useState([]);

    const updateQA = async (updatedQuestions) => {
        
        const postData = {
            botId: UserState.currentBotId !== '' ? UserState.currentBotId : UserState.currentBotData?.['_id'],
            qa: updatedQuestions,
            apartmentNo: apartmentNo
        }
        const { error, msg, data } = await BotService.addQA(postData);

        if (!error) {
            UiState.notify(msg, 'success');
            if (data['_id']) {
                UserState.setCurrentBotData(data);
            }
        } else {
            UiState.notify(msg, 'error');
        }
    }

    const refactorQA = () => {
        if (UserState.currentBotData['qa']) {
            const filered = toJS(UserState.currentBotData['qa'][apartmentNo]);
            if (filered !== undefined) {
                setQuestions(filered);
            } else {
                setQuestions([]);
            }
        }
    }
    
    useEffect(() => {
        // setQuestions(UserState.currentBotData?.['qa']);
        if (apartmentNo !== '') {
            refactorQA();
        }
    }, [apartmentNo]);
    return (
        <>
            <MaterialTable
                title="Q&A"
                icons={tableIcons}
                columns={[
                    {title: 'Question', field:'question'},
                    {title: 'Answer', field:'answer'},
                ]}
                data={questions}
                editable={{
                    onRowAdd: async newData =>
                        await new Promise((resolve, reject) => {
                            // setTimeout(async () => {
                            //     setQuestions([...questions, newData]);
                            //     await updateQA();
                            //     resolve();
                            // }, 1000)
                            
                            setQuestions(() => {
                                const { tableData, ...cleanedData } = newData;
                                const updatedQuestions = [...questions, cleanedData];
                                updateQA(updatedQuestions);
                                resolve();
                                return updatedQuestions;
                              });
                        }),
                    onRowUpdate: (newData, oldData) =>
                        new Promise((resolve, reject) => {
                            setQuestions(() => {
                                const dataUpdate = [...questions];
                                const index = oldData.tableData.id;
                                const { tableData, ...cleanedData } = newData;
                                dataUpdate[index] = cleanedData;
                                updateQA(dataUpdate)
                                resolve()
                                return dataUpdate
                            });
                        }),
                    onRowDelete: oldData =>
                        new Promise((resolve, reject) => {
                            setQuestions(() => {
                                const dataDelete = [...questions];
                                const index = oldData.tableData.id;
                                dataDelete.splice(index, 1);
                                updateQA(dataDelete)
                                resolve()
                                return dataDelete
                            });
                        }),
                }}
            />
        </>
    );
};
export default observer(Index);

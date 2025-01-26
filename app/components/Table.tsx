import * as React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import { AppDispatch, RootState } from '../store/reduxStore';
import {actions, IUser} from "../store/userReducer";
import AddModal from "./AddModal";
import DeleteModal from "./DeleteModal";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
    GridRowsProp,
    GridRowModesModel,
    GridRowModes,
    DataGrid,
    GridColDef,
    GridToolbarContainer,
    GridActionsCellItem,
    GridEventListener,
    GridRowId,
    GridRowModel,
    GridRowEditStopReasons,
} from '@mui/x-data-grid';
import Checkbox from '@mui/material/Checkbox';
import { Avatar } from '@mui/material';


declare module '@mui/x-data-grid' {
    interface ToolbarPropsOverrides {
        setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
        setRowModesModel: (
            newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
        ) => void;
    }
}

function EditToolbar() {

    const [isAddModal, setIsAddModal] = React.useState(false);

    const onAddedModalHandler = () => {
        setIsAddModal(true);
    };

    return (
        <>
            <GridToolbarContainer sx={{
                backgroundColor: '#c6d9eb'
            }}>
                <Button sx={{
                marginBottom: '5px'
            }} variant="contained" size="small" color="success" startIcon={<AddIcon/>} title='add' onClick={onAddedModalHandler}>Добавить</Button>
                <DeleteModal/>
            </GridToolbarContainer>
            {isAddModal && <AddModal setIsAddModal={setIsAddModal} isAddModal={isAddModal} />}
        </>
    );
}

export default function FullFeaturedCrudGrid() {
    const dispatch = useDispatch<AppDispatch>();
    const users = useSelector<IUser[]>((state: RootState) => state.userReducer.users);
    //const deleteChecked = useSelector((state) => state.userReducer.deleteChecked);
    const [rows, setRows] = React.useState<IUser[] |  undefined>();
    const [checkboxUser, setCheckboxUser] = React.useState([]);
    const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});

    useEffect(() => {
            const userInfo: IUser[] = users.map((obj: { name: string; }) => ({...obj, avatar: obj.name.charAt(0)})); //реструктуризация массива
            setRows(userInfo);    
    }, [users])

    useEffect(() => {
        dispatch(actions.setUserChecked(checkboxUser))
    }, [checkboxUser, dispatch]);

    // useEffect(() => {
    //     handleDeleteClick()
    // }, [deleteChecked]);

    const handleDeleteCheckbox = (id: GridRowId) => () => {
        if (checkboxUser.includes(id)) {
            const newChecked = checkboxUser.filter(item => item !== id)
            setCheckboxUser(newChecked)
            dispatch(actions.setUserChecked(newChecked))
        } else {
            checkboxUser.push(id)
        }
        dispatch(actions.setUserChecked(checkboxUser))
    };

    const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleEditClick = (id: GridRowId) => () => {
        setRowModesModel({...rowModesModel, [id]: {mode: GridRowModes.Edit}});
    };

    const handleSaveClick = (id: GridRowId) => () => {
        setRowModesModel({...rowModesModel, [id]: {mode: GridRowModes.View}});
    };

    const handleDeleteClick = (id: GridRowId) => () => {
        setRows(rows.filter((row) => row.id !== id));
    };

    const handleCancelClick = (id: GridRowId) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: {mode: GridRowModes.View, ignoreModifications: true},
        });

        const editedRow = rows.find((row) => row.id === id);
        if (editedRow!.isNew) {
            setRows(rows.filter((row) => row.id !== id));
        }
    };

    const processRowUpdate = (newRow: GridRowModel) => {
        const updatedRow = {...newRow, isNew: false};
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const columns: GridColDef[] = [
        {
            field: '',
            type: 'actions',
            headerName: '',
            width: 50,
            cellClassName: 'actions',
            getActions: ({id}) => {
                return [
                    <Checkbox key={id} onChange={handleDeleteCheckbox(id)}/>
                ];
            },
        },

        {
            field: 'id',
            headerName: 'id',
            type: 'number',
            width: 50,
            align: 'left',
            headerAlign: 'left',
            editable: true,
            headerClassName: 'super-app-theme--header',

        },
        {
            field: "avatar",
            headerName: 'Avatar',
            width: 60,
            renderCell: (params) => {
                return (
                    <>
                        <Avatar sx={{ marginTop: '5px', backgroundColor: '#df7107' }}>{params.value}</Avatar>
                    </>
                );
            }
        },
        {field: 'name', headerName: 'Name', width: 180, editable: true},
        {field: 'username', headerName: 'Username', width: 180, editable: true},
        {field: 'email', headerName: 'Email', width: 180, editable: true},
        {field: 'phone', headerName: 'Phone', width: 180, editable: true},
        {field: 'zipcode', headerName: 'Zipcode', width: 100, editable: true},


        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            getActions: ({id}) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            key={id}
                            icon={<SaveIcon/>}
                            label="Save"
                            sx={{
                                color: 'primary.main'
                            }}
                            onClick={handleSaveClick(id)}
                        />,
                        <GridActionsCellItem
                        key={id}
                            icon={<CancelIcon/>}
                            label="Cancel"
                            className="textPrimary"
                            onClick={handleCancelClick(id)}
                            color="inherit"
                        />,
                    ];
                }

                return [
                    <GridActionsCellItem
                        key={id}
                        icon={<EditIcon/>}
                        label="Edit"
                        className="textPrimary"
                        onClick={handleEditClick(id)}
                        color="inherit"
                    />,
                    <GridActionsCellItem
                        key={id}    
                        icon={<DeleteIcon/>}
                        label="Delete"
                        onClick={handleDeleteClick(id)}
                        color="inherit"
                    />,
                ];
            },
        },
    ];

    return (
        <Box

            sx={{
                height: '100%',
                width: '100%',
                '& .actions': {
                    color: 'text.secondary',
                },
                '& .textPrimary': {
                    color: 'text.primary',
                },
                backgroundColor: '#c6d9eb',
            }}
        >

            <DataGrid
                rows={rows}
                columns={columns}
                editMode="row"
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                slots={{toolbar: EditToolbar}}
                slotProps={{
                    toolbar: {setRows, setRowModesModel},
                }}
            />

        </Box>

    );
}

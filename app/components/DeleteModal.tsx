import React from "react"
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import { AppDispatch } from "../store/reduxStore";
import {actions} from "../store/userReducer";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Snackbar, {SnackbarCloseReason} from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import DeleteIcon from "@mui/icons-material/DeleteOutlined";


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: '#f3dd97',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    borderRadius: 5,
};

export default function DeleteModal() {
    const dispatch = useDispatch<AppDispatch>()
    const users = useSelector((state) => state.userReducer.users)
    const userChecked = useSelector((state) => state.userReducer.userChecked)
    const [open, setOpen] = useState(false) //модальное окно
    const [openSnackbar, setOpenSnackbar] = useState(false) //снэкбар


    const handleClick = () => {
        setOpenSnackbar(true);
    };

    const btn = () => {
        const result = users.filter(e => !userChecked.some(x => e.id === x))
        dispatch(actions.setChange(result))
        handleClick()
        handleClose()
        console.log('newUser', result)
    }


    const handleCloseSnackbar = (
        event?: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div>
            <Button sx={{
                marginBottom: '5px'
            }} variant="contained" size="small" color="error" startIcon={<DeleteIcon/>} onClick={handleOpen}>
                Удалить
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" component="h2">
                        <Box sx={{color: 'black'}}>
                            Вы действительно хотите удалить выбранные элементы?
                        </Box>
                    </Typography>

                    <Box sx={{
                        marginTop: '10px',
                        textAlign: 'end'
                    }}>
                        <Button sx={{
                            marginRight: '10px',

                        }} variant="contained" size="small" color="warning" onClick={handleClose}>
                            Отмена
                        </Button>
                        <Button variant="contained" size="small" color="error"
                                onClick={btn}>
                            Удалить
                        </Button>
                    </Box>
                </Box>

            </Modal>
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert
                    onClose={handleCloseSnackbar}
                    severity="success"
                    variant="filled"
                    sx={{width: '100%'}}
                >
                    Выбранные элементы удалены
                </Alert>
            </Snackbar>
        </div>
    );
}

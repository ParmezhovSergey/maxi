import React from "react"
import { useState, useEffect } from "react";
import {useDispatch, useSelector} from "react-redux";
import { AppDispatch, RootState } from "../store/reduxStore";
import {actions} from "../store/userReducer";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import InputMask from "@mona-health/react-input-mask";
import Snackbar, {SnackbarCloseReason} from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';


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

interface IUser {
    id: number,
    name: string,
    username: string,
    email: string,
    zipcode: string,
    phone: string,
    avatar?: string
};

interface IProps {
    setIsAddModal: (value: boolean) => void;
    isAddModal: boolean;
}

export default function AddModal(props: IProps) {
    const { isAddModal, setIsAddModal} = props;

    const dispatch = useDispatch<AppDispatch>()
    const users: IUser[] = useSelector((state: RootState) => state.userReducer.users)
    const [errorName, setErrorName] = useState<string | null>('обязательное поле для заполнения') //ошибка формы name
    const [errorUserName, setErrorUserName] = useState<string | null>('обязательное поле для заполнения') //ошибка формы username
    const [errorEmail, setErrorEmail] = useState<string | null>('обязательное поле для заполнения') //ошибка формы email
    const [error, setError] = useState<string | null>(null) //ошибка формы email
    const [errorPhone, setErrorPhone] = useState<string | null>('обязательное поле для заполнения') //ошибка формы email
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false) //снэкбар
    const [disabledButton, setDisabledButton] = useState(true) //disabled кнопки сохранить
    const [idUser, setIdUser] = useState<number>(Number(crypto.randomUUID().replace(/[^0-9]/g, ""))) //disabled кнопки сохранить
   
    const [newUser, setNewUser] = useState<IUser>({
        id: idUser,
        name: "",
        username: "",
        email: "",
        zipcode: "",
        phone: "",
        avatar: ""
    });                                                               //новый сотрудник
    const { name, username, email, phone, zipcode } = newUser;

    useEffect(() => {
        if ((errorName === null) && (errorUserName === null) && (errorEmail === null) && (error === null) && (errorPhone === null)) {
            setDisabledButton(false)
        }
    }, [errorName, errorUserName, errorEmail, error, errorPhone]);

    useEffect(() => {
        isIdUser()
    }, [errorName]);

    function isIdUser() {
        const idNumber = Number(crypto.randomUUID().replace(/[^0-9]/g, ""));
        setIdUser(idNumber)
    }

    function isValidEmail(email: string) {
        return /\S+@\S+\.\S+/.test(email);
    }

    function isValidName(e: string) {
        return /^\s*$/.test(e);
    }

    function validatePhone(phone: string | unknown[]) {
        return phone.length === 17
    }

    const emailChange = (event: {target: {value: string}}) => {
        if (!isValidEmail(event.target.value)) {
            setError('Email is invalid');
        } else {
            setError(null);
        }
        if (isValidName(event.target.value)) {
            setErrorEmail('обязательное поле для заполнения');
        } else {
            setErrorEmail(null);
        }
        setNewUser(state => ({...state, email: event.target.value}));
    }

    const nameChange = (event: {target: {value: string}}) => {
        if (isValidName(event.target.value)) {
            setErrorName('обязательное поле для заполнения');
        } else {
            setErrorName(null);
        }
        setNewUser( state => ({...state, name: event.target.value}));
    };

    const userNameChange = (event: {target: {value: string}}) => {
        if (isValidName(event.target.value)) {
            setErrorUserName('обязательное поле для заполнения');
        } else {
            setErrorUserName(null);
        }
        setNewUser(state => ({...state, username: event.target.value}));
    }

    const userPhoneChange = (event: {target: {value: string}}) => {
        if (!validatePhone(event.target.value)) {
            setErrorPhone('обязательное поле для заполнения');
        } else {
            setErrorPhone(null);
        }
        setNewUser(state =>  ({...state , phone: event.target.value}));
    }

    const userZipCode = (event: {target: {value: string}}) => {
        setNewUser(state =>  ({...state , zipcode: event.target.value}));
    }

    const btnSave = () => {
        
        dispatch(actions.setChange([...users, newUser]))
        // setIsAddModal(false)
        setOpenSnackbar(true)
    };

    const handleCloseSnackbar = (
        event?: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    const handleClose = () => {
        setIsAddModal(false)
    }

    return (
        <div>
            <Modal
                open={isAddModal}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" component="h2">
                        <Box sx={{color: 'black'}}>
                            name
                        </Box>

                        <Box sx={{fontSize: '15px',}}>
                            <input
                                type="text"
                                required
                                placeholder='Name'
                                value={name}
                                onChange={nameChange}
                                style={{width: '190px'}}
                            />
                            {errorName && <h2 style={{color: 'red', fontSize: '10px'}}>{errorName}</h2>}
                        </Box>

                        <Box sx={{color: 'black'}}>
                            username
                        </Box>

                        <Box sx={{
                            fontSize: '15px',
                            color: 'blue',
                        }}>
                            <input
                                type="text"
                                required
                                placeholder='UserName'
                                value={username}
                                onChange={userNameChange}
                                style={{width: '190px'}}
                            />
                            {errorUserName && <h2 style={{color: 'red', fontSize: '10px'}}>{errorUserName}</h2>}
                        </Box>

                        <Box sx={{color: 'black'}}>
                            email
                        </Box>

                        <Box sx={{
                            fontSize: '15px',
                            color: 'blue'
                        }}>

                            <input
                                type="email"
                                required
                                placeholder='name@example.com'
                                value={email}
                                onChange={emailChange}
                                style={{width: '190px'}}
                            />
                            {errorEmail && <h2 style={{color: 'red', fontSize: '10px'}}>{errorEmail}</h2>}
                            {error && <h2 style={{color: 'red', fontSize: '10px'}}>{error}</h2>}
                        </Box>
                        
                        <Box sx={{color: 'black'}}>
                            phone
                        </Box>

                        <Box sx={{
                            fontSize: '15px',
                            color: 'blue',
                        }}>
                           
                            <InputMask
                            mask="+7\ (999) 999-9999"
                            placeholder='+7 (999) 999-9999'
                            value={phone}
                            onChange={userPhoneChange}
                        />
                             {errorPhone && <h2 style={{color: 'red', fontSize: '10px'}}>{errorPhone}</h2>}
                        
                        </Box>

                        <Box sx={{color: 'black'}}>
                            zipcode
                        </Box>

                        <Box sx={{
                            fontSize: '15px',
                            color: 'blue',
                        }}>
                            <input
                                type="number"
                                required
                                placeholder='zipcode'
                                value={zipcode}
                                onChange={userZipCode}
                                style={{width: '190px'}}
                            />

                        </Box>
                    </Typography>

                    <Box sx={{
                        marginTop: '10px',
                        textAlign: 'end'
                    }}>
                        <Button sx={{
                            marginRight: '10px',
                        }} variant="contained" size="small" color="warning" onClick={handleClose}>
                            Закрыть
                        </Button>
                        <Button disabled={disabledButton} variant="contained" size="small" color="success"
                                onClick={btnSave}>
                            Сохранить
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
                    Изменения сохранены
                </Alert>
            </Snackbar>
        </div>
    );
}

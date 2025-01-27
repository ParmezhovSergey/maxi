import {getUsers} from "../api/api";
import {ActionsTypes, AppDispatch} from "./reduxStore";

const FETCH_USERS = "FETCH_USERS";
const CHANGE = 'CHANGE'
const USER_CHECKED = 'USER_CHECKED'

type UsersAction = ActionsTypes<typeof actions>;

export interface IUser {
    id: number,
    name: string,
    username: string,
    email: string,
    zipcode: string,
    phone: string,
    avatar?: string
};

export interface IState {
    users: Array<IUser>
    userChecked: Array<string>
};

const initialState: IState = {
    users: [],
    userChecked: [],
  };

const userReducer = (state = initialState, action: UsersAction): IState  => {
    switch (action.type) {
        case FETCH_USERS:
            return {
                ...state,
                users: action.users,
            };
        case CHANGE:
            return {
                ...state,
                users: state.users = action.users,
            };
        case USER_CHECKED:
            return {
                ...state,
                userChecked: state.userChecked = action.checkboxUser
            };

        default:
            return state
    }
}

export const actions = {
    setFetchUsers: ( users: IUser[]) =>({ type: FETCH_USERS, users } as const),
    setChange: (users: IUser[]) =>({ type: CHANGE, users } as const),
    setUserChecked: (checkboxUser: Array<string>) =>({ type: USER_CHECKED, checkboxUser } as const),
  };

//получение всех сотрудников
export const fetchUsers = () => {
    return async (dispatch: AppDispatch) => {
        const response = await getUsers();

        if (response && response.length > 0) {
            dispatch(actions.setFetchUsers(response?.map(({ name, id, username, phone, address, email }) => ({
                id,
                name,
                username,
                phone,
                email,
                zipcode: address.zipcode,
        }
    ))));
    }};
};

export default userReducer;
"use client"
import React from "react"
import {useDispatch} from "react-redux";
import {useEffect} from "react";
import { AppDispatch } from "./store/reduxStore";
import {fetchUsers} from "./store/userReducer";
import FullFeaturedCrudGrid from './components/Table';
import ButtonAppBar from "./components/AppBar";


export default function Home() {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(fetchUsers())
    }, [dispatch]);

    return (
        <div>
            <ButtonAppBar/>
            <FullFeaturedCrudGrid/>
        </div>
    );
}

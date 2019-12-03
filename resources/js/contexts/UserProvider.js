import React, { createContext, PureComponent } from 'react';
import axios from 'axios';
import API from '../api'

export const UserContext = createContext();

export default class UserProvider extends PureComponent {

    state = {
        loggedIn: false,
        username: undefined,
        email: undefined,
        nama: undefined,
        tanggal_lagir: undefined,
        setLoggedIn: () => {
            this.state.loggedIn = true;
            this.forceUpdate();
        },
        checkLogin: async () => {
            if (localStorage.token) {
                const token = localStorage.token;
                this.state.loggedIn = true;
                const data = await axios.get(API.users, { headers: { Authorization: token } });
                this.state.nama = data.data.nama;
                this.state.username = data.data.username;
                this.state.email = data.data.email;
                this.state.tanggal_lagir = data.data.tanggal_lagir;
                this.forceUpdate();
            }
            else {
                this.state.loggedIn = false;
            }
        }


    }

    render() {
        return (
            <UserContext.Provider value={this.state}>
                {this.props.children}
            </UserContext.Provider>
        );
    }
}

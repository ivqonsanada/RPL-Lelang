import React, { PureComponent } from 'react'
import {
    Card
} from 'antd';
import { Redirect } from 'react-router-dom'
import RegisterForm from '../components/RegisterForm';

export default class Register extends PureComponent {
    render() {
        if (localStorage.token) {
            return (
                <Redirect to='/profile'></Redirect>
            )
        }
        return (
            <Card style={{ width: '40%', margin: 'auto', padding: 16, borderRadius: 10 }}>
                <h3 style={{ textAlign: 'center' }}>Daftar akun baru sekarang</h3>
                <RegisterForm />
            </Card>
        );
    }
}

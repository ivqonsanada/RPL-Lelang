import React, { PureComponent } from 'react'
import {
    Form, Input, Icon, Button, Menu, Upload, message
} from 'antd';
import LelangForm from '../components/LelangForm';

export default class CreateLelang extends PureComponent {
    render() {
        return (
            <Menu style={{ width: '40%', margin: 'auto', padding: 16, borderRadius: 10 }}>
                <h3 style={{ textAlign: 'center' }}>Lelang Barangmu!</h3>
                <LelangForm />
            </Menu>
        )
    }
}

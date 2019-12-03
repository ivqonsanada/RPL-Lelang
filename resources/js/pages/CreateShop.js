import React, { PureComponent } from 'react'
import {
    Spin, Menu
} from 'antd';
import { Redirect } from 'react-router'
import Axios from 'axios';
import ShopForm from '../components/ShopForm';
import API from '../api'

export default class CreateShop extends PureComponent {

    state = {
        loading: true,
        status: true,
        username: undefined,
    }

    async componentDidMount() {
        try {
            const data = await Axios.get(API.cek_toko, { headers: { Authorization: localStorage.token } });
            this.setState({ loading: false })
            this.setState({ status: false });
            return Promise.resolve();
        }
        catch (err) {
            this.setState({ loading: false })
            this.setState({ status: true });
        }
    }

    render() {
        if (this.state.loading) {
            return (
                <div>
                    <Spin style={{ marginLeft: '50%' }} />
                </div>
            )
        }
        else {
            if (this.state.status) {
                return (
                    <Menu style={{ width: '40%', margin: 'auto', padding: 16, borderRadius: 10 }}>
                        <h3 style={{ textAlign: 'center' }}>Buat Toko Lelangmu Sekarang</h3>
                        <ShopForm />
                    </Menu>
                );
            }
            else {
                return (
                    <div>
                        <Redirect to="/shop">

                        </Redirect>
                    </div>
                )
            }
        }
    }
}

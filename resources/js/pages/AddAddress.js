import React, { PureComponent, Fragment } from 'react'
import {
    Form, Input, Button, Menu, message
} from 'antd';
import Axios from 'axios';
import API from '../api';


class AddAdress extends PureComponent {
    state = {
        confirmDirty: false,
        autoCompleteResult: [],
        loading: false,
        loadingButton: false,
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll(async (err, values) => {
            if (!err) {
                const body = {
                    nama_penerima: values.nickname,
                    no_telepon: values.phone,
                    nama_jalan: values.address,
                    kelurahan: values.kelurahan,
                    kode_pos: values.zipcode
                };
                this.setState({ loadingButton: true });
                try {
                    const data = await Axios.post(API.add_address, body, { headers: { Authorization: localStorage.token } });
                    this.setState({ loadingButton: false });
                    message.success(`Alamat Berhasil Ditambahkan.. Redirect ke halaman Profile dalam 2 detik...`);
                    await new Promise(resolve => { setTimeout(resolve, 2000); });
                    window.location.replace('/profile');
                }
                catch (err) {
                    this.setState({ loadingButton: false });
                    message.error(`Terdapat Kesalahan`);
                    this.setState({ status: true });
                }
            }
        });
    }


    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }

    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('Two passwords that you enter is inconsistent!');
        } else {
            callback();
        }
    }

    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    }


    render() {

        const { getFieldDecorator } = this.props.form;


        return (
            <Fragment>
                <Menu style={{ width: '40%', margin: 'auto', padding: 16, borderRadius: 10 }}>
                    <h1>Tambah Alamat Penerima</h1>
                    <Form onSubmit={this.handleSubmit} style={{ padding: 0 }} >
                        <Form.Item
                            colon={false}
                            label={(
                                <span style={{ fontSize: 20 }}>
                                    Nama Penerima :
                        </span>
                            )}

                            style={{ marginBottom: '0px' }}
                        >
                            {getFieldDecorator('nickname', {
                                rules: [{ required: true, whitespace: true }],
                            })(
                                <Input placeholder={'Nama Penerima'} />
                            )}
                        </Form.Item>
                        <Form.Item
                            colon={false}
                            label={(
                                <span style={{ fontSize: 20 }}>Alamat :</span>
                            )}
                            style={{ marginBottom: '0px' }}
                        >
                            {getFieldDecorator('address', {
                                rules: [{ type: 'string', required: true, message: 'Mohon isi alamat Penerima!' }],
                            })(
                                <Input placeholder={"Masukkan Alamat Penerima"} >

                                </Input>
                            )}
                        </Form.Item>
                        <Form.Item
                            colon={false}
                            style={{ marginBottom: '0px' }}
                            label={(
                                <span style={{ fontSize: 20 }}>Kelurahan :</span>
                            )}        >
                            {getFieldDecorator('kelurahan', {
                                rules: [{ type: 'string', required: true, message: 'Mohon isi kodepos Penerima!' }],
                            })(
                                <Input placeholder={"Masukkan Alamat Penerima"} >

                                </Input>
                            )}
                        </Form.Item>
                        <Form.Item
                            colon={false}
                            style={{ marginBottom: '0px' }}
                            label={(
                                <span style={{ fontSize: 20 }}>Kode Pos :</span>
                            )}        >
                            {getFieldDecorator('zipcode', {
                                rules: [{ type: 'string', required: true, message: 'Mohon isi kodepos Penerima!' }],
                            })(
                                <Input placeholder={"Masukkan KodePos"} >

                                </Input>
                            )}
                        </Form.Item>

                        <Form.Item
                            colon={false}
                            style={{ marginBottom: '0px' }}
                            label={(
                                <span style={{ fontSize: 20 }}>Nomor Telepon :</span>
                            )}        >
                            {getFieldDecorator('phone', {
                                rules: [{ required: true, message: 'Please input your phone number!' }],
                            })(
                                <Input addonBefore={"+62"} style={{ width: '100%' }} />
                            )}
                        </Form.Item>

                        <Form.Item
                            style={{ marginBottom: '0px' }} >
                            <Button block type="primary" htmlType="submit" loading={this.state.loadingButton}>Tambah Alamat</Button>
                        </Form.Item>
                    </Form >
                </Menu>
            </Fragment>
        );
    }
}

const WrappedTambahAlamat = Form.create({ name: 'register' })(AddAdress);
export default WrappedTambahAlamat;

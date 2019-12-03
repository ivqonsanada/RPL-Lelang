import React, { PureComponent } from 'react';
import {
    Upload, Icon, Avatar, message, Row, Col, Card, Button, Skeleton, Tabs
} from 'antd';
import axios from 'axios';

import FormFilled from '../components/FormFilled';
import ActivityList from '../components/ActivityList';
import API from '../api'


export default class UserProfile extends PureComponent {


    state = {
        getData: true,
        email: undefined,
        foto: undefined,
        nama: undefined,
        tanggal_lahir: undefined,
        username: undefined,
        height: 0,
        width: 0,
        upload: undefined,
        uploading: false
    };

    constructor() {
        super();

        window.addEventListener("resize", this.update);
    }

    componentDidMount() {
        this.update();
    }

    update = () => {
        this.setState({
            height: window.innerHeight,
            width: window.innerWidth
        });
    };

    async componentDidMount() {

        const token = localStorage.token;
        const data = await axios.get(API.users, { headers: { Authorization: token } });
        this.setState({
            email: data.data.data.email,
            nama: data.data.data.nama,
            tanggal_lahir: data.data.data.tanggal_lahir,
            username: data.data.data.username,
            foto: data.data.data.foto,
            getData: false

        });
        return (data.data);
    }

    renderTab() {
        return (
            <div>
                <Card style={{ borderRadius: 8, boxShadow: "rgba(0, 0, 0, 0.12) 0px 2px 8px 0px" }}>
                    <Tabs defaultActiveKey="1" tabBarGutter={this.state.width / 40}>
                        <Tabs.TabPane tab="Data Diri" key="1"><FormFilled /></Tabs.TabPane>
                        <Tabs.TabPane tab="List Alamat" key="2">
                            <ActivityList pos={"user"} />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="Barang Lelang Yang Dimenangkan" key="3">
                            <ActivityList pos={"lelang"} />
                        </Tabs.TabPane>
                    </Tabs>
                </Card>
            </div>
        )
    }
    handleUpload = async () => {
        const { upload } = this.state;

        const body = {
            photo: this.state.upload
        }
        const data = await axios.post(API.upload_photo_profile, body, {
            headers: {
                'Authorization': localStorage.token,
            }
        });
        if (data.status === 200) {
            this.setState({
                loading: false
            })
            message.success(`Profile Updated`);
        }
        else {
            this.setState({
                loading: false
            })
            message.error(`Update Gagal`);

        }
    }



    render() {
        const { uploading, upload } = this.state;

        const props = {
            onRemove: (file) => {
                this.setState((state) => {
                    upload: undefined
                });
            },
            beforeUpload: (file) => {
                this.setState(state => ({
                    upload: [file],
                }));
                return false;
            },
            upload,
        };
        if (localStorage.token) {
            return (
                <Row gutter={24}>
                    <Col

                        xl={{ span: 8 }}
                        xxl={{ span: 6 }}
                        style={{ textAlign: 'center' }}
                    >
                        <Card style={{ borderRadius: 8, boxShadow: "rgba(0, 0, 0, 0.12) 0px 2px 8px 0px" }}>
                            <Skeleton loading={this.state.getData} active avatar={{ size: "large" }} paragraph={false} title={false} >
                                <Avatar size={200} src={this.state.foto} />


                            </Skeleton>
                            <Skeleton loading={this.state.getData} active paragraph={false}>
                                <h3 style={{ marginTop: 10 }}>{this.state.nama}</h3>

                            </Skeleton>
                            <Skeleton loading={this.state.getData} active paragraph={false}>
                                <Upload {...props}>
                                    <Button>
                                        <Icon type="upload" /> Pilih Avatar
                                  </Button>
                                </Upload>
                                <Button
                                    type="primary"
                                    onClick={this.handleUpload}
                                    disabled={this.state.upload === undefined}
                                    loading={this.state.uploading}
                                    style={{ marginTop: 16 }}
                                >
                                    {this.state.uploading ? 'Upload Foto...' : 'Upload Foto'}
                                </Button>

                            </Skeleton>

                        </Card>
                    </Col>
                    <Col

                        xl={{ span: 16 }}
                        xxl={{ span: 18 }}
                    >
                        {this.renderTab()}
                    </Col>
                </Row>
            );
        }
        return (
            <h1>Please Login </h1>
        )
    }
}

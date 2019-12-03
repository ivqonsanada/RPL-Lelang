import React, { PureComponent, Fragment } from 'react';
import {
    DatePicker, Icon, message, Card, Spin,Button, Typography,
} from 'antd';
const { Paragraph } = Typography;
import ReactModal from 'react-modal';
import axios from 'axios';

class FormData extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            getData: true,
            email: undefined,
            foto: undefined,
            nama: undefined,
            tanggal_lahir: undefined,
            username: undefined,
        };
    }
    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    }
    async componentDidMount() {

        const token = localStorage.token;
        const data = await axios.get('/api/pengguna', { headers: { Authorization: token } });
        this.setState({
            email: data.data.data.email,
            nama: data.data.data.nama,
            tanggal_lahir: data.data.data.tanggal_lahir,
            temp: undefined,
            username: data.data.data.username,
            foto: data.data.data.foto,
            getData: false,
            visible: false,
            loading: false,
        });
    }

    showDatePicker() {
        this.setState({ visible: true });
    }

    sendData = async () => {
        this.setState({
            loading: true
        })
        const body = {
            nama: this.state.nama,
            email: this.state.email,
            tanggal_lahir: this.state.tanggal_lahir
        }
        const data = await axios.post('/api/perbarui-profil', body, { headers: { Authorization: localStorage.token } });
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
        // console.log(data);
    }

    render() {
        // console.log(this.props.cotext);
        // console.log(this.props.asd);
        if (this.state.getData) {
            return (
                <div>
                    <Spin style={{ marginLeft: '50%' }} />
                </div>
            )
        }



        return (
            <Card style={{ borderRadius: 8, boxShadow: "rgba(0, 0, 0, 0.12) 0px 2px 8px 0px" }}>
                <div style={{ paddingTop: 0 }}>
                    <h5 style={{ fontWeight: 'bold' }}>Username :</h5>
                    <Paragraph style={{ fontSize: 20, marginLeft: '10px' }} >{this.state.username}</Paragraph>
                    <h5 style={{ fontWeight: 'bold' }}>Nama :</h5>
                    <Paragraph style={{ fontSize: 20, marginLeft: '10px' }} editable={{ onChange: (val) => { this.setState({ nama: val }) } }}>{this.state.nama}</Paragraph>
                    <h5 style={{ fontWeight: 'bold' }}>Email :</h5>
                    <Paragraph style={{ fontSize: 20, marginLeft: '10px' }} editable={{ onChange: (val) => { this.setState({ email: val }) } }}>{this.state.email}</Paragraph>
                    <h5 style={{ fontWeight: 'bold' }}>Tanggal Lahir</h5>
                    <div style={{ flexDirection: 'row', display: 'flex' }}>
                        <p style={{ fontSize: 20, marginLeft: '10px' }}>{this.state.tanggal_lahir}</p>
                        <Icon type="edit" theme="twoTone" style={{ fontSize: 20, marginLeft: '0.4rem', display: 'inline-flex' }} onClick={() => this.showDatePicker()} />
                    </div>
                </div>

                <ReactModal
                    isOpen={this.state.visible}
                    contentLabel="Tanggal Lahir"
                    shouldFocusAfterRender={true}
                    shouldCloseOnOverlayClick={false}
                    shouldCloseOnEsc={true}
                    shouldReturnFocusAfterClose={true}
                    onRequestClose={this.handleCancel}
                    style={{
                        overlay: {
                            backgroundColor: 'rgba(0,0,0,0.7)'
                        },
                        content: {
                            borderRadius: '8px',
                            bottom: 'auto',
                            minHeight: '10rem',
                            left: '50%',
                            paddingTop: '0.4rem',
                            paddingLeft: '2rem',
                            paddingBottom: '2rem',
                            paddingRight: '2rem',
                            position: 'fixed',
                            right: 'auto',
                            top: '50%',
                            transform: 'translate(-50%,-50%)',
                            minWidth: '20rem',
                            width: '10%',
                            maxWidth: '20rem',
                            height: '10%',
                            maxHeight: '20rem'
                        }
                    }}
                >
                    <a onClick={this.handleCancel} style={{ marginLeft: '100%' }}>
                        <Icon type="close-circle" style={{ fontSize: 25 }} />
                    </a>
                    <DatePicker onChange={(date, dateString) => this.setState({ temp: dateString })} />
                    <Button onClick={() => {
                        this.setState({ tanggal_lahir: this.state.temp })
                        this.handleCancel()
                    }}> Save Change </Button>
                </ReactModal>
                <div style={{ margin: 'auto' }}>
                    <Button onClick={this.sendData} loading={this.state.loading}>Save Change</Button>
                </div>
            </Card>
        )
    }
}

export default FormData;

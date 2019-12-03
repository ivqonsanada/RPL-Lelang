import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import {
    Avatar, message, Row, Col, Card, List, Button, Skeleton, Typography,
} from 'antd';
const { Paragraph } = Typography;

class ActivityList extends PureComponent {
    state = {
        initLoading: true,
        initLoading2: true,
        loading: false,
        data: [],
        list: [],
        visible: false,
        loadingDelete: false,
        barang: []
    }

    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    }

    handleOk = (e) => {
        //login process here
        this.setState({
            visible: false,
        });
    }

    componentDidMount() {
        this.getData();
        this.getHistory();
    }



    async getData() {
        const token = localStorage.token;
        const data = await axios.get('/api/alamat-pengiriman', { headers: { Authorization: token } });

        this.setState({
            initLoading: false,
            data: data.data.data,
            list: data.data.data,
            loading: false,

        });
        return (data);
    }

    getHistory = async () => {
        const data = await axios.get('/api/histori-transaksi-pengguna', { headers: { Authorization: localStorage.token } });
        this.setState({
            barang: data.data.data,
            initLoading2: false,
        });
    }

    deleteAddres = async (id) => {
        try {
            // console.log(id);
            this.setState({ loading: true });
            const data = await axios.post('/api/hapus-alamat-pengiriman/' + id, {}, { headers: { Authorization: localStorage.token } });
            // console.log(data);
            this.setState({ loading: false });
            message.success(`Alamat Berhasil Dihapus.. `);
            this.getData();
            // await new Promise(resolve => { setTimeout(resolve, 3000); });
            // window.location.replace('/profile');

        }
        catch (err) {
            // console.log(err);
        }
    }
    render() {
        const { initLoading, initLoading2, loading, list, barang } = this.state;
        const loadMore = !initLoading && !loading ? (
            <div style={{
                textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px',
            }}
            >


            </div>
        ) : null;

        switch (this.props.pos) {
            case "user":
                return (
                    <div>
                        <List
                            className="demo-loadmore-list"
                            loading={initLoading}
                            itemLayout="horizontal"
                            dataSource={list}
                            renderItem={item => (
                                <List.Item actions={[]}>
                                    {/* {console.log(item)} */}
                                    <Skeleton avatar title={false} loading={item.loading} active>

                                        <Row gutter={16} style={{ width: '100%' }}>
                                            <Col span={8}>
                                                <Card style={{ borderRadius: 8, boxShadow: "rgba(0, 0, 0, 0.12) 0px 2px 8px 0px", width: '100%' }}>
                                                    <div style={{ paddingTop: 0 }}>

                                                        <h5 style={{ fontWeight: 'bold' }}>Penerima:</h5>
                                                        <Paragraph style={{ fontSize: 20, marginLeft: '10px' }} >{item.nama_penerima}</Paragraph>

                                                        <h5 style={{ fontWeight: 'bold' }}>Alamat:</h5>
                                                        <Paragraph style={{ fontSize: 20, marginLeft: '10px' }} >{item.nama_jalan}</Paragraph>


                                                        <h5 style={{ fontWeight: 'bold' }}>Kelurahan:</h5>
                                                        <Paragraph style={{ fontSize: 20, marginLeft: '10px' }} >{item.kelurahan}</Paragraph>


                                                        <h5 style={{ fontWeight: 'bold' }}>Kode Pos:</h5>
                                                        <Paragraph style={{ fontSize: 20, marginLeft: '10px' }} >{item.kode_pos}</Paragraph>


                                                        <h5 style={{ fontWeight: 'bold' }}>Nomor Telepon:</h5>
                                                        <Paragraph style={{ fontSize: 20, marginLeft: '10px' }} >0{item.no_telepon}</Paragraph>

                                                        <Button onClick={() => { this.deleteAddres(item.id) }} loading={this.state.loading}>Hapus Alamat</Button>
                                                    </div>
                                                </Card>
                                            </Col>

                                        </Row>
                                        {/* </Col>
                                    </Row> */}
                                    </Skeleton>

                                </List.Item>
                            )}
                        />
                        <Link className="ant-btn ant-btn-primary" to="/tambahAlamat">Tambah Alamat</Link>
                    </div>);
            default:
                return (<List
                    className="demo-loadmore-list"
                    loading={initLoading2}
                    itemLayout="horizontal"
                    dataSource={barang}
                    renderItem={item => (
                        <List.Item >
                            {console.log(item)}
                            <Skeleton avatar title={false} loading={item.loading} active>
                                <List.Item.Meta
                                    avatar={<Avatar src={item.barang.foto[0]} />}
                                    title={<Link to={'/checkout#' + item.id}>{item.barang.nama_barang}</Link>}
                                    description={`Rp ${item.barang.max_bid.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}`}
                                />
                            </Skeleton>
                        </List.Item>
                    )}
                />);
        }
    }
}

export default ActivityList;

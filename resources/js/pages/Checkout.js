import React, { Component } from 'react';
import Countdown from 'react-countdown-now';
import { Layout, Row, Col, Steps, Card, Button, Divider, Avatar, Menu, Typography, Spin, Select } from 'antd';

import axios from 'axios';
import API from '../api'

export default class Checkout extends Component {

    state = {
        transaksi: undefined,
        alamat_pengiriman_pemenang: [],
        selected_alamat_pengiriman: 'default',
        alamatIsLoading: true
    };

    componentDidMount() {

        this.fetchTransaksi();

        axios.get(API.alamat_pengiriman, {
            headers: {
                'Authorization': localStorage.token
            }
        }).then((result) => {
            this.setState({ alamat_pengiriman_pemenang: result.data.data, alamatIsLoading: false });
        });
    }

    fetchTransaksi = () => {
        let id = this.props.location.hash.substring(1);
        console.log(API)
        axios.get(API.transaksi + id, {
            headers: {
                'Authorization': localStorage.token
            }
        }).then((result) => {
            this.setState({ transaksi: result.data.data });
        });
    }

    //  fetchAlamatPengirimanPengguna() {
    //   axios.get(`/api/alamat-pengiriman`, {
    //    headers: {
    //     'Authorization': localStorage.token
    //    }
    //   }).then((result) => {
    //    this.setState({ alamat_pengiriman_pemenang: result.data.data });
    //   });
    //  }

    render() {
        if (this.state.transaksi) {
            const Step = Steps.Step;
            const { Title } = Typography;

            var dateStr = '2019-12-02 13:00:00'; //returned from mysql timestamp/datetime field
            var a = dateStr.split(" ");
            var d = a[0].split("-");
            var t = a[1].split(":");
            var formatedDate = new Date(d[0], (d[1] - 1), d[2], t[0], t[1], t[2]);

            const menu = (
                <Menu>
                    <Menu.Item>
                        <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">1st menu item</a>
                    </Menu.Item>
                    <Menu.Item>
                        <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">2nd menu item</a>
                    </Menu.Item>
                    <Menu.Item>
                        <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">3rd menu item</a>
                    </Menu.Item>
                </Menu>
            );

            let { transaksi, selected_alamat_pengiriman } = this.state;
            let { barang, alamat_pengiriman, pengguna } = transaksi;

            // console.log(barang);

            return (
                <Layout>
                    <Title level={1}>{`Transaksi ${barang.nama_barang}`}</Title>
                    {(transaksi.status == 0 || transaksi.status == 1) && (
                        <Row gutter={16} style={{ textAlign: 'center' }}>
                            <h3>
                                {'Batas Pembayaran'}
                            </h3>
                            <Title level={1}>
                                <Countdown date={formatedDate} />
                            </Title>
                        </Row>
                    )}
                    <Row gutter={16} style={{ marginTop: '3%' }}>
                        <Col>
                            <Steps current={this.state.transaksi.status}>
                                <Step title="Menang Lelang" description="Anda telah menangkan lelang barang ini" />
                                <Step title="Verifikasi Data" description="Pilih alamat pengiriman Anda" />
                                <Step title="Pembayaran" description="Lakukan pembayaran ke nomor rekening sebelum tenggat waktu" />
                                <Step title="Pengiriman" description="Barang sedang dalam pengiriman" />
                                <Step title="Selesai" description="Konfirmasi penerimaan barang" />
                            </Steps>
                        </Col>
                    </Row>
                    <Row gutter={16} style={{ marginTop: '1%' }}>
                        <Col xl={16}>
                            <Row gutter={16}>
                                <Card title="Alamat Pengiriman" bordered={false}>
                                    <Select style={{ width: 300 }}
                                        defaultValue={'default'} loading={this.state.alamatIsLoading}
                                        onChange={(selected_alamat) => this.setState({ selected_alamat_pengiriman: selected_alamat })}
                                    >
                                        <Select.Option value={'default'}>
                                            {'Pilih alamat pengiriman'}
                                        </Select.Option>
                                        {this.state.alamat_pengiriman_pemenang.map((element) => (
                                            <Select.Option value={element}>
                                                {`${element.nama_penerima} - ${element.no_telepon} - ${element.nama_jalan}, ${element.kelurahan}, ${element.kode_pos}`}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                    {transaksi.alamat_pengiriman && (
                                        <Row style={{ padding: '16px 0' }}>
                                            <b>{transaksi.alamat_pengiriman.nama_penerima}</b>
                                            <p>{transaksi.alamat_pengiriman.no_telepon}</p>
                                            <p>{`${transaksi.alamat_pengiriman.nama_jalan} - ${transaksi.alamat_pengiriman.kode_pos}`}</p>
                                        </Row>
                                    )}
                                    {transaksi.status == 0 && (
                                        <div>
                                            <Divider />
                                            <Button type="primary" style={{ float: "right" }}
                                                onClick={() => {
                                                    axios.post(`/api/transaksi/${this.props.location.hash.substring(1)}/masukkan-alamat`, {
                                                        'id_alamat_pengiriman': this.state.selected_alamat_pengiriman.id
                                                    }, {
                                                        headers: {
                                                            'Authorization': localStorage.token
                                                        }
                                                    }).then((result) => {

                                                    });
                                                }}
                                            >
                                                {'Ubah Alamat Pengiriman'}
                                            </Button>
                                        </div>
                                    )}
                                </Card>
                            </Row>
                            <Row gutter={16} style={{ marginTop: '1%', marginBottom: '1%' }}>
                                <Card title="Rincian Barang" bordered={false}>
                                    <Col xl={8} style={{ textAlign: 'center' }}>
                                        <Avatar shape="square" size={200} src={barang.foto.length ? barang.foto[0] : 'https://picsum.photos/id/857/500/337'} />
                                    </Col>
                                    <Col xl={16}>
                                        <Row gutter={16}>
                                            <b>{barang.nama_barang}</b>
                                            <p style={{ color: 'orange' }}>{`Rp ${barang.max_bid.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}`}</p>
                                        </Row>
                                        <Divider orientation={'left'}>Deskripsi</Divider>
                                        <Row gutter={16}>
                                            <p dangerouslySetInnerHTML={{ __html: barang.deskripsi }}></p>
                                        </Row>
                                    </Col>
                                    {/* <Col xl={8}>
          <Row gutter={16}>
           <b>Durasi Pengiriman</b>
          </Row>
          <Row gutter={16} style={{ marginTop: '2%' }}>
           <Dropdown overlay={menu}>
            <a className="ant-dropdown-link" href="#">
             Pilih Durasi <Icon type="down" />
            </a>
           </Dropdown>
          </Row>
         </Col> */}
                                </Card>
                            </Row>
                        </Col>
                        <Col xl={8}>
                            <Card title="Ringkasan Belanja" bordered={false}>
                                <Row gutter={16}>
                                    <Col xl={15}>
                                        <p>Total Belanja : </p>
                                    </Col>
                                    <Col xl={9}>
                                        <p>{`Rp ${barang.max_bid.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}`},-</p>
                                    </Col>
                                </Row>
                                <Divider />
                                <Button type="primary" style={{ width: '100%' }}>Lakukan Verifikasi</Button>
                            </Card>
                        </Col>
                    </Row>
                </Layout >
            );
        } else {
            return (
                <Row style={{ textAlign: 'center' }}>
                    <Spin size="large" />
                </Row>
            );
        }
    }
}

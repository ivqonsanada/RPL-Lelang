import React, { Component } from 'react'
import { Layout, Row, Col, Tabs, Comment, Avatar, List, Input, Card, Menu, Typography, Divider, Spin, Skeleton, message, Statistic } from 'antd';
import moment from 'moment';
import { Link } from 'react-router-dom';
import CommentList from '../components/CommentList';
import Editor from '../components/Editor';
import InfiniteScroll from 'react-infinite-scroller';
import ImageGallery from 'react-image-gallery';
import Axios from 'axios';
import API from '../api'

const { Countdown } = Statistic;
const { Title } = Typography;
const { TabPane } = Tabs;

import '../app.css';
import './ItemDetails.css';

const kurirList = [
    {
        "name": "JNE",
        "imgSource": "https://ecs7.tokopedia.net/img/kurir-jne.png"
    },
    {
        "name": "SiCepat",
        "imgSource": "https://ecs7.tokopedia.net/img/kurir-sicepat.png"
    },
    {
        "name": "TiKi",
        "imgSource": "https://ecs7.tokopedia.net/img/kurir-tiki.png"
    },
    {
        "name": "J&T",
        "imgSource": "https://ecs7.tokopedia.net/img/kurir-jnt.png"
    },
    {
        "name": "Pos Indonesia",
        "imgSource": "https://ecs7.tokopedia.net/img/kurir-pos.png"
    }
];

function callback(key) {
    // console.log(key);
}


export default class ItemDetails extends Component {
    state = {
        comments: [],
        chat: [],
        submitting: false,
        value: '',
        data: [],
        load: false,
        loading: false,
        hasMore: true,
        barang: [],
        foto: [],
        dataToko: [],
        penawaran: [],
        user: [],
        loggedin: false,

    }
    handleSubmit = (value) => {
        this.setState({ load: true })
        // console.log(localStorage.token)
        const idBarang = this.state.barang.id;
        const URL = API.penawaran_lelang + idBarang;
        const id = this.props.location.hash.substring(1);
        Axios.post(URL, {
            'penawaran': value
        },
            {
                headers: { Authorization: localStorage.token }
            }).then(ress => {
                // console.log(ress)
                message.success('Sukses Menawar');
                Axios.get(API.barang_detail + id)
                    .then(resss => {
                        this.setState({ penawaran: resss.data.data.penawaran });
                    })
                this.setState({ load: false })
            }).catch(err => {
                message.warning('Masukkan tawaran yang lebih tinggi dan sesuai kelipatan');
                this.setState({ load: false })
            })
    }

    componentDidMount() {
        this.setState({ load: true })
        const id = this.props.location.hash.substring(1);
        Axios.get(API.barang_detail + id)
            .then(ress => {
                this.setState({ barang: ress.data.data });
                this.setState({ penawaran: this.state.barang.penawaran });
                this.setState({ foto: ress.data.data.foto });
                const data = [];
                for (let index = 0; index < this.state.barang.komentar.length; index++) {
                    const element = this.state.barang.komentar[index];
                    data.push({
                        author: element.username_pengguna,
                        avatar: element.pengguna.foto,
                        content: <p>{element.isi}</p>,
                        datetime: moment(element.created_at).format('DD MMMM YYYY, HH:mm:ss'),
                    })
                }

                let finish = (this.state.barang.waktu_akhir == undefined) ? '' : this.state.barang.waktu_akhir;

                let finishDate = Date.parse(finish)

                if (finishDate <= Date.now()) {
                    this.handleFinishLelang();
                }

                this.setState({ comments: data });

                // console.log(this.state.barang)
                Axios.get(API.toko + this.state.barang.id_toko)
                    .then(ress => {
                        this.setState({ dataToko: ress.data.data });
                        // console.log(this.state.dataToko);
                    })
            })
        Axios.get(API.users, { headers: { Authorization: localStorage.token } })
            .then(ress => {
                this.setState({ user: ress.data.data });
                this.setState({ loggedin: true })
                // console.log(this.state.user)
                this.setState({ load: false })
            }).catch(err => {
                this.setState({ load: false })
                // console.log(err);
                this.setState({ loggedin: false })
            })



    }

    handleInfiniteOnLoad = () => {
        let data = this.state.data;
        this.setState({
            loading: true,
        });
        if (data.length > 14) {
            message.warning('Infinite List loaded all');
            this.setState({
                hasMore: false,
                loading: false,
            });
            return;
        }

    }

    handleComment = () => {
        if (!this.state.value) {
            return;
        }

        this.setState({
            submitting: true,
        });
        const id = this.props.location.hash.substring(1);
        Axios.post(API.barang_detail + id + '/komentar', {
            'isi': this.state.value
        }, {
            headers: {
                Authorization: localStorage.token
            }
        }).then(ress => {
            message.success("Komentar terkirim.");
        }).catch(err => {
            message.warning(err);
        })
        setTimeout(() => {
            this.setState({
                submitting: false,
                value: '',
                comments: [
                    {
                        author: this.state.user.username,
                        avatar: this.state.user.foto,
                        content: <p>{this.state.value}</p>,
                        datetime: moment(this.state.created_at).format('DD MMMM YYYY, HH:mm:ss'),
                    },
                    ...this.state.comments,
                ],
            });
        }, 1000);
    }

    handleChange = (e) => {
        this.setState({
            value: e.target.value,
        });
    }

    handleFinishLelang = () => {
        message.warning('Lelang sudah berakhir.');
    }

    render() {
        const { comments, submitting, value, chat } = this.state;
        const { Meta } = Card;
        const start = (this.state.barang.waktu_mulai == undefined) ? '' : this.state.barang.waktu_mulai;
        const finish = (this.state.barang.waktu_akhir == undefined) ? '' : this.state.barang.waktu_akhir;

        let startDate = Date.parse(start)
        let finishDate = Date.parse(finish)

        // if (finishDate <= Date.now()) {
        //     this.handleFinishLelang();
        // }

        const kelipatan = this.state.barang.kelipatan;
        var placeholderTawar = "Masukkan harga penawarannmu " + "(Kelipatan Rp" + kelipatan + ",-)";
        var fotoBarangLelang = this.state.foto.map((foto) => {
            return {
                original: foto,
                thumbnail: foto
            }
        });

        return (
            <Layout>
                <Row gutter={16}>
                    <Col xxl={20} xl={20}>
                        <Row gutter={16}>
                            <Col xxl={9} xl={9} style={{ marginBottom: 12 }}>
                                <Skeleton loading={this.state.load} active>
                                    <Card style={{ borderRadius: 8, boxShadow: "rgba(0, 0, 0, 0.12) 0px 2px 8px 0px", height: "587.5px", }}>
                                        <ImageGallery items={fotoBarangLelang} showFullscreenButton={false} showPlayButton={false} showNav={false} />
                                        <Divider />
                                        <Countdown style={{ textAlign: 'center' }} title="Batas Waktu Lelang" value={finish} onFinish={this.handleFinishLelang} />
                                    </Card>
                                </Skeleton>
                            </Col>
                            <Col xxl={15} xl={15}>
                                <Menu style={{ borderRadius: 8, boxShadow: "rgba(0, 0, 0, 0.12) 0px 2px 8px 0px", padding: 32, marginBottom: 12 }}>
                                    <h2 className={'ant-typography'} style={{ fontWeight: 'lighter', fontSize: 24 }}>{this.state.barang.kategori}</h2>
                                    <h2 className={'ant-typography'} style={{ marginTop: 0, marginBottom: 0, fontWeight: 'bolder', }}>{this.state.barang.nama_barang}</h2>
                                    <h2 className={'ant-typography'} style={{ marginTop: 0 }}>
                                        <Statistic style={{ marginLeft: 20, fontWeight: 'lighter', marginTop: 0 }} value={this.state.barang.bukaan_harga} displayType={'text'} groupSeparator='.' decimalSeparator=',' decimalScale={2} prefix='Rp ' suffix=',-' />
                                    </h2>
                                    <Card bordered >
                                        <h5>Histori Penawaran</h5>
                                        <Row type="flex">

                                            <b style={{ paddingLeft: 30 }}>Penawar</b>
                                            <b style={{ marginLeft: 'auto', paddingRight: 30 }}>Harga Penawaran</b>

                                        </Row>

                                        <div className="demo-infinite-container">
                                            <InfiniteScroll
                                                initialLoad={false}
                                                pageStart={0}
                                                loadMore={this.handleInfiniteOnLoad}
                                                hasMore={!this.state.loading && this.state.hasMore}
                                                useWindow={false}
                                            >
                                                <List
                                                    dataSource={this.state.penawaran}
                                                    renderItem={item => (
                                                        <List.Item key={item.id}>
                                                            <List.Item.Meta
                                                                avatar={<Avatar size={64} src={item.pengguna.foto} />}
                                                                title={item.username_pengguna}
                                                                description={moment(item.created_at).format('DD MMMM YYYY, HH:mm:ss')}
                                                            />
                                                            <div>
                                                                <Statistic valueStyle={{ fontSize: 16 }} style={{ marginLeft: 20, fontWeight: 'lighter', marginTop: 0 }} value={item.harga_penawaran} displayType={'text'} groupSeparator='.' decimalSeparator=',' decimalScale={2} prefix='Rp ' suffix=',-' />
                                                            </div>
                                                        </List.Item>
                                                    )}
                                                >
                                                </List>
                                            </InfiniteScroll>
                                        </div>
                                        <div style={{ textAlign: "center", marginTop: 16 }}>

                                            <Input.Search
                                                placeholder={placeholderTawar}
                                                addonBefore="Rp"
                                                enterButton="Tawar Barang"
                                                size="large"
                                                disabled={this.state.load || ((startDate <= Date.now()) && (finishDate <= Date.now()) || !this.state.loggedin)}
                                                onSearch={(value) => this.handleSubmit(value)}
                                            />
                                            {this.state.load && <Spin />}
                                        </div>
                                    </Card>
                                </Menu>
                            </Col>
                        </Row>
                        <Card style={{ borderRadius: 8, boxShadow: "rgba(0, 0, 0, 0.12) 0px 2px 8px 0px", marginBottom: 12 }}>
                            <Tabs defaultActiveKey="1" onChange={callback}>
                                <TabPane tab="Informasi Produk" key="1">
                                    <Card>
                                        <div dangerouslySetInnerHTML={{ __html: this.state.barang.deskripsi }} />
                                    </Card>,

                            </TabPane>
                                <TabPane tab="Komentar" key="3">
                                    <Card>
                                        {comments.length > 0 && <CommentList comments={comments} />}
                                        <Comment
                                            avatar={(
                                                <Avatar
                                                    src={this.state.user.foto}
                                                    alt={this.state.user.username}
                                                />
                                            )}
                                            content={(
                                                <Editor
                                                    onChange={this.handleChange}
                                                    onSubmit={this.handleComment}
                                                    submitting={submitting}
                                                    value={value}
                                                />
                                            )}
                                        />
                                    </Card>
                                </TabPane>

                            </Tabs>
                        </Card>
                    </Col>
                    <Col xxl={4} xl={4}>
                        <Skeleton loading={this.state.load} active>
                            <Card
                                style={{ borderRadius: 8, boxShadow: "rgba(0, 0, 0, 0.12) 0px 2px 8px 0px" }}
                                cover={<img alt="example" style={{ objectFit: "contain", maxHeight: 200, padding: "24px 24px 0 24px" }} src={this.state.dataToko.foto} />}
                            >
                                <Meta
                                    style={{ textAlign: "center", }}
                                    title={<Link to={'/shop#' + this.state.dataToko.id}><Title level={4}>{this.state.dataToko.nama_toko}</Title></Link>}
                                    description={(
                                        <div style={{ 'marginBottom': 12 }}>
                                            <div>
                                                {this.state.dataToko.nama_jalan + ', ' + this.state.dataToko.kode_pos}
                                            </div>
                                            <Divider orientation="left" style={{ fontSize: 14 }}>
                                                Pengiriman yang didukung
                                            </Divider>
                                            <List
                                                dataSource={kurirList}
                                                renderItem={(item) => (
                                                    <img src={item.imgSource} style={{ height: 48, maxWidth: '100%' }} title={item.name} />
                                                )}
                                            />
                                        </div>
                                    )}
                                />
                            </Card>
                        </Skeleton>
                    </Col>
                </Row>
            </Layout>
        );
    }
}

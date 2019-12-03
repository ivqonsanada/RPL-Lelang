import React, { Component } from 'react';
import { Layout, Spin, List, Card, Divider, Icon } from 'antd';
import { Link } from 'react-router-dom';
import API from '../api'

export default class LandingPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hotItem: [],
            rekomItem: [],
            soldItem: [],
            loading: true,
        }
    }

    componentDidMount() {
        axios.get(API.hot_item)
            .then(ress => {
                // console.log(ress.data)
                const data = [];
                for (let index = 0; index < ress.data.length; index++) {
                    const element = ress.data[index];
                    data.push({
                        id: element.id,
                        title: element.nama_barang,
                        latestBidPrice: element.max_bid,
                        image: (element.foto.length == 0) ? "https://picsum.photos/id/857/500/337" : element.foto[0],
                        openBid: element.bukaan_harga
                    })
                }
                this.setState({ hotItem: data });
            })
        axios.get(API.rekomen)
            .then(ress => {
                const data = [];
                for (let index = 0; index < ress.data.length; index++) {
                    const element = ress.data[index];
                    data.push({
                        id: element.id,
                        title: element.nama_barang,
                        latestBidPrice: element.max_bid,
                        image: (element.foto.length == 0) ? "https://picsum.photos/id/857/500/337" : element.foto[0],
                        openBid: element.bukaan_harga
                    })
                }
                this.setState({ rekomItem: data });
            })
        axios.get(API.sold)
            .then(ress => {
                const data = [];
                for (let index = 0; index < ress.data.length; index++) {
                    const element = ress.data[index];
                    data.push({
                        id: element.id,
                        title: element.nama_barang,
                        latestBidPrice: element.max_bid,
                        image: (element.foto.length == 0) ? "https://picsum.photos/id/857/500/337" : element.foto[0],
                        openBid: element.bukaan_harga
                    })
                }
                this.setState({ loading: false });
                this.setState({ soldItem: data });
            })
    }



    render() {
        if (this.state.loading) {
            return (
                <div style={{ textAlign: 'center' }}>
                    <Spin />
                </div>
            )
        }
        return (
            <Layout>
                <Card style={{ padding: "0 32px", borderRadius: 8, boxShadow: "rgba(0, 0, 0, 0.12) 0px 2px 8px 0px", marginBottom: 24 }}>
                    <Divider orientation="left"><Icon type="fire" style={{ fontSize: 24, display: 'inline-flex' }} theme="twoTone" twoToneColor="#fa541c" /> <b style={{ fontSize: 24 }}>Hot Items</b></Divider>
                    <List
                        grid={{
                            gutter: 16, xs: 1, sm: 2, md: 2, lg: 4, xl: 4, xxl: 4
                        }}
                        dataSource={this.state.hotItem}
                        renderItem={item => (
                            <Link to={'/itemDetails#' + item.id}>
                                <List.Item>
                                    <Card

                                        hoverable
                                        cover={<img alt="barang lelang" style={{ 'objectFit': 'cover', 'maxWidth': '100%', 'maxHeight': 125 }} src={item.image} />}
                                    >
                                        <Card.Meta
                                            title={item.title}
                                            description={
                                                <p style={{ color: 'orange' }}>
                                                    {item.latestBidPrice == 0 ? `Rp ${item.openBid.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')},-` : `Rp ${item.latestBidPrice.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')},-`}
                                                </p>
                                            }
                                        />
                                    </Card>
                                </List.Item>
                            </Link>
                        )}
                    />
                </Card>

                <Card style={{ borderRadius: 8, boxShadow: "rgba(0, 0, 0, 0.12) 0px 2px 8px 0px", marginBottom: 24 }}>
                    <Divider orientation="left"><b style={{ fontSize: 24 }}>Rekomendasi</b></Divider>
                    <List
                        grid={{
                            gutter: 16, xs: 1, sm: 2, md: 2, lg: 4, xl: 4, xxl: 8
                        }}
                        dataSource={this.state.rekomItem}
                        renderItem={item => (
                            <Link to={'/itemDetails#' + item.id}>
                                <List.Item>
                                    <Card
                                        hoverable
                                        cover={<img alt="barang lelang" style={{ 'objectFit': 'cover', 'maxWidth': '100%', 'maxHeight': 125 }} src={item.image} />}
                                    >
                                        <Card.Meta
                                            title={item.title}
                                            description={item.latestBidPrice == 0 ? `Rp ${item.openBid.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')},-` : `Rp ${item.latestBidPrice.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')},-`}
                                        />
                                    </Card>
                                </List.Item>
                            </Link>
                        )}
                    />
                </Card>

                <Card style={{ borderRadius: 8, boxShadow: "rgba(0, 0, 0, 0.12) 0px 2px 8px 0px", }}>
                    <Divider orientation="left"><b style={{ fontSize: 24 }}>Telah dilelang</b></Divider>
                    <List
                        grid={{
                            gutter: 16, xs: 1, sm: 2, md: 2, lg: 4, xl: 4, xxl: 8
                        }}
                        dataSource={this.state.soldItem}
                        renderItem={item => (
                            <Link to={'/itemDetails#' + item.id}>
                                <List.Item>
                                    <Card
                                        hoverable
                                        cover={<img alt="barang lelang" style={{ 'objectFit': 'cover', 'maxWidth': '100%', 'maxHeight': 125 }} src={item.image} />}
                                    >
                                        <Card.Meta
                                            title={item.title}
                                            description={item.latestBidPrice == 0 ? `Rp ${item.openBid.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')},-` : `Rp ${item.latestBidPrice.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')},-`}
                                        />
                                    </Card>
                                </List.Item>
                            </Link>
                        )}
                    />
                </Card>
            </Layout>
        )
    }
}

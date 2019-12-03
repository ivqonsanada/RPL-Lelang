import React, { PureComponent } from 'react';
import { List, Col, Card } from 'antd';
import { Link } from 'react-router-dom';
import API from '../api'

export default class ListBarang extends PureComponent {
    render() {
        const data = [];
        for (let index = 0; index < this.props.data.length; index++) {
            const element = this.props.data[index];
            data.push({
                id: element.id,
                title: element.nama_barang,
                latestBidPrice: element.max_bid,
                image: (element.foto.length == 0) ? "https://picsum.photos/id/857/500/337" : element.foto[0]
            })
        }

        return (
            <Col
                xs={24} sm={24} md={16} lg={18} xl={18} xxl={18}
                style={{ textAlign: 'center' }}
            >
                <List
                    grid={{
                        gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 5
                    }}
                    pagination={false}
                    dataSource={data}
                    renderItem={item => (
                        <Link to={'/itemDetails#' + item.id}>
                            <List.Item>
                                <Card
                                    hoverable
                                    cover={<img alt="example" style={{ 'objectFit': 'cover', 'maxWidth': '100%', 'maxHeight': 125 }} src={item.image} />}
                                >
                                    <Card.Meta
                                        title={item.title}
                                        description={`Rp ${item.latestBidPrice.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')},-`}
                                    />
                                </Card>
                            </List.Item>
                        </Link>
                    )}
                />
            </Col>
        );
    }
}

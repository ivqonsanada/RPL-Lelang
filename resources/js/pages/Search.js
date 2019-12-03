import React, { PureComponent } from 'react';
import { Row, Col, Card } from 'antd';
import ListBarang from '../components/ListBarang';
import axios from 'axios';
import API from '../api'

export default class Search extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            barangToko: []
        }
    }
    componentDidMount() {
        const key = this.props.location.search.substring(9);
        axios.get('/api/cari-barang-lelang?keyword=' + key)
            .then(ress => {
                this.setState({ barangToko: ress.data.data });
                // console.log(this.state.dataToko)
            })
    }
    render() {
        return (
            <Card>
                <Col>
                    <Row type="flex" style={{ paddingBottom: 8 }}>
                        <h1 style={{}} className={'ant-typography'} >Barang yang ditemukan</h1>
                    </Row>
                    <Row type="flex" gutter={16}>
                        <ListBarang data={this.state.barangToko} />
                    </Row>
                </Col>
            </Card>
        );
    }
}

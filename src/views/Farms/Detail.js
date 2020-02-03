import React, {Component} from 'react';
import { connect } from 'react-redux';
import {Card, CardHeader, CardBody, Button, Row, Col, Badge} from 'reactstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import api from '../../redux/api';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


class FarmDetail extends Component {
  constructor(props) {
    super(props);

    this.options = {
      sortIndicator: true,      
      hidePageListOnlyOnePage: true,
      clearSearch: true,
      alwaysShowAllBtns: true,
    }

    this.state = {
      farmData: null,
      farmerList: null,
      processing: false
    }

    this.handleActive = this.handleActive.bind(this);
  }

  componentWillMount() {
    var payload = {
      token: this.props.token,
      farmid: this.props.match.params.id
    };
    var self = this;

    api.POST('farm/getbyid', payload)
      .then(function(res) {
        if (res.data.success) {
          self.setState({ farmData: res.data.results });
        } else {
          self.error('Failed to fetch data. Please try again later...');
        }
      })
      .catch(function(err) {
        self.error('Failed to fetch data. Please try again later...');
      })

    payload = {
      token: this.props.token,
      farmid: this.props.match.params.id
    }
    api.POST('farmowner/get_farmers', payload)
      .then(function(res) {
        if (res.data.success) {
          self.setState({ farmerList: res.data.results });
        } else {
          self.error('Failed to fetch data. Please try again later...');
        }
      })
      .catch(function(err) {
        self.error('Failed to fetch data. Please try again later...');
      })
  }

  warn(str) {
    return toast.warn(str);
  }
  error(str) {
    return toast.error(str);
  }
  success(str) {
    return toast.success(str);
  }

  nameField(cell, row) {
    return(<span>{`${row.fname} ${row.lname}`}</span>);
  }

  addressField(cell, row) {
    return(<span>{row.address}, {row.city}, {row.state} {row.zipcode}</span>);
  }

  handleActive(id, status) {
    this.setState({ processing: true });
    var payload = {
      token: this.props.token,
      id: id,
    }
    if (parseInt(status) === 1) {
      payload['status'] = 0;
    } else {
      payload['status'] = 1;
    }
    var self = this;

    api.POST('farm/update', payload)
      .then(function(res) {
        if (res.data.success) {
          self.setState({ farmData: res.data.results });
        } else {
          self.error('Failed to set status. Please try again later...');
        }
        self.setState({ processing: false })
      })
      .catch(function(err) {
        self.error('Failed to set status. Please try again later...');
        self.setState({ processing: false })
      })
  }

  render() {
    const containerStyle = {
      zIndex: 1999,
      marginTop: 50
    };
    const { farmData, farmerList, processing } = this.state;

    return (
      <div className="animated">
        <ToastContainer position="top-right" autoClose={4000} style={containerStyle}/>
        {!this.state.farmData ? 
          <div className="animated fadeIn pt-3 text-center"><div className="sk-spinner sk-spinner-pulse"></div></div>
        :
          <Card>
            <CardHeader>
              <i className="icon-menu"></i>{farmData.name}'s Information
            </CardHeader>
            <CardBody className="p-5">              
              <Row className="pb-4">
                <Col xs="4" sm="4" md="3" lg="2">
                  <span>Farm Name:</span>                  
                </Col>
                <Col xs="8" sm="8" md="9" lg="10">
                  <span>{farmData.name}</span>
                </Col>
              </Row>
              {farmData.link_url ? 
                <Row className="pb-4">
                  <Col xs="4" sm="4" md="3" lg="2">
                    <span>Farm URL:</span>                  
                  </Col>
                  <Col xs="8" sm="8" md="9" lg="10">
                    <span>{farmData.link_url}</span>
                  </Col>
                </Row>
              :
                ""
              }
              <Row className="pb-4">
                <Col xs="4" sm="4" md="3" lg="2">
                  <span>Address:</span>                  
                </Col>
                <Col xs="8" sm="8" md="9" lg="10">
                  <span>{farmData.address}, {farmData.city}, {farmData.state} {farmData.zipcode}</span>
                </Col>
              </Row>
              <Row className="pb-4">
                <Col xs="4" sm="4" md="3" lg="2">
                  <span>Phone Number:</span>                  
                </Col>
                <Col xs="8" sm="8" md="9" lg="10">
                  <span>{farmData.link_phone}</span>
                </Col>
              </Row>
              <Row className="pb-4">
                <Col xs="4" sm="4" md="3" lg="2">
                  <span>Farmers:</span>                  
                </Col>
                <Col xs="8" sm="8" md="9" lg="10">
                  <BootstrapTable 
                    data={farmerList} 
                    version="4" 
                    bordered={false} 
                    hover 
                    options={this.options}
                  >
                    <TableHeaderColumn dataFormat={this.nameField} dataSort>Name</TableHeaderColumn>
                    <TableHeaderColumn dataFormat={this.addressField} dataSort>Address</TableHeaderColumn>
                    <TableHeaderColumn isKey dataField="email" dataSort>Email</TableHeaderColumn>
                    <TableHeaderColumn dataField="phone" dataSort>Phone Number</TableHeaderColumn>
                  </BootstrapTable>
                </Col>
              </Row>
              <Row className="pb-5">
                <Col xs="4" sm="4" md="3" lg="2">
                  <span>Status:</span>                  
                </Col>
                <Col xs="8" sm="8" md="9" lg="10">
                  {parseInt(farmData.status) === 0 ? <Badge color="warning">Inactive</Badge> : <Badge color="info">Active</Badge>}
                </Col>
              </Row>
              <Row>
                <Col xs="12" sm="12" md="12" lg="12">
                  <Button 
                    className="mr-4" 
                    color="warning" 
                    disabled={parseInt(farmData.status) === 0 ? true : false || processing} 
                    onClick={ () => this.handleActive(this.props.match.params.id, farmData.status) }
                    style={{float: 'right'}}
                  >
                    <i className="fa fa-bell-slash-o"> Inactive</i>
                  </Button>
                  <Button 
                    className="mr-4" 
                    color="info" 
                    disabled={parseInt(farmData.status) === 1 ? true : false || processing} 
                    onClick={ () => this.handleActive(this.props.match.params.id, farmData.status) }
                    style={{float: 'right'}}
                  >
                    <i className="fa fa-bell-o"> Active</i>
                  </Button>
                </Col>
              </Row>
            </CardBody>
          </Card>
        }        
      </div>
    );
  }
}

export default connect(
  state => ({
    token: state.Auth.idToken
  }),
  {}
)(FarmDetail);

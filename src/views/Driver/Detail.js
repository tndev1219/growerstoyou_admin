import React, {Component} from 'react';
import { connect } from 'react-redux';
import {Card, CardHeader, CardBody, Button, Row, Col, Badge} from 'reactstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import api from '../../redux/api';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


class DriverDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      driverData: null,
      processing: false
    }

    this.handleActive = this.handleActive.bind(this);
  }

  componentWillMount() {
    var payload = {
      token: this.props.token,
      userid: this.props.match.params.id
    };
    var self = this;

    api.POST('admin/getuserbyid', payload)
      .then(function(res) {
        if (res.data.success) {
          self.setState({ driverData: res.data.results });
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
      userid: id,
    }
    if (parseInt(status) === 1) {
      payload['status'] = 2;
    } else {
      payload['status'] = 1;
    }
    var self = this;

    api.POST('admin/setstatus', payload)
      .then(function(res) {
        if (res.data.success) {
          self.setState({ driverData: res.data.results });
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
    const { driverData, processing } = this.state;

    return (
      <div className="animated">
        <ToastContainer position="top-right" autoClose={4000} style={containerStyle}/>
        {!this.state.driverData ? 
          <div className="animated fadeIn pt-3 text-center"><div className="sk-spinner sk-spinner-pulse"></div></div>
        :
          <Card>
            <CardHeader>
              <i className="icon-menu"></i>{driverData.fname} {driverData.lname}'s Information
            </CardHeader>
            <CardBody className="p-5">   
              <Row>
                <Col xs="12" sm="3" md="3" lg="2" className="mb-4">
                  {driverData.avatar ? 
                    <img src={`https://growertoyou-dev.s3.amazonaws.com/public/${driverData.avatar}`} alt="avatar" style={{width: '80%', borderRadius: 200, margin: "auto", display: 'block'}} />
                  :
                    <img src={require(`../../assets/img/avatars/17.png`)} style={{width: '80%', borderRadius: 200, margin: "auto", display: 'block'}}></img>
                  }
                </Col>
                <Col xs="12" sm="9" md="9" lg="10">
                  <Row className="pb-4">
                    <Col xs="4" sm="4" md="3" lg="3">
                      <span>Name:</span>                  
                    </Col>
                    <Col xs="8" sm="8" md="9" lg="9">
                      <span>{driverData.fname} {driverData.lname}</span>
                    </Col>
                  </Row>
                  <Row className="pb-4">
                    <Col xs="4" sm="4" md="3" lg="3">
                      <span>Address:</span>                  
                    </Col>
                    <Col xs="8" sm="8" md="9" lg="9">
                      <span>{driverData.address}, {driverData.city}, {driverData.state} {driverData.zipcode}</span>
                    </Col>
                  </Row>
                  <Row className="pb-4">
                    <Col xs="4" sm="4" md="3" lg="3">
                      <span>Email:</span>                  
                    </Col>
                    <Col xs="8" sm="8" md="9" lg="9">
                      <span>{driverData.email}</span>
                    </Col>
                  </Row>
                  <Row className="pb-4">
                    <Col xs="4" sm="4" md="3" lg="3">
                      <span>Phone Number:</span>                  
                    </Col>
                    <Col xs="8" sm="8" md="9" lg="9">
                      <span>{driverData.phone}</span>
                    </Col>
                  </Row>
                  <Row className="pb-4">
                    <Col xs="4" sm="4" md="3" lg="3">
                      <span>License Number:</span>                  
                    </Col>
                    <Col xs="8" sm="8" md="9" lg="9">
                      <span>{driverData.driverinfo.license_number}</span>
                    </Col>
                  </Row>
                  <Row className="pb-4">
                    <Col xs="4" sm="4" md="3" lg="3">
                      <span>Issued Date:</span>                  
                    </Col>
                    <Col xs="8" sm="8" md="9" lg="9">
                      <span>{driverData.driverinfo.issued_date}</span>
                    </Col>
                  </Row>
                  <Row className="pb-4">
                    <Col xs="4" sm="4" md="3" lg="3">
                      <span>Expiry Date:</span>                  
                    </Col>
                    <Col xs="8" sm="8" md="9" lg="9">
                      <span>{driverData.driverinfo.expired_date}</span>
                    </Col>
                  </Row>
                  <Row className="pb-4">
                    <Col xs="4" sm="4" md="3" lg="3">
                      <span>License Address:</span>                  
                    </Col>
                    <Col xs="8" sm="8" md="9" lg="9">
                      <span>{driverData.driverinfo.address}, {driverData.driverinfo.city}, {driverData.driverinfo.state} {driverData.driverinfo.zipcode}</span>
                    </Col>
                  </Row>
                  <Row className="pb-4">
                    <Col xs="4" sm="4" md="3" lg="3">
                      <span>License Image:</span>                  
                    </Col>
                    <Col xs="8" sm="8" md="9" lg="9">
                      <img 
                        src={`https://growertoyou-dev.s3.amazonaws.com/public/${driverData.driverinfo.license_id}`} 
                        alt="license-image" 
                        style={{width: '90%'}} 
                      />
                    </Col>
                  </Row>
                  <Row className="pb-4">
                    <Col xs="4" sm="4" md="3" lg="3">
                      <span>Status:</span>                  
                    </Col>
                    <Col xs="8" sm="8" md="9" lg="9">
                      {parseInt(driverData.status) === 2 ? 
                        <Badge color="warning">Inactive</Badge> 
                      : 
                        parseInt(driverData.status) === 1 ? 
                          <Badge color="info">Active</Badge>
                        :
                          <Badge color="secondary">Pending</Badge>
                      }
                    </Col>
                  </Row>
                  <Row>
                    <Col xs="12" sm="12" md="12" lg="12">
                      <Button 
                        className="mr-4" 
                        color="warning" 
                        disabled={parseInt(driverData.status) === 2 ? true : false || processing} 
                        onClick={ () => this.handleActive(this.props.match.params.id, driverData.status) }
                        style={{float: 'right'}}
                      >
                        <i className="fa fa-bell-slash-o"> Inactive</i>
                      </Button>
                      <Button 
                        className="mr-4" 
                        color="info" 
                        disabled={parseInt(driverData.status) === 1 ? true : false || processing} 
                        onClick={ () => this.handleActive(this.props.match.params.id, driverData.status) }
                        style={{float: 'right'}}
                      >
                        <i className="fa fa-bell-o"> Active</i>
                      </Button>
                    </Col>
                  </Row>
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
)(DriverDetail);

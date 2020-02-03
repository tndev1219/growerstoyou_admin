import React, {Component} from 'react';
import { connect } from 'react-redux';
import {Card, CardHeader, CardBody, Button, Badge} from 'reactstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import api from '../../redux/api';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


class Farms extends Component {
  constructor(props) {
    super(props);

    this.options = {
      sortIndicator: true,      
      hidePageListOnlyOnePage: true,
      clearSearch: true,
      alwaysShowAllBtns: true,
      onRowClick: this.onRowClick.bind(this)
    }

    this.state = {
      farmsData: null,
      processing: false
    }

    this.actionField = this.actionField.bind(this);
    this.handleActive = this.handleActive.bind(this);
  }

  componentWillMount() {
    var self = this;
    api.POST('farm/getall')
      .then(function(res) {
        if (res.data.success) {
          self.setState({ farmsData: res.data.results });
        } else {
          self.error('Failed to fetch data. Please try again later...');
        }
      })
      .catch(function(err) {
        self.error('Failed to fetch data. Please try again later...');
      })
  }

  onRowClick(row) {
    this.props.history.push(`/farms/${row.id}`);
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

  addressField(cell, row) {
    return(<span>{`${row.address}, ${row.city}, ${row.state} ${row.zipcode}`}</span>);
  }

  statusField(cell, row) {
    if (parseInt(row.status) === 1) {
      return(<Badge color="info">Active</Badge>);
    } else {
      return (<Badge color="warning">Inactive</Badge>);
    }
  }

  actionField(cell, row) {
    if (parseInt(row.status) === 0) {
      return (
        <Button size="sm" color="info" disabled={this.state.processing} onClick={ () => this.handleActive(row.id, row.status) }><i className="fa fa-bell-o"> Active</i></Button>
      )
    } else {
      return (
        <Button size="sm" color="warning" disabled={this.state.processing} onClick={ () => this.handleActive(row.id, row.status) }><i className="fa fa-bell-slash-o"> Inactive</i></Button>
      )
    }    
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
          var farmsData = self.state.farmsData;
          for (var i = 0; i < farmsData.length; i++) {
            if (farmsData[i].id === id) {
              farmsData[i].status = payload.status;
            }
          }
          self.setState({ farmsData });
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

    return (
      <div className="animated">
        <ToastContainer position="top-right" autoClose={4000} style={containerStyle}/>
        {!this.state.farmsData ? 
          <div className="animated fadeIn pt-3 text-center"><div className="sk-spinner sk-spinner-pulse"></div></div>
        :
          <Card>
            <CardHeader>
              <i className="icon-menu"></i>Farms{' '}
            </CardHeader>
            <CardBody>
              <BootstrapTable 
                data={this.state.farmsData} 
                version="4" 
                bordered={false} 
                hover 
                pagination 
                search 
                options={this.options}
              >
                <TableHeaderColumn isKey dataField="name" dataSort>Farm Name</TableHeaderColumn>
                <TableHeaderColumn dataField="link_url" dataSort>Farm URL</TableHeaderColumn>
                <TableHeaderColumn dataFormat={this.addressField} width='25%' dataSort>Farm Address</TableHeaderColumn>
                <TableHeaderColumn dataField="link_phone" dataSort>Phone Number</TableHeaderColumn>
                <TableHeaderColumn dataField="status" dataFormat={this.statusField} dataSort>Status</TableHeaderColumn>
                <TableHeaderColumn dataAlign="center" dataFormat={this.actionField}>Actions</TableHeaderColumn>
              </BootstrapTable>
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
)(Farms);

import React, {Component} from 'react';
import { connect } from 'react-redux';
import {Card, CardHeader, CardBody, Button, Badge} from 'reactstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import api from '../../redux/api';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


class ActiveDriver extends Component {
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
      driverData: null,
      processing: false
    }

    this.actionField = this.actionField.bind(this);
    this.handleActive = this.handleActive.bind(this);
  }

  componentWillMount() {
    var payload = {
      token: this.props.token,
      role: 4, // driver role
      status: 1 // active status
    }
    var self = this;
    api.POST('admin/getuserbyrolestatus', payload)
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

  onRowClick(row) {
    this.props.history.push(`/active-drivers/${row.id}`);
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

  licenseNoField(cell, row) {
    return (<span>{row.driverinfo.license_number}</span>)
  }

  expiredDateField(cell, row) {
    return (<span>{row.driverinfo.expired_date.split(' ')[0]}</span>)
  }

  userNameField(cell, row) {
    return(<span>{`${row.fname} ${row.lname}`}</span>);
  }

  addressField(cell, row) {
    return(<span>{`${row.address}, ${row.city}, ${row.state} ${row.zipcode}`}</span>);
  }

  statusField(cell, row) {
    return(<Badge color="info">Active</Badge>);
  }

  actionField(cell, row) {
    return (
      <Button size="sm" color="warning" disabled={this.state.processing} onClick={ () => this.handleActive(row.id) }><i className="fa fa-bell-slash-o"> Inactive</i></Button>
    )
  }

  handleActive(id) {
    this.setState({ processing: true });
    var payload = {
      token: this.props.token,
      userid: id,
      status: 2 // from active status to inactive status
    }
    var self = this;
    
    api.POST('admin/setstatus', payload)
      .then(function(res) {
        if (res.data.success) {
          var driverData = self.state.driverData;
          var newDriverData = driverData.filter(driver => driver.id !== id);

          self.setState({ driverData: newDriverData });
        } else {
          self.error('Failed to set status. Please try again later...');
        }
        self.setState({ processing: false });
      })
      .catch(function(err) {
        self.error('Failed to set status. Please try again later...');
        self.setState({ processing: false });
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
        {!this.state.driverData ? 
          <div className="animated fadeIn pt-3 text-center"><div className="sk-spinner sk-spinner-pulse"></div></div>
        :
          <Card>
            <CardHeader>
              <i className="icon-menu"></i>Active Drivers{' '}
            </CardHeader>
            <CardBody>
              <BootstrapTable 
                data={this.state.driverData} 
                version="4" 
                bordered={false}
                hover 
                pagination 
                search 
                options={this.options}
              >
                <TableHeaderColumn dataFormat={this.userNameField} dataSort>User Name</TableHeaderColumn>
                <TableHeaderColumn isKey dataField="email" dataSort>Email</TableHeaderColumn>
                <TableHeaderColumn dataFormat={this.addressField} dataSort width='25%'>Address</TableHeaderColumn>
                <TableHeaderColumn dataField="phone" dataSort>Phone Number</TableHeaderColumn>
                <TableHeaderColumn dataFormat={this.licenseNoField} dataSort>License Number</TableHeaderColumn>
                <TableHeaderColumn dataFormat={this.expiredDateField}>Expiry Date</TableHeaderColumn>
                <TableHeaderColumn dataFormat={this.statusField}>Status</TableHeaderColumn>
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
)(ActiveDriver);

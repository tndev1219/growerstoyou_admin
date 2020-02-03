import React, {Component} from 'react';
import { connect } from 'react-redux';
import {Card, CardHeader, CardBody, Button, Input} from 'reactstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import api from '../../redux/api';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


class Transaction extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      transactionData: null,
      processing: false,
      keyword: '',
      offset: 0,
      limit: 10,
      pageNumber: 1
    }
    this.options = {
      sortIndicator: true,      
      hidePageListOnlyOnePage: true,
      clearSearch: true,
      alwaysShowAllBtns: true,
      onRowClick: this.onRowClick.bind(this),
      onPageChange: this.onPageChange.bind(this)
    }
    this.getTransactionData = this.getTransactionData.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.search = this.search.bind(this);
  }

  componentWillMount() {
    var payload = {
      token: this.props.token,
      offset: this.state.offset,
      limit: this.state.limit,
      keyword: this.state.keyword
    }
    var self = this;
    api.POST('transaction/getall', payload)
      .then(function(res) {
        if (res.data.success) {
          for (var i = 0; i < res.data.allcount-self.state.limit; i++) {
            res.data.results.push({});
          }
          self.setState({ transactionData: res.data.results });
        } else {
          self.error('Failed to fetch data. Please try again later...');
        }
      })
      .catch(function(err) {
        self.error('Failed to fetch data. Please try again later...');
      })
  }

  onRowClick(row) {
    // console.log('click row', row)
  }

  handleChange(e) {
    this.setState({ keyword: e.target.value });
  }

  search() {
    this.setState({ pageNumber: 1, transactionData: null }, function() {
      this.getTransactionData();
    });
  }

  onPageChange = (page, sizePerPage) => {
    this.setState({ offset: (page-1)*sizePerPage, limit: sizePerPage, transactionData: null, pageNumber: page }, function() {
      this.getTransactionData();
    });
  }

  getTransactionData() {
    var payload = {
      token: this.props.token,
      offset: this.state.offset,
      limit: this.state.limit,
      keyword: this.state.keyword
    }
    var self = this;
    api.POST('transaction/getall', payload)
      .then(function(res) {
        if (res.data.success) {
          for (var i = 0; i < res.data.results.length; i++) {
            res.data.results[i].no = res.data.results[i].no + self.state.offset;
          }
          for (i = 0; i < self.state.offset; i++) {
            res.data.results.unshift({no: i});
          }
          for (i = 0; i < res.data.allcount-self.state.offset-self.state.limit; i++) {
            res.data.results.push({no: i});
          }

          self.options['page'] = self.state.pageNumber;
          self.options['sizePerPage'] = self.state.limit;
          self.setState({ transactionData: res.data.results });
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

  render() {
    const containerStyle = {
      zIndex: 1999,
      marginTop: 50
    };

    return (
      <div className="animated">
        <ToastContainer position="top-right" autoClose={4000} style={containerStyle}/>
        {!this.state.transactionData ? 
          <div className="animated fadeIn pt-3 text-center"><div className="sk-spinner sk-spinner-pulse"></div></div>
        :
          <Card>
            <CardHeader>
              <i className="icon-menu"></i>Transaction{' '}
            </CardHeader>
            <CardBody>
              <div className="mb-3" style={{display: 'flex', float: 'right'}}>
                <Input 
                  type="text" 
                  value={this.state.keyword}
                  placeholder="Customer Name or Farm Name" 
                  className="mr-2" 
                  onChange={this.handleChange} 
                  style={{width: 300}} 
                />
                <Button onClick={this.search}>Search</Button>
              </div>
              <BootstrapTable 
                data={this.state.transactionData} 
                version="4" 
                bordered={false} 
                hover 
                pagination 
                options={this.options} 
                containerStyle={{clear: 'both'}} 
              >
                <TableHeaderColumn isKey dataField="no" searchable={false}>No</TableHeaderColumn>
                <TableHeaderColumn dataField="customername">Customer Name</TableHeaderColumn>
                <TableHeaderColumn dataField="farmname">Farm Name</TableHeaderColumn>
                <TableHeaderColumn dataField="amount" searchable={false}>Amount</TableHeaderColumn>
                <TableHeaderColumn dataField="currency" searchable={false}>Currency</TableHeaderColumn>
                <TableHeaderColumn dataField="date" searchable={false}>Date</TableHeaderColumn>
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
)(Transaction);

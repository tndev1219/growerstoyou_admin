import React, { Component } from 'react';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import { Button } from 'reactstrap'
import data from './_data';

class Category extends Component {

  constructor(props) {
    super(props)
    this.table = data.rows;
    this.options = {
      sortIndicator: true,      
      hidePageListOnlyOnePage: true,
      clearSearch: true,
      alwaysShowAllBtns: true
    }
  }

  componentDidMount() {
    
  }

  actionField(cell, row) {
    return (
      <Button >Delete</Button>
    )
  }

  render() {
    return(
      <div>
        <BootstrapTable data={this.table} version="4" striped search options={this.options} insertRow deleteRow>
          <TableHeaderColumn dataField="name" dataSort>Name</TableHeaderColumn>
          <TableHeaderColumn isKey dataField="email">Email</TableHeaderColumn>
          <TableHeaderColumn dataField="age" dataSort>Age</TableHeaderColumn>
          <TableHeaderColumn dataField="city" dataSort>City</TableHeaderColumn>
          <TableHeaderColumn dataField="button" dataFormat={this.actionField}>Actions</TableHeaderColumn>
        </BootstrapTable>
      </div>
    )
  }

}

export default Category
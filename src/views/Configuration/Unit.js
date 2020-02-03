import React, { Component } from 'react';
import { connect } from 'react-redux';
import {BootstrapTable, TableHeaderColumn, InsertModalHeader, InsertModalFooter, InsertButton} from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import { Button, Input } from 'reactstrap';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import $ from 'jquery';
import 'bootstrap';
import api from '../../redux/api';

class Unit extends Component {

  constructor(props) {
    super(props)
    this.options = {
      sortIndicator: true,      
      hidePageListOnlyOnePage: true,
      clearSearch: true,
      alwaysShowAllBtns: true,
      insertModalFooter: this.createCustomModalFooter,
      insertModalHeader: this.createCustomModalHeader,
      insertBtn: this.createCustomInsertButton
    }
    this.state = {
      fields: {},
      errors: {},
      uploading: false,
      unitData: [],
      createOrUpdate: true,
      updateId: null
    }
    this._formIsValid = false;
    this.beforeSave = this.beforeSave.bind(this);
    this.beforeClose = this.beforeClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.handleInsertButtonClick = this.handleInsertButtonClick.bind(this);
    this.actionField = this.actionField.bind(this);
  }

  componentWillMount() {
    var self = this;
    api.POST('unit/getall', { token: self.props.token })
      .then(function(res) {
        if (res.data.success) {
          self.setState({ unitData: res.data.results });
        } else {
          self.warn('Failed to Load Data. Please try again later...');
        }
      })
      .catch(function(err) {
        // console.log(err)
        self.warn('Failed to Load Data. Please try again later...');
      })
  }

  componentDidMount() {
    var self = this;
    $(document).click(function(e) {
      if ($(e.target).find('.react-bs-insert-modal').length !== 0) {
        self.beforeClose();
      }
  });
  }

  actionField(cell, row) {
    return (
      <>
        <Button size="sm" className="mr-2" disabled={this.state.uploading} color="info" onClick={ () => this.handleEdit(row) }><i className="fa fa-pencil"></i></Button>
        <Button size="sm" color="warning" disabled={this.state.uploading} onClick={ () => this.handleDelete(row.id, row.image) }><i className="fa fa-trash"></i></Button>
      </>
    )
  }

  handleChange(e) {
    var fields = this.state.fields;
    fields[e.target.name] = e.target.value;
  }

  handleEdit(row) {
    var fields = this.state.fields;
    fields['name'] = row.name;
    this.setState({ fields, createOrUpdate: false, updateId: row.id });
    $('.unit-add-btn').trigger('click');
  }

  handleDelete(id) {
    var payload = {
      token: this.props.token,
      unitid: id
    };

    this.setState({ uploading: true });

    var self = this;
    api.POST('unit/delete', payload)
      .then(function(res) {
        if (res.data.success) {
          self.success('Success!');
          api.POST('unit/getall', { token: self.props.token })
            .then(function(res) {
              if (res.data.success) {
                self.setState({ unitData: res.data.results, uploading: false });
              }
            })
        } else {
          self.warn('Failed to delete unit. Please try again later...');
        }
      })
      .catch(function(err) {
        // console.log(err)
        self.warn('Failed to delete unit. Please try again later...');
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

  customNameField = (column, attr, editorClass, ignoreEditable) => {
    return (
      <Input 
        type="text" 
        name="name" 
        column="name" 
        placeholder="name" 
        defaultValue={this.state.fields['name']} 
        invalid={this.state.errors['name']} 
        onChange={this.handleChange}/>
    )
  }
  
  beforeClose(e) {
    var fields = this.state.fields;
    fields['name'] = '';
    this.setState({ fields, uploading: false, createOrUpdate: true, updateId: null });
  }
  
  beforeSave(e) {
    var fields = this.state.fields;
    var errors = this.state.errors;
    this._formIsValid = true;
    if (!fields['name'] || fields['name'] === '') {
      errors['name'] = true;
      this._formIsValid = false;
      this.setState({ errors });
    } else {
      errors['name'] = false;
      this.setState({ errors });
    }
  }
  
  handleModalClose(closeModal) {
    closeModal();
  }
  
  handleSave(closeModal) {
    if (!this._formIsValid) {
      this.warn('Please input the correct value...');
    } else {
      var payload = {
        token: this.props.token,
        unitid: this.state.updateId,
        name: this.state.fields['name']
      };
      this.setState({ uploading: true });
      var self = this;
      if (this.state.createOrUpdate) {
        api.POST('unit/add', payload)
          .then(function(res) {
            if (res.data.success) {
              api.POST('unit/getall', { token: self.props.token })
              .then(function(res) {
                if (res.data.success) {
                  self.setState({ unitData: res.data.results });
                }
              })
            } else {
              self.warn('Failed to add unit. Please try again later...');  
            }          
            self.beforeClose();
            closeModal();
          }) 
          .catch(function(err) {
            self.beforeClose();
            closeModal();
            self.warn('Failed to add unit. Please try again later...');
          })        
      } else {
        api.POST('unit/update', payload)
          .then(function(res) {
            if (res.data.success) {
              api.POST('unit/getall', { token: self.props.token })
              .then(function(res) {
                if (res.data.success) {
                  self.setState({ unitData: res.data.results });
                }
              })
            } else {
              self.warn('Failed to update unit. Please try again later...');  
            }          
            self.beforeClose();
            closeModal();
          }) 
          .catch(function(err) {
            self.beforeClose();
            closeModal();
            self.warn('Failed to update unit. Please try again later...');
          })        
      }
    }
  }

  handleInsertButtonClick(onClick) {
    onClick();
  }

  createCustomModalHeader = (closeModal, save) => {
    return (
      this.state.createOrUpdate ?
        <InsertModalHeader
          title='Add Unit'
          beforeClose={ this.beforeClose }
          onModalClose={ () => this.handleModalClose(closeModal) }/>
      :
        <InsertModalHeader
          title='Update Unit'
          beforeClose={ this.beforeClose }
          onModalClose={ () => this.handleModalClose(closeModal) }/>
    );
  }
  
  createCustomModalFooter = (closeModal, save) => {
    return (
      this.state.uploading ? 
        <div className="sk-wave">
          <div className="sk-rect sk-rect1"></div>&nbsp;
          <div className="sk-rect sk-rect2"></div>&nbsp;
          <div className="sk-rect sk-rect3"></div>&nbsp;
          <div className="sk-rect sk-rect4"></div>&nbsp;
          <div className="sk-rect sk-rect5"></div>
        </div>
      :
        this.state.createOrUpdate ?
          <InsertModalFooter
            className='my-custom-class'
            saveBtnText='Save'
            closeBtnText='Cancel'
            closeBtnContextual='btn-warning'
            saveBtnContextual='btn-success'
            closeBtnClass='my-close-btn-class'
            saveBtnClass='my-save-btn-class'
            beforeClose={ this.beforeClose }
            beforeSave={ this.beforeSave }
            onModalClose={ () => this.handleModalClose(closeModal) }
            onSave={ () => this.handleSave(closeModal) }/>
        :
          <InsertModalFooter
            className='my-custom-class'
            saveBtnText='Update'
            closeBtnText='Cancel'
            closeBtnContextual='btn-warning'
            saveBtnContextual='btn-success'
            closeBtnClass='my-close-btn-class'
            saveBtnClass='my-save-btn-class'
            beforeClose={ this.beforeClose }
            beforeSave={ this.beforeSave }
            onModalClose={ () => this.handleModalClose(closeModal) }
            onSave={ () => this.handleSave(closeModal) }/>
    );
  }

  createCustomInsertButton = (onClick) => {
    return (
      <InsertButton
        btnText='New'
        btnContextual='btn-info'
        className='unit-add-btn'
        btnGlyphicon='fa glyphicon glyphicon-plus fa-plus'
        onClick={ () => this.handleInsertButtonClick(onClick) }/>
    );
  }

  render() {
    const containerStyle = {
      zIndex: 1999,
      marginTop: 50
    };

    return(
      <div>
        <ToastContainer position="top-right" autoClose={4000} style={containerStyle}/>
        <BootstrapTable data={this.state.unitData} version="4" bordered={false} search options={this.options} insertRow>
          <TableHeaderColumn isKey dataField="name" dataSort customInsertEditor={{ getElement: this.customNameField }}>Name</TableHeaderColumn>
          <TableHeaderColumn dataAlign="center" dataFormat={this.actionField}>Actions</TableHeaderColumn>
        </BootstrapTable>
      </div>
    )
  }
}

export default connect(
  state => ({
    token: state.Auth.idToken
  }), {})(Unit);
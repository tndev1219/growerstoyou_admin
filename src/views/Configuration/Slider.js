import React, { Component } from 'react';
import {BootstrapTable, TableHeaderColumn, InsertModalHeader, InsertModalFooter, InsertButton} from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import { Button, Input } from 'reactstrap';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import $ from 'jquery';
import 'bootstrap';
import api from '../../redux/api';
import { PhotoPicker } from 'aws-amplify-react';
import Amplify, { Storage } from 'aws-amplify';
import awsconfig from '../../aws-exports';
Amplify.configure(awsconfig);

class Slider extends Component {

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
      imageUploading: false,
      sliderData: null,
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
    this.imageField = this.imageField.bind(this);
  }

  componentWillMount() {
    var self = this;
    api.POST('introduction/getall')
      .then(function(res) {
        if (res.data.success) {
          self.setState({ sliderData: res.data.results });
        } else {
          self.warn('Failed to Load Data, Try again later...');
        }
      })
      .catch(function(err) {
        // console.log(err)
        self.warn('Failed to Load Data, Try again later...');
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

  imageField(cell, row) {
    return (
      <img src={`https://growertoyou-dev.s3.amazonaws.com/public/${cell}`} height="28" alt="slider-img" />
    )
  }
  actionField(cell, row) {
    return (
      <>
        <Button size="sm" className="mr-2" disabled={this.state.imageUploading} color="info" onClick={ () => this.handleEdit(row) }><i className="fa fa-pencil"></i></Button>
        <Button size="sm" color="warning" disabled={this.state.imageUploading} onClick={ () => this.handleDelete(row.id, row.image) }><i className="fa fa-trash"></i></Button>
      </>
    )
  }

  handleChange(e) {
    var fields = this.state.fields;
    fields[e.target.name] = e.target.value;
  }

  handleEdit(row) {
    var fields = this.state.fields;
    fields['title'] = row.title;
    fields['subtitle'] = row.subtitle;
    fields['description'] = row.description;
    this.setState({ fields, createOrUpdate: false, updateId: row.id });
    $('.slider-add-btn').trigger('click');
  }

  handleDelete(id, image) {
    var payload = {
      id: id
    };
    var imageName = image;

    this.setState({ imageUploading: true });

    var self = this;
    api.POST('introduction/delete', payload)
      .then(function(res) {
        if (res.data.success) {
          self.success('Success!');
          api.POST('introduction/getall')
            .then(function(res) {
              if (res.data.success) {
                self.setState({ sliderData: res.data.results, imageUploading: false });
              }
            })
          Storage.remove(imageName)
            .then(result => console.log("result", result))
            .catch(err => console.log("err", err));
        } else {
          self.warn('Failed to delete slider. Try again later...');
        }
      })
      .catch(function(err) {
        // console.log(err)
        self.warn('Failed to delete slider. Try again later...');
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

  pad(n) {
    return n<10 ? '0'+n : n;
  }

  customTitleField = (column, attr, editorClass, ignoreEditable) => {
    return (
      <Input 
        type="text" 
        name="title" 
        column="title" 
        placeholder="Title" 
        defaultValue={this.state.fields['title']} 
        invalid={this.state.errors['title']} 
        onChange={this.handleChange}/>
    )
  }
  customSubTitleField = (column, attr, editorClass, ignoreEditable) => {
    return (
      <Input 
        type="text" 
        name="subtitle" 
        column="subtitle" 
        placeholder="subtitle" 
        defaultValue={this.state.fields['subtitle']} 
        invalid={this.state.errors['subtitle']} 
        onChange={this.handleChange} />
    )
  }
  customDescriptionField = (column, attr, editorClass, ignoreEditable) => {
    return (
      <Input 
        type="text" 
        name="description" 
        column="description" 
        placeholder="description" 
        defaultValue={this.state.fields['description']} 
        invalid={this.state.errors['description']} 
        onChange={this.handleChange} />
    )
  }
  customImageField = (column, attr, editorClass, ignoreEditable) => {
    return (
      <PhotoPicker 
        preview
        onPick={data => {
          var currentDate = new Date()
          var date = currentDate.getDate();
          var month = currentDate.getMonth();
          var year = currentDate.getFullYear();
          var timeStamp = `${year}${this.pad(month + 1)}${date}${Date.now()}`;
          var extension = data.name.split('.')[data.name.split('.').length-1];

          this.setState({ imageUploading: true });

          var self = this;
          Storage.put(`slider/${timeStamp}.${extension}`, data.file, { contentType: 'image/*' })
            .then (result => {
              var fields = self.state.fields;
              fields['image'] = result.key;
              self.setState({ fields, imageUploading: false });
            })
            .catch(err => {
              var fields = self.state.fields;
              fields['image'] = '';
              self.setState({ fields, imageUploading: false });
              self.error('Failed to upload image. Try again later...');
            });
        }}
      />
    )
  }

  beforeClose(e) {
    var fields = this.state.fields;
    fields['title'] = '';
    fields['subtitle'] = '';
    fields['description'] = '';
    fields['image'] = '';
    this.setState({ fields, imageUploading: false, createOrUpdate: true, updateId: null });
  }
  
  beforeSave(e) {
    var fields = this.state.fields;
    var errors = this.state.errors;
    this._formIsValid = true;
    if (!fields['title'] || fields['title'] === '') {
      errors['title'] = true;
      this._formIsValid = false;
      this.setState({ errors });
    } else {
      errors['title'] = false;
      this.setState({ errors });
    }

    if (!fields['subtitle'] || fields['subtitle'] === '') {
      errors['subtitle'] = true;
      this._formIsValid = false;
      this.setState({ errors });
    } else {
      errors['subtitle'] = false;
      this.setState({ errors });
    }

    if (!fields['description'] || fields['description'] === '') {
      errors['description'] = true;
      this._formIsValid = false;
      this.setState({ errors });
    } else {
      errors['description'] = false;
      this.setState({ errors });
    }

    if (this.state.createOrUpdate) {
      if (!fields['image'] || fields['image'] === '') {
        this._formIsValid = false;
      }      
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
        id: this.state.updateId,
        title: this.state.fields['title'],
        subtitle: this.state.fields['subtitle'],
        description: this.state.fields['description'],
        image: this.state.fields['image']
      };
      this.setState({ imageUploading: true });
      var self = this;
      if (this.state.createOrUpdate) {
        api.POST('introduction/add', payload)
          .then(function(res) {
            if (res.data.success) {
              api.POST('introduction/getall')
              .then(function(res) {
                if (res.data.success) {
                  self.setState({ sliderData: res.data.results });
                }
              })
            } else {
              self.warn('Failed to add slider. Try again later...');  
            }          
            self.beforeClose();
            closeModal();
          }) 
          .catch(function(err) {
            self.beforeClose();
            closeModal();
            self.warn('Failed to add slider. Try again later...');
          })        
      } else {
        api.POST('introduction/update', payload)
          .then(function(res) {
            if (res.data.success) {
              api.POST('introduction/getall')
              .then(function(res) {
                if (res.data.success) {
                  self.setState({ sliderData: res.data.results });
                }
              })
            } else {
              self.warn('Failed to update slider. Try again later...');  
            }          
            self.beforeClose();
            closeModal();
          }) 
          .catch(function(err) {
            self.beforeClose();
            closeModal();
            self.warn('Failed to update slider. Try again later...');
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
          title='Add Slider'
          beforeClose={ this.beforeClose }
          onModalClose={ () => this.handleModalClose(closeModal) }/>
      :
        <InsertModalHeader
          title='Update Slider'
          beforeClose={ this.beforeClose }
          onModalClose={ () => this.handleModalClose(closeModal) }/>
    );
  }
  
  createCustomModalFooter = (closeModal, save) => {
    return (
      this.state.imageUploading ? 
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
        className='slider-add-btn'
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
        {!this.state.sliderData ? 
          <div className="animated fadeIn pt-3 text-center"><div className="sk-spinner sk-spinner-pulse"></div></div>
        :
          <BootstrapTable data={this.state.sliderData} version="4" bordered={false} search options={this.options} insertRow>
            <TableHeaderColumn isKey dataField="title" dataSort customInsertEditor={{ getElement: this.customTitleField }}>Title</TableHeaderColumn>
            <TableHeaderColumn dataField="subtitle" dataSort customInsertEditor={{ getElement: this.customSubTitleField }}>SubTitle</TableHeaderColumn>
            <TableHeaderColumn dataField="description" dataSort customInsertEditor={{ getElement: this.customDescriptionField }}>Description</TableHeaderColumn>
            <TableHeaderColumn dataField="image" dataAlign="center" dataFormat={this.imageField} customInsertEditor={{ getElement: this.customImageField }}>Image</TableHeaderColumn>
            <TableHeaderColumn dataAlign="center" dataFormat={this.actionField}>Actions</TableHeaderColumn>
          </BootstrapTable>
        }
      </div>
    )
  }
}

export default Slider;
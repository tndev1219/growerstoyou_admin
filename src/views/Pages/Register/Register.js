import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row, FormGroup, FormFeedback } from 'reactstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
// import '../../Forms/ValidationForms/ValidationForms.css';
// import {ToastContainer, toast} from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const validationSchema = function (values) {
  return Yup.object().shape({
    userName: Yup.string()
      .min(5, `Username has to be at least 5 characters`)
      .required('Username is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required!'),
    password: Yup.string()
      .min(5, `Password has to be at least ${5} characters!`)
      // .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/, 'Password must contain: numbers, uppercase and lowercase letters\n')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([values.password], 'Passwords must match')
      .required('Password confirmation is required')
  })
}

const validate = (getValidationSchema) => {
  return (values) => {
    const validationSchema = getValidationSchema(values)
    try {
      validationSchema.validateSync(values, { abortEarly: false })
      return {}
    } catch (error) {
      return getErrorsFromValidationError(error)
    }
  }
}

const getErrorsFromValidationError = (validationError) => {
  const FIRST_ERROR = 0
  return validationError.inner.reduce((errors, error) => {
    return {
      ...errors,
      [error.path]: error.errors[FIRST_ERROR],
    }
  }, {})
}

const initialValues = {
  userName: "",
  email: "",
  password: "",
  confirmPassword: ""
}

class Register extends Component {
  constructor(props){
    super(props)
    this.touchAll = this.touchAll.bind(this)
  }

  findFirstError (formName, hasError) {
    const form = document.forms[formName]
    for (let i = 0; i < form.length; i++) {
      if (hasError(form[i].name)) {
        form[i].focus()
        break
      }
    }
  }

  validateForm (errors) {
    this.findFirstError('simpleForm', (fieldName) => {
      return Boolean(errors[fieldName])
    })
  }

  touchAll(setTouched, errors) {
    setTouched({
      userName: true,
      email: true,
      password: true,
      confirmPassword: true
    })
    this.validateForm(errors)
  }

  onSubmit = (values, { setSubmitting, setErrors }) => {
    // const self = this;
    // axios.post('http://localhost:5000/apis/signup', values)
    //   .then(function (response) {
    //     console.log(response);
    //     setSubmitting(false);
    //     if (response.data.code === 200) {
    //       // toast.success('Register Success... ');
    //       self.props.history.push('/Login');
    //     } else if (response.data.code === 403) {
    //       toast.warn('The same email is already registered... ');
    //     } else {
    //       toast.error('Operation failed. Try again later... ');
    //     }      
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //     setSubmitting(false);
    //     toast.error('Operation failed. Try again later... ');
    //   });
  }

  render() {
    const containerStyle = {
      zIndex: 1999
    };

    return (
      <div className="app flex-row align-items-center">
        <ToastContainer position="top-right" autoClose={5000} style={containerStyle}/>
        <Container>
          <Row className="justify-content-center">
            <Col md="9" lg="7" xl="6">
              <h1 className="text-center mb-4">Growers To You</h1>
              <Card className="mx-4">
                <CardBody className="p-4">
                  <Formik
                    initialValues={initialValues}
                    validate={validate(validationSchema)}
                    onSubmit={this.onSubmit}
                    render={
                      ({
                        values,
                        errors,
                        touched,
                        status,
                        dirty,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting,
                        isValid,
                        setTouched
                      }) => (
                        <Form onSubmit={handleSubmit} noValidate name='simpleForm'>
                          <h1>Register</h1>
                          <p className="text-muted">Create your account</p>
                          <FormGroup>
                            <InputGroup className="mb-3">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                  <i className="icon-user"></i>
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input 
                                type="text"
                                name="userName"
                                id="userName"
                                placeholder="User Name"
                                autoComplete="username"
                                valid={!errors.userName}
                                invalid={touched.userName && !!errors.userName}
                                required
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.userName} 
                                style={{borderTopRightRadius: '0.25rem', borderBottomRightRadius: '0.25rem'}}
                              />
                              <FormFeedback>{errors.userName}</FormFeedback>
                            </InputGroup>
                          </FormGroup>
                          <FormGroup>
                            <InputGroup className="mb-3">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText>@</InputGroupText>
                              </InputGroupAddon>
                              <Input 
                                type="email"
                                name="email"
                                id="email"
                                placeholder="Email"
                                autoComplete="email"
                                valid={!errors.email}
                                invalid={touched.email && !!errors.email}
                                required
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.email} 
                                style={{borderTopRightRadius: '0.25rem', borderBottomRightRadius: '0.25rem'}}
                              />
                              <FormFeedback>{errors.email}</FormFeedback>
                            </InputGroup>
                          </FormGroup>
                          <FormGroup>
                            <InputGroup className="mb-3">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                  <i className="icon-lock"></i>
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input 
                                type="password"
                                name="password"
                                id="password"
                                placeholder="Password"
                                autoComplete="new-password"
                                valid={!errors.password}
                                invalid={touched.password && !!errors.password}
                                required
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.password} 
                                style={{borderTopRightRadius: '0.25rem', borderBottomRightRadius: '0.25rem'}}
                              />
                              {/*<FormFeedback>Required password containing at least: number, uppercase and lowercase letter, 8 characters</FormFeedback>*/}
                              <FormFeedback>{errors.password}</FormFeedback>
                            </InputGroup>
                          </FormGroup>
                          <FormGroup>
                            <InputGroup className="mb-4">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                  <i className="icon-lock"></i>
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input 
                                type="password"
                                name="confirmPassword"
                                id="confirmPassword"
                                placeholder="Confirm password"
                                autoComplete="new-password"
                                valid={!errors.confirmPassword}
                                invalid={touched.confirmPassword && !!errors.confirmPassword}
                                required
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.confirmPassword} 
                                style={{borderTopRightRadius: '0.25rem', borderBottomRightRadius: '0.25rem'}}
                              />
                              <FormFeedback>{errors.confirmPassword}</FormFeedback>
                            </InputGroup>
                          </FormGroup>
                          <FormGroup>
                            <Button type="submit" color="success" block disabled={isSubmitting || !isValid}>{isSubmitting ? 'Wait...' : 'Create Account'}</Button>
                          </FormGroup>
                          <Link to="/login">
                            <Button color="link" className="px-0">Already has account!</Button>
                          </Link>
                        </Form>
                      )} />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Register;

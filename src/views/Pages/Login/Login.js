import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row, FormGroup, FormFeedback } from 'reactstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import authAction from '../../../redux/auth/actions';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const validationSchema = function (values) {
  return Yup.object().shape({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required!'),
    password: Yup.string()
      .min(5, `Password has to be at least ${5} characters!`)
      // .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/, 'Password must contain: numbers, uppercase and lowercase letters\n')
      .required('Password is required'),
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
  email: "",
  password: ""
}

class Login extends Component {

  constructor(props){
    super(props);
    this.state = {
    }
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

  handleSignin(values) {
    this.props.waiting(true);
    this.props.login({
      email: values.email,
      password: values.password
    })
  }

  render() {
    const containerStyle = {
      zIndex: 1999
    };
    var { wait } = this.props;

    return (
      <div className="app flex-row align-items-center">
        <ToastContainer position="top-right" autoClose={5000} style={containerStyle}/>
        <Container>
          <Row className="justify-content-center">
            <Col md="5">
              <h1 className="text-center mb-4">Growers To You</h1>
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Formik
                      initialValues={initialValues}
                      validate={validate(validationSchema)}
                      onSubmit={this.handleSignin.bind(this)}
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
                            <h1>Login</h1>
                            <p className="text-muted">Sign In to your account</p>
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
                              <Button type="submit" color="primary" block disabled={wait || !isValid}>{wait ? 'Wait...' : 'Login'}</Button>
                            </FormGroup>
                            
                            {/* <Row>
                              <Col xs="6">
                                <Link to="/register">
                                  <Button color="link" className="px-0">Register Now!</Button>
                                </Link>
                              </Col>
                              <Col xs="6" className="text-right">
                                <Button color="link" className="px-0">Forgot password?</Button>
                              </Col>
                            </Row> */}
                          </Form>
                        )
                      } 
                    />
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default connect(
  state => ({
    isLoggedIn: state.Auth.idToken !== null ? true : false,
    wait: state.Auth.wait
  }),
  { waiting: authAction.waiting, login: authAction.login }
)(Login);

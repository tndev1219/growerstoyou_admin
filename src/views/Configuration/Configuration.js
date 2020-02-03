import React, { Component } from 'react';
import { Card, CardHeader, CardBody, ListGroup, ListGroupItem, Col, Row, TabContent, TabPane } from 'reactstrap'
import Slider from '././Slider';
import Category from '././Category';
import Unit from '././Unit';

class Dashboard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activeTab: 0
    }
  }

  toggleTab(tabIndex) {
    if (this.state.activeTab !== tabIndex) {
      this.setState({activeTab: tabIndex})
    }
  }

  render() {
    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <strong>Configuration</strong>
          </CardHeader>
          <CardBody>
            <Row>
              <Col xs="12" sm="5" md="4" lg="3" xl="2">
                <ListGroup id="list-tab" role="tablist">
                  <ListGroupItem onClick={() => this.toggleTab(0)} action active={this.state.activeTab === 0} >Slider</ListGroupItem>
                  <ListGroupItem onClick={() => this.toggleTab(1)} action active={this.state.activeTab === 1} >Category</ListGroupItem>
                  <ListGroupItem onClick={() => this.toggleTab(2)} action active={this.state.activeTab === 2} >Unit</ListGroupItem>
                </ListGroup>
              </Col>
              <Col xs="12" sm="7" md="8" lg="9" xl="10">
                <TabContent activeTab={this.state.activeTab}>
                  <TabPane tabId={0} >
                    <Slider />
                  </TabPane>
                  <TabPane tabId={1}>
                    <Category />
                  </TabPane>
                  <TabPane tabId={2}>
                  <Unit />
                  </TabPane>
                  <TabPane tabId={3}>
                    <p>Irure enim occaecat labore sit qui aliquip reprehenderit amet velit. Deserunt ullamco ex elit nostrud ut dolore nisi officia magna
                      sit occaecat laboris sunt dolor. Nisi eu minim cillum occaecat aute est cupidatat aliqua labore
                      aute occaecat ea aliquip sunt amet. Aute mollit dolor ut exercitation irure commodo non amet consectetur quis amet culpa. Quis ullamco
                      nisi amet qui aute irure eu. Magna labore dolor quis ex labore id nostrud deserunt dolor
                      eiusmod eu pariatur culpa mollit in irure.</p>
                  </TabPane>
                </TabContent>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default Dashboard;

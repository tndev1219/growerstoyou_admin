import React, { Component } from 'react';
// import { Card, CardHeader, CardBody, ListGroup, ListGroupItem, Col, Row, TabContent, TabPane } from 'reactstrap'
// import Category from './Category'

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
        {/* <Card>
          <CardHeader>
            <strong>Setting</strong>
          </CardHeader>
          <CardBody>
            <Row>
              <Col xs="12" sm="5" md="4" lg="3" xl="2">
                <ListGroup id="list-tab" role="tablist">
                  <ListGroupItem onClick={() => this.toggleTab(0)} action active={this.state.activeTab === 0} >Category</ListGroupItem>
                  <ListGroupItem onClick={() => this.toggleTab(1)} action active={this.state.activeTab === 1} >Profile</ListGroupItem>
                </ListGroup>
              </Col>
              <Col xs="12" sm="7" md="8" lg="9" xl="10">
                <TabContent activeTab={this.state.activeTab}>
                  <TabPane tabId={0} >
                    <Category />
                  </TabPane>
                  <TabPane tabId={1}>
                    <p>Cupidatat quis ad sint excepteur laborum in esse qui. Et excepteur consectetur ex nisi eu do cillum ad laborum. Mollit et eu officia
                      dolore sunt Lorem culpa qui commodo velit ex amet id ex. Officia anim incididunt laboris deserunt
                      anim aute dolor incididunt veniam aute dolore do exercitation. Dolor nisi culpa ex ad irure in elit eu dolore. Ad laboris ipsum
                      reprehenderit irure non commodo enim culpa commodo veniam incididunt veniam ad.</p>
                  </TabPane>
                  <TabPane tabId={2}>
                    <p>Ut ut do pariatur aliquip aliqua aliquip exercitation do nostrud commodo reprehenderit aute ipsum voluptate. Irure Lorem et laboris
                      nostrud amet cupidatat cupidatat anim do ut velit mollit consequat enim tempor. Consectetur
                      est minim nostrud nostrud consectetur irure labore voluptate irure. Ipsum id Lorem sit sint voluptate est pariatur eu ad cupidatat et
                      deserunt culpa sit eiusmod deserunt. Consectetur et fugiat anim do eiusmod aliquip nulla
                      laborum elit adipisicing pariatur cillum.</p>
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
        </Card> */}
      </div>
    );
  }
}

export default Dashboard;

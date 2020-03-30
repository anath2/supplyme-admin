/* eslint camelcase: 0, no-underscore-dangle: 0 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import { toNewOrder } from '../../../services/order/model';
import { getKeys, formatDateWTime, dispatchNewObject } from '../../../utils/misc';

import MiniDirectionsMap from '../../../components/VeriDoc/Misc/MiniDirectionsMap';

import { withScriptjs } from "react-google-maps";

const styles = {
    root: {
        flex: 1,
    },
    content: {
        paddingTop: 42,
        paddingBottom: 42,
        paddingLeft: 80,
        paddingRight: 80,
    },
    display: {
        display: 'flex',
    },
    leftDetail: {
      paddingRight: '8rem',
      flexBasis: 0,
      flexGrow: 1,
    },
    detailCard: {
      padding: '2.0rem',
      boxShadow: '0 8px 64px rgba(32, 32, 32, 0.08), 0 4px 16px rgba(32, 32, 32, 0.02)',
      borderRadius: 16,
    },
    detailTop: {
      marginBottom: 30,
      display: 'flex',
      alignItems: 'center',
      fontWeight: 500,
      color: '#202020',
    },
    detailTitle: {
        marginBottom: 30,
    },
    detailTitleText: {
      color: 'black',
      fontSize: 24,
      fontWeight: 600,
      lineHeight: 1.36,
      margin: 0,
    },
    detailActions: {
        display: 'flex',
    },
    button: {
        marginRight: 10,
        textTransform: 'none',
    },
    deleteButton: {
        backgroundColor: '#e02626',
        textTransform: 'none',
    },
    rightDetail: {
      flexGrow: 2,
      flexBasis: 0,
    },
    block: {
        marginBottom: 40,
    },
    section: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: 15,
      paddingBottom: 15,
      margin: 0,
    },
    detailList: {
      borderTop: '1px solid #e6e6e6',
      paddingTop: 15,
      display: 'block',
    },
    editButton: {
        float: 'right',
        textTransform: 'none',
    },
    detailListDt: {
      minWidth: '30%',
      border: 0,
      padding: '.5rem 0',
      margin: 0,
    },
    detailListDd: {
      minWidth: '70%',
      border: 0,
      fontWeight: 500,
      padding: '.5rem 0',
      margin: 0,
    },
    detailListFlex: {
        display: 'flex',
    },
    img: {
        borderRadius: '50%',
        paddingRight: 10,
    }
};

function mapStateToProps(state) {
    return {
        pathname: state.router.location.pathname,
        employeeID: state.app.employeeID,
        accountID: state.app.accountID,
        orders: state.orderData.orders,
        receivedAt: state.orderData.receivedAt,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {},
    };
}

@connect(mapStateToProps, mapDispatchToProps)
class OrderDetailView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            order: toNewOrder()
        };
    }

    componentDidMount() {
      console.log('Order Detail Mounted')
      this.loadCompData();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.receivedAt !== null && this.props.receivedAt === null) {
            this.loadCompData(nextProps);
        }
    }

    componentWillUnmount() {
      console.log('Order Detail UnMounted')
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState === this.state) {
            return false;
        }
        return true;
    }

    loadCompData = () => {
        const { actions, accountID, orders, pathname } = this.props;
        const keys = getKeys(pathname);
        const orderID = keys.second;
        if (orderID && orderID !== null) {
            orders.forEach((order) => {
                if (order.orderID === orderID) {
                    this.setState({order});
                }
            })
        }
    }

    renderItemQuantites = (quantity, index) => {
        const { classes } = this.props;
        console.log(quantity)
        return (
            <div className={classes.block}>
                <div className={classes.section}>
                    <span className={classes.detailTitleText}>{`$ ${quantity.pricePerUnit} - ${quantity.packageQuantity} / ${quantity.packageType}`}</span>
                </div>
                <dl className={classes.detailList}>
                    <div key={index} className={classes.detailListFlex}>
                        <dt className={classes.detailListDt}>
                            {'Stock'}
                        </dt>
                        <dd className={classes.detailListDd}>
                            {quantity.stock}
                        </dd>
                    </div>
                </dl>
            </div>
        );
    }

    render() {
        const { classes, accountID } = this.props;
        const { order } = this.state;
        return (
          <div className={classes.root}>
              <div className={classes.content}>
                  <div className={classes.display}>
                      <div className={classes.leftDetail}>
                          <div className={classes.detailCard}>
                              <div className={classes.detailTop}>
                              {
                                order.active
                                ? (
                                  <MiniDirectionsMap
                                      googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_API_KEY}`}
                                      loadingElement={<div style={{ height: `100%` }} />}
                                      containerElement={<div style={{ width: 400, height: 200 }} />}
                                      mapElement={<div style={{ height: `100%` }} />}
                                      origin={null}
                                      destination={null}
                                  />
                                ) : null
                              }
                              </div>
                              <div className={classes.detailTitle}>
                                <span className={classes.detailTitleText}>{`${'order.contactInfo.name'}`}</span>
                                <br />
                                <span>{`${'order.name'}`}</span>
                                <br />
                                <span>{'order.active ? `Lat: ${order.address.order.lat} Lng: ${order.address.order.lng}` : null'}</span>
                              </div>
                          </div>
                      </div>
                      <div className={classes.rightDetail}>
                          <div className={classes.block}>
                              <div className={classes.section}>
                                  <span className={classes.detailTitleText}>Details</span>
                                  <Button
                                    variant="contained"
                                    disableRipple
                                    disableFocusRipple
                                    onClick={(e) => dispatchNewObject(e, accountID, 'order', order.orderID, 'edit')}
                                    className={classes.editButton}
                                  >
                                      {'Edit'}
                                  </Button>
                              </div>
                              <dl className={classes.detailList}>
                                  <div className={classes.detailListFlex}>
                                  <dt className={classes.detailListDt}>
                                      ID
                                  </dt>
                                  <dd className={classes.detailListDd}>
                                      {order.orderID}
                                  </dd>
                                  </div>
                                  <div className={classes.detailListFlex}>
                                  <dt className={classes.detailListDt}>
                                      Created
                                  </dt>
                                  <dd className={classes.detailListDd}>
                                      {'`${formatDateWTime(order.createdDate)}`'}
                                  </dd>
                                  </div>
                                  <div className={classes.detailListFlex}>
                                  <dt className={classes.detailListDt}>
                                      Contact Name
                                  </dt>
                                  <dd className={classes.detailListDd}>
                                      {'order.contactInfo.name'}
                                  </dd>
                                  </div>
                                  <div className={classes.detailListFlex}>
                                  <dt className={classes.detailListDt}>
                                      Contact Email
                                  </dt>
                                  <dd className={classes.detailListDd}>
                                      {'order.contactInfo.email'}
                                  </dd>
                                  </div>
                                  <div className={classes.detailListFlex}>
                                  <dt className={classes.detailListDt}>
                                      Contact Phone
                                  </dt>
                                  <dd className={classes.detailListDd}>
                                      {'order.contactInfo.phoneNumber'}
                                  </dd>
                                  </div>
                              </dl>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
        );
    }
}

OrderDetailView.defaultProps = {
    router: PropTypes.object,
};

OrderDetailView.propTypes = {
    router: PropTypes.object,
};

export default withStyles(styles)(OrderDetailView);

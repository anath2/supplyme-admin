/* eslint camelcase: 0, no-underscore-dangle: 0, react/jsx-indent-props: 0, max-len: 0, react/forbid-prop-types: 0 */
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import LinearProgress from '@material-ui/core/LinearProgress';

// import { registerAccount } from '../../../services/accountRegistration/actions';
// import { registerEmployee } from '../../../services/employeeRegistration/actions';
// import { getAccountCode } from '../../../services/account/actions';
// import { getEmployeeCode } from '../../../services/employee/actions';
import { toNewAccountCode } from '../../../services/account/model';
// import { toNewEmployeeCode } from '../../../services/employee/model';
import { dispatchNewRoute, getRegistrationSearch } from '../../../utils/misc';

const styles = theme => ({
    root: {
        flex: 1,
        height: '100vh',
        backgroundColor: '#fff',
    },
    content: {
        paddingTop: 42,
        paddingBottom: 42,
        paddingLeft: 80,
        paddingRight: 80,
    },
    leftContent: {
        marginTop: 100,
        float: 'left',
        width: '44%',
    },
    registerHeader: {
        // lineHeight: '40px',
        fontSize: 60,
    },
    registerSubHeader: {
        lineHeight: '30px',
        fontSize: 20,
    },
    rightContent: {
        float: 'right',
        width: '44%',
    },
    gridItem: {
      marginLeft: '3%',
      marginRight: '3%',
    },
    gridItemBox: {
      backgroundColor: '#fff',
      borderRadius: '1rem',
      boxShadow: '0 0.5rem 4rem 0.5rem rgba(0,0,0,0.08)',
    },
    gridItemBoxInner: {
      padding: '1.5rem',
    },
    text: {
        marginBottom: 14,
    },
    textField: {
        fontSize: 14,
    },
    registerButtonBox: {
        marginBottom: 20,
    },
    registerButton: {
        textAlign: 'center',
        width: '100%',
        color: '#fff',
        backgroundColor: theme.palette.primary.main,
        textTransform: 'none',
        height: 45,
        fontSize: 14,
    },
    link: {
        cursor: 'pointer',
        color: '#1524D9',
    },
    loader: {
        color: theme.palette.primary.main,
        backgroundColor: theme.palette.primary.secondary,
    },
});

function mapStateToProps(state) {
    return {
        search: state.router.location.search,
        // idToken: state.app.idToken,
        // employeeID: state.app.employeeID,
        accountCode: state.accountData.accountCode,
        // isRegistered: state.app.isRegistered,
        // isRegistering: state.app.isRegistering,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {
            // getAccountCode: bindActionCreators(getAccountCode, dispatch),
            // registerAccount: bindActionCreators(registerAccount, dispatch),
            // getEmployeeCode: bindActionCreators(getEmployeeCode, dispatch),
            // registerEmployee: bindActionCreators(registerEmployee, dispatch),
        },
    };
}

@connect(mapStateToProps, mapDispatchToProps)
class RegisterView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activationCode: toNewAccountCode(),
            accountCode: toNewAccountCode(),
            ownerName_error_text: null,
            accountName_error_text: null,
            activationCode_error_text: null,
            ownerEmail_error_text: null,
            password: '',
            password_error_text: null,
            forgotEmail: null,
            forgotEmail_error_text: null,
            disabled: true,
            redirectRoute: '/',
            loading: false,
        };
    }

    componentDidMount() {
        const { actions, search } = this.props;
        // const keys = getRegistrationSearch(search);
        // const next_state = this.state;
        // next_state.activationCode.activationCode = keys.code;
        // if (keys.type !== null) {
        //     this.setState({activationCode: next_state.activationCode});
        // }
    }

    componentWillReceiveProps(nextProps) {
        // if (nextProps.accountCode.isLoaded && !this.props.accountCode.isLoaded) {
        //     this.setState({
        //         activationCode: nextProps.accountCode,
        //         stepIndex: 1,
        //     });
        // }
        // if (!nextProps.isRegistered && this.props.isRegistering) {
        //     this.setState({
        //         loading: false,
        //     });
        // }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState === this.state) {
            return false;
        }
        return true;
    }

    isDisabled() {
        let ownerName_is_valid = false;
        let accountName_is_valid = false;
        let email_is_valid = false;
        let password_is_valid = false;
        let activationCode_is_valid = false;
        this.setState({
            disabled: true,
        });

        if (this.state.activationCode.ownerName === null || this.state.activationCode.ownerName === '') {
            this.setState({
                ownerName_error_text: null,
            });
        } else if (validateName(this.state.activationCode.ownerName)) {
            ownerName_is_valid = true;
            this.setState({
                ownerName_error_text: null,
            });

        } else {
            this.setState({
                ownerName_error_text: 'Sorry, this is not a valid name',
            });
        }

        if (this.state.activationCode.accountName === null || this.state.activationCode.accountName === '') {
            this.setState({
                accountName_error_text: null,
            });
        } else if (validateName(this.state.activationCode.accountName)) {
            accountName_is_valid = true;
            this.setState({
                accountName_error_text: null,
            });

        } else {
            this.setState({
                accountName_error_text: 'Sorry, this is not a valid name',
            });
        }

        if (this.state.activationCode.email === null) {
            this.setState({
                email_error_text: null,
            });
        } else if (validateEmail(this.state.activationCode.email)) {
            email_is_valid = true;
            this.setState({
                email_error_text: null,
            });
        } else {
            this.setState({
                email_error_text: 'Sorry, this is not a valid email',
            });
        }
        console.log(this.state.activationCode.email)

        // Is '' because state comes from class, not inheireted object
        if (this.state.password === '') {
            this.setState({
                password_error_text: null,
            });
        } else if (this.state.password.length >= 6) {
            password_is_valid = true;
            this.setState({
                password_error_text: null,
            });
        } else {
            this.setState({
                password_error_text: 'Your password must be at least 6 characters',
            });
        }

        if (this.state.activationCode.activationCode === null) {
            this.setState({
                activationCode_error_text: null,
            });
        } else if (this.state.activationCode.activationCode.length <= 20) {
            activationCode_is_valid = true;
            this.setState({
                activationCode_error_text: null,
            });
        } else {
            this.setState({
                activationCode_error_text: 'Your code must be less than 20 characters',
            });
        }
        console.log(email_is_valid)
        console.log(password_is_valid)
        console.log(activationCode_is_valid)
        if (
          accountName_is_valid &&
          ownerName_is_valid &&
          email_is_valid &&
          password_is_valid &&
          activationCode_is_valid
        ) {
            this.setState({
                disabled: false,
            });
        }
    }

    changeValue(e, parent, child) {
        console.log(child)
        console.log(parent)
        const value = e.target.value;
        const next_state = this.state;
        if (parent) {
            next_state[parent][child] = value;
        } else {
            next_state[child] = value;
        }
        this.setState(next_state, () => {
            this.isDisabled();
        });
    }

    _handleKeyPress(e) {
        if (e.key === 'Enter') {
            if (!this.state.disabled) {
                this.createNewAccount(e);
            }
        }
    }

    createNewAccount = (e) => {
        const { actions, idToken, employeeID, accountType, userType }= this.props;
        const { activationCode, password, redirectRoute }= this.state;
        e.preventDefault();
        this.setState({
            loading: true,
            disabled: true,
        });
        actions.registerAccount(
            activationCode,
            password,
            redirectRoute,
        );
    }

    render() {
        const { classes } = this.props;
        const {
          activationCode,
          ownerEmail_error_text,
          activationCode_error_text,
          password_error_text,
          loading,
        } = this.state;
        console.log(activationCode);

        const RightContent = (
          <div className={classes.rightContent}>
              <div className={classes.gridItem}>
                  <div className={classes.gridItemBox}>
                      <div className={classes.gridItemBoxInner}>
                          <h2 style={{lineHeight: '24px', fontWeight: 400, fontSize: 30, textAlign: 'center', paddingBottom: 15}}>{'Register a new account'}</h2>
                          <div style={{margin: 10}}>
                          {
                              loading ?
                              (<LinearProgress className={classes.loader} />)
                              : null
                          }
                          </div>
                          <div className={classes.text}>
                              <TextField
                                  placeholder="Ex. John Doe"
                                  label="Legal Name"
                                  type="text"
                                  fullWidth
                                  variant="outlined"
                                  autoComplete=""
                                  className={classes.textField}
                                  value={activationCode.ownerName || ''}
                                  helpertext={this.state.ownerName_error_text}
                                  // onChange={e => this.changeValue(e, 'activationCode', 'ownerName')}
                              />
                          </div>
                          <div className={classes.text}>
                              <TextField
                                  placeholder="Email"
                                  label="Email"
                                  type="email"
                                  fullWidth
                                  variant="outlined"
                                  value={activationCode.email || ''}
                                  autoComplete="email"
                                  className={classes.textField}
                                  helpertext={ownerEmail_error_text}
                                  // onChange={e => this.changeValue(e, 'activationCode', 'email')}
                              />
                          </div>
                          <div className={classes.text}>
                              <TextField
                                  placeholder="Ex. PxrP2LtHJoO87RAW87HX"
                                  label="Activation Code"
                                  type="text"
                                  fullWidth
                                  value={activationCode.activationCode || ''}
                                  variant="outlined"
                                  className={classes.textField}
                                  helpertext={activationCode_error_text}
                                  // onChange={e => this.changeValue(e, 'activationCode', 'activationCode')}
                              />
                          </div>
                          <div className={classes.text}>
                              <TextField
                                  placeholder="Password"
                                  label="Password"
                                  type="password"
                                  fullWidth
                                  value={this.state.password}
                                  variant="outlined"
                                  autoComplete="current-password"
                                  className={classes.textField}
                                  helpertext={password_error_text}
                                  // onChange={e => this.changeValue(e, null, 'password')}
                              />
                          </div>
                          <div style={{marginBottom: 35}}/>
                          <div className={classes.registerButtonBox}>
                              <Button
                                  disableRipple
                                  disableFocusRipple
                                  // onClick={this.createNewAccount}
                                  disabled={false}
                                  className={classes.registerButton}
                                  variant="outlined"
                              >
                                  {'Register Account'}
                              </Button>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
        );

        const AccountRegister = (
            <div className={classes.content}>
                <div className={classes.leftContent}>
                    <div className={classes.gridItem}>
                        <div className={classes.registerHeader}>
                            VeriDoc
                        </div>
                        <p className={classes.registerSubHeader}>Please fill out the following information to register a new account in VeriDoc.</p>
                    </div>
                </div>
                {RightContent}
            </div>
        );
        return (
            <div className={classes.root}>
                <div style={{paddingTop: 66}} onKeyPress={e => this._handleKeyPress(e)}>
                {AccountRegister}
                </div>
            </div>
        );
    }
}

RegisterView.defaultProps = {
    search: '',
    registerAccount: f => f,
};

RegisterView.propTypes = {
    search: PropTypes.string,
    registerAccount: PropTypes.func,
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RegisterView);
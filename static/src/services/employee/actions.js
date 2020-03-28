import history from '../../history';
import { db } from '../../store/firebase';
import { parseJSON, validateKey } from '../../utils/misc';
import { apiSendEmailEmployeeCode } from '../../utils/http_functions';
import { toNewEmployee } from './model';
import { supplyMeAnalytic } from '../../utils/analytics';
import { successAlert, errorAlert } from '../../utils/alerts';

export const addEmployee = employee => ({
    type: 'ADD_EMPLOYEE',
    ...employee,
});

export const startFetchingEmployees = () => ({
    type: 'START_FETCHING_EMPLOYEES',
});

export const receivedEmployees = () => ({
    type: 'RECEIVED_EMPLOYEES',
    receivedAt: Date.now(),
});
export const receiveEmployees = querySnapshot => (dispatch) => {
    if (querySnapshot) {
        querySnapshot.forEach((doc) => {
            const employee = doc.data();
            employee.employeeID = doc.id;
            dispatch(addEmployee(employee));
        });
        dispatch(receivedEmployees());
    }
};

export const fetchEmployees = (employeeID, accountID) =>  (dispatch) => {
    dispatch(startFetchingEmployees());
    db()
        .collection('Accounts')
        .doc(accountID)
        .collection('Employees')
        .onSnapshot((querySnapshot) => {
            setTimeout(() => {
                const employees = querySnapshot || [];
                dispatch(receiveEmployees(employees));
            }, 0);
        }, (error) => {
            console.log(error);
        });
};

// Save New Employee
//
// [START Save New Employee]
export const saveNewEmployeeRequest = () => ({
    type: 'SAVE_NEW_EMPLOYEE_REQUEST',
});


export const saveNewEmployeeSuccess = () => ({
    type: 'SAVE_NEW_EMPLOYEE_SUCCESS',
});

export const saveNewEmployeeFailure = error => ({
    type: 'SAVE_NEW_EMPLOYEE_FAILURE',
    payload: {
        status: error.response.status,
        statusText: error.response.statusText,
    },
});
export const saveNewEmployee = (token, employeeCodeInfo, redirectRoute) => (dispatch) => {
    dispatch(saveNewEmployeeRequest());
    console.log(token)
    console.log(employeeCodeInfo)
    console.log(redirectRoute)

    const accountID = employeeCodeInfo.accountID;

    const employmentDate = new Date()

    const newEmployeeCodeDocRef = db().collection("EmployeeActivationCodes").doc();
    const newTempAccountEmployeeRef = db().collection("Accounts").doc(accountID).collection("Employees").doc(newEmployeeCodeDocRef.id)

    const employeeID = newEmployeeCodeDocRef.id;
    const employee = toNewEmployee();
    employee.active = true
    const newName = employeeCodeInfo.ownerName.split(' ')
    employee.firstName = newName[0]
    employee.lastName = newName[1]
    employee.email = employeeCodeInfo.email;
    employee.activationCode = newEmployeeCodeDocRef.id
    employee.createdTime = employmentDate
    employee.updatedTime = employmentDate
    employee.employeeID = employeeID;

    employeeCodeInfo.activationCode = employee.activationCode
    employeeCodeInfo.createdTime = employmentDate
    employeeCodeInfo.updatedTime = employmentDate

    console.warn(employee)
    console.warn(employeeCodeInfo)

    return db().runTransaction((transaction) => {
      transaction.set(newEmployeeCodeDocRef, employeeCodeInfo);
      transaction.set(newTempAccountEmployeeRef, employee);
      return Promise.resolve({ employeeID, accountID });
    }).then((employeeID, accountID) => {
        console.log("Transaction successfully committed!");
        dispatch(saveNewEmployeeSuccess());
        dispatch(apiSendEmailEmployeeCode(token, employeeCodeInfo))
        // Analytics
        history.back();
    }).catch((error) => {
        console.log("Transaction failed: ", error);
        dispatch(saveNewEmployeeFailure({
            response: {
                status: 999,
                statusText: error.message,
            },
        }));
    });
};
// [END Save New Employee]

export const addEmployeeCode = employeeCode => ({
    type: 'ADD_EMPLOYEE_CODE',
    ...employeeCode,
});

export const startFetchingEmployeeCodes = () => ({
    type: 'START_FETCHING_EMPLOYEE_CODES',
});

export const receivedEmployeeCodes = () => ({
    type: 'RECEIVED_EMPLOYEE_CODES',
    receivedAt: Date.now(),
});
export const receiveEmployeeCodes = querySnapshot => function (dispatch) {
    if (querySnapshot) {
        querySnapshot.forEach((doc) => {
            const employeeCode = doc.data();
            employeeCode.activationCode = doc.id;
            dispatch(addEmployeeCode(employeeCode));
        });
        dispatch(receivedEmployeeCodes());
    }
};

export const fetchEmployeeCodes = (accountID) => function (dispatch) {
    dispatch(startFetchingEmployeeCodes());
    db()
        .collection('EmployeeActivationCodes').where('accountID', '==', accountID)
        .onSnapshot((querySnapshot) => {
            setTimeout(() => {
                const employeeCodes = querySnapshot || [];
                dispatch(receiveEmployeeCodes(employeeCodes));
            }, 0);
        }, (error) => {
            console.log(error);
            // Handle Error
        });
};

// Email Employee Code
// TODO: None
// [START Email Employee Code]
export const sendEmployeeCodeEmailRequest = () => ({
    type: 'ACTIVATE_EMPLOYEE_CODE_REQUEST',
});

export const sendEmployeeCodeEmailSuccess = () => ({
    type: 'ACTIVATE_EMPLOYEE_CODE_SUCCESS',
});

export const sendEmployeeCodeEmailFailure = error => ({
    type: 'ACTIVATE_EMPLOYEE_CODE_FAILURE',
    payload: {
        status: error.response.status,
        statusText: error.response.statusText,
    },
});
export const sendEmployeeCodeEmail = (token, employeeCode) => (dispatch) => {
        dispatch(sendEmployeeCodeEmailRequest());
        db().collection('EmployeeActivationCodes').doc(employeeCode.activationCode).update({
            valid: true,
        }).then((response) => {
          return apiSendEmailEmployeeCode(token, employeeCode)
          .then(parseJSON)
              .then((response) => {
                  dispatch(sendEmployeeCodeEmailSuccess());
                  // Add Analytics
                  // Add Swal Alert
              })
              .catch((error) => {
                  // Add Analytics
                  console.error(error)
                  dispatch(sendEmployeeCodeEmailFailure({
                      response: {
                          status: error.response.status,
                          statusText: error.response.data.statusText,
                      },
                  }));
              });
        }).catch((error) => {
            // Add Analytics
            console.error(error)
            dispatch(sendEmployeeCodeEmailFailure({
                response: {
                    status: error.response.status,
                    statusText: error.response.data.statusText,
                },
            }));
        });
};
// [END Email Employee Code]

// Delete Employee
// TODO: None
// [START Delete Employee]
export const deleteEmployeeCodeRequest = () => ({
    type: 'DELETE_EMPLOYEE_CODE_REQUEST',
});


export const deleteEmployeeCodeSuccess = employeeCode => ({
    type: 'DELETE_EMPLOYEE_CODE_SUCCESS',
    payload: {
        employeeCode,
    },
});

export const deleteEmployeeCodeFailure = error => ({
    type: 'DELETE_EMPLOYEE_CODE_FAILURE',
    payload: {
        status: error.response.status,
        statusText: error.response.statusText,
    },
});

export const deleteEmployeeCode = (employeeID, accountID, employeeCode) => (dispatch) => {
    console.log(employeeID);
    console.log(accountID);
    console.log(employeeCode);
    dispatch(deleteEmployeeCodeRequest());

    if (!validateKey(accountID)) {
        errorAlert('Invalid Account ID');
    }

    const accountRef = db().collection('Accounts').doc(accountID);
    const docRef = accountRef.collection('EmployeeCodes').doc(employeeCode.activationCode);

    const updatedDate = Date.now();
    docRef.update({"active": false, "deleted": true, "updatedDate": updatedDate}).then(() => {
        dispatch(deleteEmployeeCodeSuccess());
        successAlert('Delete Employee Code Success');
        supplyMeAnalytic(employeeID, 'employee', 'deleteEmployeeCodeSuccess');
    }).catch((error) => {
        errorAlert(error.message || error);
        supplyMeAnalytic(employeeID, 'employee', 'deleteEmployeeCodeFailure');
        dispatch(deleteEmployeeCodeFailure({
            response: {
                status: 400,
                statusText: error.message,
            },
        }));
    });
};
// [END Delete Employee]

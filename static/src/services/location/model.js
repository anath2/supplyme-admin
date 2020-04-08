import { parseFirestoreTimeStamp } from '../../utils/misc';

export function getLocationFromSnapshot(location) {
    return {
        locationID: location.locationID,
        active: location.active,
        deleted: location.deleted,
        name: location.name,
        licenseID: location.licenseID,
        locationType: location.locationType,
        contactInfo: location.contactInfo,
        address: location.address,
        updatedDate: parseFirestoreTimeStamp(location.updatedDate),
        createdDate: parseFirestoreTimeStamp(location.createdDate),
    };
}
export function toNewLocation() {
    return {
        locationID: null,
        active: false,
        deleted: false,
        address: {
            locality: 'Newport Beach',
            country: null,
            region: 'CA',
            street1: '1213 Test way',
            street2: null,
            postal: '92663',
            location: null,
            geohash: null,
            placeID: null,
        },
        name: 'Hospital 1',
        licenseID: null,
        locationType: 'medical',
        contactInfo: {
            name: null,
            phoneNumber: null,
            email: null,
        },
        updatedDate: null,
        createdDate: null,
    };
}

import { test, expect } from '@playwright/test';
import Ajv from 'ajv';
import bookingSchema from './schemas/booking.schema.json';
import bookings from './test data/bookings.json';

// Define the booking data to be used in the tests
let bookingData = {
        firstname: "Malar",
        lastname: "Arjun",
        totalprice: 1115,
        depositpaid: true,
        bookingdates: {
            checkin: "2026-01-01",
            checkout: "2026-01-31"
        },
        additionalneeds: "Dinner"
    };
let updatedBookingData = {
        firstname: "Adrian", 
        lastname: "Ponce de Leon",
        totalprice: 999,
        depositpaid: true,
        bookingdates: {
            checkin: "2026-01-01",
            checkout: "2026-01-31"
        },
        additionalneeds: "Smoking area"
    };
// Define variable to store the authentication token
let token: string;
// Create variablefor schema validation
let ajv = new Ajv();
let validateBookingSchema = ajv.compile(bookingSchema);

// Get authentication token
test.beforeAll(async ({ request }) => {
    let getToken = await request.post('https://restful-booker.herokuapp.com/auth', {
        data: {
            username: 'admin',
            password: 'password123'
        }
    });

    let getTokenBody = await getToken.json();
    token = getTokenBody.token;
});

test('Get Booking IDs returns 200 and a non-empty list', async ({ request }) => {
    let response = await request.get('https://restful-booker.herokuapp.com/booking');
    let responseBody = await response.json();
    expect(response.status()).toBe(200);
    expect(responseBody.length).toBeGreaterThan(0);
});

// Create bookings for each entry in the bookings.json file using a for
for (let booking of bookings) {
    test(`Create Booking for ${booking.firstname}`, async ({ request }) => {
        let response = await request.post(
            'https://restful-booker.herokuapp.com/booking',
            { data: booking }
        );
        let responseBody = await response.json();
        expect(response.status()).toBe(200);
        expect(responseBody.booking).toEqual(booking);
        expect(responseBody.bookingid).toEqual(expect.any(Number));
    });
}

test('Update Booking returns 403 without authentication', async ({ request }) => {
    let response = await request.put('https://restful-booker.herokuapp.com/booking/10', {data: updatedBookingData});
    expect(response.status()).toBe(403);
});
test('update Booking returns 200 and updates properly with authentication', async ({ request }) => {
    let response = await request.put('https://restful-booker.herokuapp.com/booking/10', {
        data: updatedBookingData,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Cookie': 'token=' + token
        }
    })
    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual(updatedBookingData);
});

test('Get Booking Details returns 200 and correct booking information', async ({ request }) => {
    let response = await request.get('https://restful-booker.herokuapp.com/booking/10');
    let responseBody = await response.json();   
    expect(response.status()).toBe(200);
    // Here I learned that as tests run in parallel, maybe user with id=10 has not this data updated in a previous test yet, so this expects may fail.
    expect(responseBody.firstname).toBe('Adrian');
    expect(responseBody.lastname).toBe('Ponce de Leon');
    // Validate the response against the booking schema
    expect(validateBookingSchema(responseBody)).toBe(true);
});
const axios = require('axios');
require('dotenv').config();

// === Fetch Access Token ===
const fetchAccessToken = async () => {
    console.log('🔐 Starting access token fetch...');

    try {
        const params = new URLSearchParams({
            client_id: process.env.EVENTSAIR_CLIENT_ID || '13a8d085-9bc1-48f7-b867-c7fa7db7dc16',
            scope: 'https://eventsairprod.onmicrosoft.com/85d8f626-4e3d-4357-89c6-327d4e6d3d93/.default',
            client_secret: process.env.EVENTSAIR_CLIENT_SECRET || 'iYv8Q~7I7JtfpL4rVp4C22Ph3cASiNJJ64mdBbbx',
            grant_type: 'client_credentials'
        });

        console.log('📡 Sending token request to Microsoft...');
        const response = await axios.post(
            'https://login.microsoftonline.com/dff76352-1ded-46e8-96a4-1a83718b2d3a/oauth2/v2.0/token',
            params,
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        console.log('✅ Access token received successfully');
        return response.data.access_token;
    } catch (error) {
        console.error('❌ Token Fetch Error:', error.response?.data || error.message);
        throw new Error('Failed to fetch access token');
    }
};

// === Fetch Events via GraphQL ===
const fetchEvents = async (accessToken) => {
    console.log('🎯 Fetching events using GraphQL with access token');

    const graphqlQuery = {
        query: `
            {
                events {
                    id
                    name
                    startDate
                    endDate
                }
            }
        `,
        variables: {}
    };

    try {
        console.log('📡 Sending GraphQL request to EventsAir...');
        const response = await axios.post(
            'https://api.eventsair.com/graphql',
            graphqlQuery,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );

        console.log('✅ Events fetched successfully');
        return response.data;
    } catch (error) {
        console.error('❌ GraphQL Fetch Error:', error.response?.data || error.message);
        throw new Error('Failed to fetch events');
    }
};


const fetchContacts = async (accessToken, eventID) => {
    console.log('🎯 Fetching contacts for event ID:', eventID);

    const graphqlQuery = {
        query: `
            {
                event(id: "${eventID}") {
                    contacts {
                        id
                        firstName
                        lastName
                        primaryEmail
                        organizationName
                        jobTitle
                        contactPhoneNumbers {
                            mobile
                        }
                        primaryAddress {
                            city
                            country
                        }
                    }
                }
            }
        `,
        variables: {}
    };

    try {
        console.log('📡 Sending GraphQL request to fetch contacts...');
        const response = await axios.post(
            'https://api.eventsair.com/graphql',
            graphqlQuery,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );
        const contacts = response.data.data.event.contacts;
        console.log(`✅ Fetched ${contacts.length} contacts`);
        return contacts;
    } catch (error) {
        console.error('❌ Contacts Fetch Error:', error.response?.data || error.message);
        throw new Error('Failed to fetch contacts');
    }
}

module.exports = { fetchAccessToken, fetchEvents, fetchContacts };

import * as prismic from '@prismicio/client';

const endpoint = 'https://restofr.prismic.io/api/v2';
const client = prismic.createClient(endpoint);

export default client;

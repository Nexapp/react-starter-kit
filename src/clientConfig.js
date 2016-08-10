export const head = {
    titleTemplate: 'React Starter Kit -  %s',
    defaultTitle: 'React Starter Kit',
    meta: [
        { name: 'description', content: 'Boilerplate for react.js' },
        { charset: 'utf-8' },
        { property: 'og:site_name', content: 'React Starter Kit' },
        { property: 'og:image', content: '/logo.png' },
        { property: 'og:image:width', content: '180' },
        { property: 'og:image:height', content: '180' },
        { property: 'og:locale', content: 'en_US' },
        { property: 'og:title', content: 'React Starter Kit' },
        { property: 'og:description', content: 'Boilerplate for react.js' },
        { property: 'og:card', content: 'summary' },
        { property: 'og:site', content: 'React Starter Kit' },
        { property: 'og:creator', content: 'React Starter Kit' },
    ]
};

export const apiHost = process.env.APIHOST || 'YOUR_API_URL';

export const apiHeader = [
    { name: 'Accept-Language', value: 'en' },
];

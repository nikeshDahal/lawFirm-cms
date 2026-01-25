import { createRoot } from 'react-dom/client';

// third party
import { Provider } from 'react-redux';

// project imports
import App from 'App';
import { persister, store } from 'store';
import * as serviceWorker from 'serviceWorker';
import reportWebVitals from 'reportWebVitals';
import { ConfigProvider } from 'contexts/ConfigContext';

// style + assets
import 'assets/scss/style.scss';

// map
import 'mapbox-gl/dist/mapbox-gl.css';

// google-fonts
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/700.css';

import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';

import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';

import {
    ApolloClient,
    ApolloLink,
    ApolloProvider,
    FetchResult,
    GraphQLRequest,
    InMemoryCache,
    Observable,
    createHttpLink
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';

import { REFRESH_TOKEN } from 'views/pages/authentication/graphql';
import { RefreshTokenResponse } from 'types/auth';
import { GraphQLError } from 'graphql';
import { PersistGate } from 'redux-persist/integration/react';

// ==============================|| REACT DOM RENDER ||============================== //

// Request a refresh token to then stores and returns the accessToken.
const requestRefreshToken = async () => {
    try {
        let refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            return '';
        }
        const refreshResolverResponse = await client.mutate<{
            refresh: RefreshTokenResponse;
        }>({
            mutation: REFRESH_TOKEN,
            variables: { refreshToken }
        });

        const accessToken = refreshResolverResponse.data?.refresh?.accessToken;
        refreshToken = String(refreshResolverResponse.data?.refresh?.refreshToken || '');
        localStorage.setItem('accessToken', accessToken || '');
        localStorage.setItem('refreshToken', refreshToken || '');
        return accessToken;
    } catch (err) {
        throw err;
    }
};

const logout = () => {
    localStorage.clear();
    document.location.href = '/login'; // Redirect to login page after clearing session
};

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
        for (let err of graphQLErrors) {
            switch (err?.extensions?.code) {
                case 'UNAUTHENTICATED':
                    // ignore 401 error for a refresh request
                    if (operation.operationName === 'RefreshToken') {
                        logout();
                        return;
                    }
                    const observable = new Observable<FetchResult<Record<string, any>>>((observer) => {
                        // used an annonymous function for using an async function
                        (async () => {
                            try {
                                const accessToken = await requestRefreshToken();
                                if (!accessToken) {
                                    throw new GraphQLError('Empty AccessToken');
                                }
                                // Retry the failed request
                                const subscriber = {
                                    next: observer.next.bind(observer),
                                    error: observer.error.bind(observer),
                                    complete: observer.complete.bind(observer)
                                };

                                forward(operation).subscribe(subscriber);
                            } catch (error: any) {
                                observer.error(error);
                            }
                        })();
                    });

                    return observable;
                case 'FORBIDDEN':
                    // Handle 403 Forbidden error: log the user out
                    logout();
                    return;
                case 'DISABLED_USER':
                    logout();
                    return;
                     // fix this later Handle 403 Forbidden error: log the user out
                // case 'INTERNAL_SERVER_ERROR':
                //     logout();
                //     return;
            }
        }
    }

    if (networkError) console.log(`[Network error]: ${networkError}`);
});

/* GRAPHQL CLIENT INIT  */
const httpLink = createHttpLink({
    uri: import.meta.env.VITE_APP_GRAPHQL_URL
    //process.env.REACT_APP_GRAPHQL_URI
});

function isRefreshRequest(operation: GraphQLRequest) {
    return operation.operationName === 'RefreshToken';
}

// Returns accesstoken if opoeration is not a refresh token request
function returnTokenDependingOnOperation(operation: GraphQLRequest) {
    if (isRefreshRequest(operation)) {
        return localStorage.getItem('refreshToken') || '';
    }
    return localStorage.getItem('accessToken') || '';
}

const authLink = setContext((operation, { headers }) => {
    // get the authentication token from local storage if it exists

    let token = returnTokenDependingOnOperation(operation);
    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : ''
        }
    };
});

const client = new ApolloClient({
    link: ApolloLink.from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache({ addTypename: false })
});

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persister}>
            <ConfigProvider>
                <ApolloProvider client={client}>
                    <App />
                </ApolloProvider>
            </ConfigProvider>
        </PersistGate>
    </Provider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

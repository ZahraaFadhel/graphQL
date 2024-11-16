import { ApolloProvider } from '@apollo/client';
import client from '../lib/apolloClient';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import '../styles/globals.css';

export function MyApp({ Component, pageProps }) {
  const router = useRouter();

  // Prevent rendering the component if redirecting
  if (router.pathname === '/') {
    return null;
  }

  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default MyApp;
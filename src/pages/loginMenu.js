'use client';
import * as React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { auth, signInWithGoogle } from "../lib/firebase.js";
import { signOut } from "firebase/auth";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Button,
  Box,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import GoogleIcon from '@mui/icons-material/Google';

const theme = createTheme();

export default function LoginMenuPage() {
  const [loginUser, setLoginUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setLoginUser(user);
    });
    return unsubscribe;
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Head>
        <title>Login Menu</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            AutoStocker
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xs"> 
        <Grid container spacing={3} mt={2}>
          <Grid item xs={12}>
            <Typography variant="h4" component="h1" align="center" gutterBottom>
              Login Menu
            </Typography>
          </Grid>
          {loginUser ? (
            <>
              <Grid item xs={12} align="center">
                <Typography variant="h6" gutterBottom>
                  Welcome, {loginUser.displayName}!
                </Typography>
                <Button variant="contained" color="primary" onClick={() => signOut(auth)}>
                  Logout
                </Button>
              </Grid>

              {/* ログインしている場合のみ表示する部分 */}
              <Grid item xs={12}>
                <Box display="flex" justifyContent="space-around"> 
                  <Link href="./" style={{ textDecoration: 'none' }}>
                    <Button>Home Page</Button>
                  </Link>
                  <Link href="./autoStock" style={{ textDecoration: 'none' }}>
                    <Button>AutoStocker Page</Button>
                  </Link>
                </Box>
              </Grid>
            </>
          ) : (
            <Grid item xs={12} align="center">
              <Button variant="contained" startIcon={<GoogleIcon />} onClick={signInWithGoogle}>
                Sign in with Google
              </Button>
            </Grid>
          )}
        </Grid>
      </Container>
    </ThemeProvider>
  );
}
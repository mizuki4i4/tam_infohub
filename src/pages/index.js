'use client';
import * as React from 'react';
import Link from 'next/link';
import Head from "next/head";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Button
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme(); // デフォルトテーマを使用

export default function HomePage() {
  return (
    <ThemeProvider theme={theme}>
      <Head>
        <title>Home Page</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            AutoStocker
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm"> {/* コンテンツの最大幅を制限 */}
        <Grid container spacing={3} mt={2}> 
          <Grid item xs={12}>
            <Typography variant="h3" component="h1" align="center" gutterBottom>
              AutoStocker
            </Typography>
          </Grid>
          <Grid item xs={12} align="center">
            <Button variant="contained" color="primary">
              <Link href="./loginMenu">Login Menu</Link>
            </Button>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}
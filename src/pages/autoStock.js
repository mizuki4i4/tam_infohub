'use client';
import * as React from "react";
import Link from "next/link";
import Image from 'next/image';
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Button,
  Box,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Chip,
  Checkbox,
  CircularProgress,
} from "@mui/material";
import {
  LocalizationProvider,
  DateRangePicker,
} from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ReactHtmlParser from 'html-react-parser';

// 他の表示したい画面のコンポーネントをインポート (例: OtherDataComponent)
function OtherDataComponent() {
  return (
    <div>
      <h2>ComingSoon...</h2>
      {/* ここに他のデータを表示する内容を記述 */}
    </div>
  );
}

const theme = createTheme();

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function MsaPageContent() {
  // State
  const [msas, setMsas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tabValue, setTabValue] = React.useState(0);
  const [selectedMsa, setSelectedMsa] = useState(null); 
  const [openDialog, setOpenDialog] = useState(false);
  const [openSummaryDialog, setOpenSummaryDialog] = useState(false);
  const [value, setValue] = React.useState([null, null]); // デフォルト値を設定
  const [selectedRows, setSelectedRows] = useState([]);
  const [summary, setSummary] = useState(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);

  // Handler
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleOpenDialog = (msa) => {
    setSelectedMsa(msa); 
    setOpenDialog(true); 
  };

  const handleCloseDialog = () => {
    setOpenDialog(false); 
  };

  const handleDateChange = (newValue) => {
    setValue(newValue);
  };

  const handleCheckboxChange = (msaId) => {
    setSelectedRows(prevSelectedRows => {
      if (prevSelectedRows.includes(msaId)) {
        return prevSelectedRows.filter(id => id !== msaId); // チェックを外す
      } else {
        return [...prevSelectedRows, msaId]; // チェックを入れる
      }
    });
  };

  // FilterDate
  const filteredMsas = value[0] && value[1]
  ? msas.filter(msa => {
      const day = new Date(msa.day);
      return day >= value[0] && day <= value[1];
    })
  : msas; // 日付範囲が選択されていない場合は全データを表示

  // Connect Serverside

  // fetchMsas
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/msas');
        const data = await res.json();
        setMsas(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // isLoadingSummary を監視して再レンダリング
  useEffect(() => {
    if (summary && !isLoadingSummary) {
      setOpenSummaryDialog(true);
    }
  }, [summary, isLoadingSummary]);

  // postGemini
  const handleCatClick = async () => {
    setIsLoadingSummary(true); // ロード開始

    if (selectedRows.length > 0) {
      const selectedMsas = filteredMsas.filter(msa => selectedRows.includes(msa.id)); 
  
      const jsonString = JSON.stringify(selectedMsas);
      const requestText = "You are a technical account manager.Please summarize the MSA below. Please be sure to return the output format only in HTML." + jsonString; // 日本語で指示
  
      try {
        const response = await fetch('/api/createSummary', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: requestText }),
        });
  
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
  
        const summaryData = await response.json(); // レスポンスを JSON として解析
        setSummary(summaryData); // 取得したデータを state にセット
        setIsLoadingSummary(false);
        setOpenSummaryDialog(true); 
      } catch (error) {
        console.error('Error sending data to Gemini:', error);
        setIsLoadingSummary(false); 
      }
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs value={tabValue} onChange={handleTabChange} aria-label="basic tabs example">
        <Tab label="MSAs" {...a11yProps(0)} />
        <Tab label="Launch" {...a11yProps(1)} />
        <Tab label="HeadsUp" {...a11yProps(2)} />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateRangePicker
            label="Date Range"
            value={value}
            onChange={handleDateChange}
            renderInput={(startProps, endProps) => (
              <>
                <TextField {...startProps} />
                <Box sx={{ mx: 2 }}> to </Box>
                <TextField {...endProps} />
              </>
            )}
          />
        </LocalizationProvider>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <TableContainer component={Paper} sx={{ maxHeight: 800 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell>Day</TableCell>
                  <TableCell>Bug Link</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Body</TableCell>
                  <TableCell>✓</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredMsas.length > 0 ? ( 
                  filteredMsas.map((msa) => (
                    <TableRow key={msa.id} hover>
                      <TableCell>
                        {new Intl.DateTimeFormat('ja-JP', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                        }).format(new Date(msa.day))}
                      </TableCell>
                      <TableCell>
                        {msa.bugLink ? (
                          <a
                            href={`https://b.corp.google.com/issues/${msa.bugLink.replace(/^b\//, '')}`} 
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {msa.bugLink}
                          </a>
                        ) : (
                          "N/A"
                        )}
                      </TableCell>
                      <TableCell>
                      <Chip
                        label={msa.category || "N/A"}
                        sx={{
                          backgroundColor:
                            msa.category === 'GCP' ? 'blue' :
                            msa.category === 'Workspace' ? 'green' :
                            msa.category === 'Other' ? 'gray' : 'gray',
                          color: 'white',
                        }}
                      />
                      </TableCell>
                      <TableCell>{msa.subjectOriginal}</TableCell>
                      <TableCell sx={{
                        color: 'blue',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                      }} onClick={() => handleOpenDialog(msa)}>
                        Content
                      </TableCell>  
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedRows.includes(msa.id)}
                          onChange={() => handleCheckboxChange(msa.id)}
                        />
                      </TableCell>
                    </TableRow> // Added a comma here
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No data found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {/* Dialog Content */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md">
          <DialogTitle>{selectedMsa?.subjectOriginal}</DialogTitle>
          <DialogContent>
            {ReactHtmlParser(selectedMsa?.content || "")} 
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Close</Button>
          </DialogActions>
        </Dialog> 
        {/* Dialog Summary */}
        {isLoadingSummary && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 9999,
          }}>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              padding: '20px',
              borderRadius: '8px',
              backgroundColor: 'white' 
            }}>
              <CircularProgress style={{ marginBottom: '16px' }} />
              <p style={{ fontSize: '16px', fontWeight: 'bold' }}>Waiting for response from Gemini...</p>
              <p style={{ fontSize: '14px', color: 'gray' }}>Now creating summary data</p>
            </div>
          </div>
        )}
      <Dialog
          open={openSummaryDialog}
          onClose={() => setOpenSummaryDialog(false)}
          maxWidth="md"
          PaperProps={{
            sx: {
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            },
          }}
        >
        <DialogContent>
          <DialogContentText>
            {summary && ReactHtmlParser(summary.generatedContent || "")}
          </DialogContentText>
        </DialogContent>
      </Dialog>
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <OtherDataComponent /> 
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <OtherDataComponent /> 
      </TabPanel>
      {selectedRows.length > 0 && (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', borderRadius: '10px'}}>
          <Image
            src="/cat2.png"
            alt="Cat"
            width={100}
            height={100}
            style={{ borderRadius: '10px' }}
            onClick={handleCatClick}
            style={{ cursor: 'pointer' }}
          />
          <div
            style={{
              position: 'absolute',
              top: '90%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '8px',
              textShadow: '1px 1px 2px black', // 影をつける
            }}
          >
            Summarize?
          </div>
        </div>
      )}
    </Box>
  );
}

export default function AutoStockerPage() {
  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            AutoStocker
          </Typography>
          <Button color="inherit">
            <Link href="./loginMenu">Login Menu</Link>
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl"> 
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12}>
            <Typography variant="h4" component="h1" gutterBottom>
              Customer Update Info
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <MsaPageContent />
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}
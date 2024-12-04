import React, { useEffect, useState } from "react";
import {
  Button,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  TablePagination,
  InputAdornment,
} from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { addCountry, fetchCountries, removeCountry } from "../store/countrySlice";
import TravelExploreIcon from '@mui/icons-material/TravelExplore';

const AddCountry:React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const allCountries = useSelector((state: RootState) => state.countries.allCountries)
  const addedCountries = useSelector((state: RootState) => state.countries.addedCountries)
  const [isAdd, setIsAdd] = useState<boolean>(false);
  const [error, setError]= useState<boolean | string>(false);
  const [countryName, setCountryName] = useState('');
  const [sign, setSign]=useState('');
  const [hours, setHours]=useState<string>('');
  const [minutes, setMinutes]=useState<string>('');
  const [signError, setSignError] = useState<string | boolean>(false);
  const [hoursError, setHoursError] = useState<string | boolean>(false);
  const [minutesError, setMinutesError] = useState<string | boolean>(false);
  const [searchCountry, setSearchCountry] = useState('')

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  

  useEffect(()=>{
    dispatch(fetchCountries());
  },[dispatch])

  useEffect(()=>{
    const handler = setTimeout(()=>{
      if(countryName.trim() !== ''){
        const isvalid = allCountries.some((country)=>
        country.name.toLowerCase() === countryName.toLowerCase()
      );
      setError(!isvalid);
      }else{
        setError(false);
      }
    }, 500);

    return ()=>{
      clearTimeout(handler);
    }
  }, [countryName, allCountries]);
  useEffect(() => {
    const savedCountries = JSON.parse(localStorage.getItem('countries') || '[]');
      if (savedCountries.length > 0) {
        const currentCountryName = addedCountries.map((country)=>country.name)
      savedCountries.forEach((country: any) => {
        if(!currentCountryName.includes(country.name)){
        dispatch(
          addCountry({
            id: 0,
            name: country.name,
            flag: country.flag,
            timezone: country.timezone,
          })
        );
      }});
    }
  },[addedCountries, dispatch]);
  

  const handleClose = () =>{
    setCountryName('');
    setSign('');
    setHours('');
    setMinutes('');
    setSignError(false);
    setHoursError(false);
    setMinutesError(false);
    setIsAdd(false);
  }

  const handleBlur = ( type:string) => {
    if (type ==='sign' && !/^[+-]$/.test(sign)) {
      setSignError("Sign must be '+' or '-'");
    }else{
      setSignError(false);
    }

    if (type === 'hours' && (!/^\d{1,2}$/.test(hours) || parseInt(hours) > 14)) {
      setHoursError("Hours must be between 00 and 14");
    } else {
      setHoursError(false);
    }

    if (type === 'minutes' && (!/^\d{2}$/.test(minutes) || ![0, 30].includes(parseInt(minutes)))) {
      setMinutesError("Minutes must be '00' or '30'");
    } else {
      setMinutesError(false);
    }

  };

  const timeZone = `${sign}${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(countryName === '' || sign === ''  || hours === '' || minutes === '' || minutesError === 'true' ){
      alert("All fields are required");
    }
    else{
    const countryExists = allCountries.find((country: { name: string }) => country.name.toLowerCase() === countryName.toLowerCase());
  
    if (!countryExists) {
      alert('Country not found');
      return;
    }
  
    const currentCountries = JSON.parse(localStorage.getItem('countries') || '[]');
    
    if (!currentCountries.some((existingCountry: { name: string }) => existingCountry.name === countryExists.name)) {
      const updatedCountries = [...currentCountries, { name: countryExists.name, flag: countryExists.flag, timezone: timeZone }];
      localStorage.setItem('countries', JSON.stringify(updatedCountries));
      dispatch(
        addCountry({
          id: 0,
          name: countryExists.name,
          flag: countryExists.flag,
          timezone: timeZone,
        })
      );
    }
    setIsAdd(false);
    setCountryName('');
    setSign('');
    setHours('');
    setMinutes('');
  }
  };

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement>| null, newPage: number)=>{
    setPage(newPage);
  }

  const handleChangeRowsPerPage = ( event: React.ChangeEvent<HTMLInputElement |HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }
  
  const handleSearchChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setSearchCountry(e.target.value.toLowerCase())
  }
  const filteredCountry = addedCountries.filter((country)=>
    country.name.toLowerCase().includes(searchCountry.toLowerCase())
  )

  const handleDelete = (name: string) => {
    const updatedCountry = addedCountries.filter(item => item.name !== name);
    dispatch(removeCountry(updatedCountry));
    localStorage.setItem('countries', JSON.stringify(updatedCountry));
  };
  


  return (
    <>
    <div>
      {addedCountries.length > 0 ? (
        <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: { xs: 2, md:4 },
          position: "relative",
          mb:3,
        }}
      >
        <Box
          display="flex"
          justifyContent="space-around"
          marginTop="50px"
          alignItems="center"
          width="100%"
          mb={2}
        >
             <Box 
      sx={{display: 'flex',
        justifyContent: 'flex-start',
        ml: 14,
      }}>
      <TextField
        sx={{
          mt: 3,
          mb: 2, 
          width: "300px",
          maxWidth: "300px",
          '& .MuiInputBase-input': {
            height: "10px",
          },
          '& .MuiOutlinedInput-root':{
            borderRadius: "50px"
          },
          '@media (max-width: 600px)':{
            maxWidth: "100%"
          },
          textAlign: { xs: "center", sm: "left"}
        }}
          id="outlined-basic"
          variant="outlined"
          placeholder="Search..."
          label="Search Country"
          value={searchCountry}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment:(
              <InputAdornment position="start">
              <TravelExploreIcon/>
              </InputAdornment>
            )
          }}
        ></TextField>
        </Box>
          <Button sx={{ minWidth: 120, textAlign: { xs: 5}}} 
           size="small" variant="contained" onClick={()=> setIsAdd(true)} style={{ width:"100px"}}>
            Add Country
          </Button>
        </Box>
          <Box
            sx={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TableContainer component={Paper}>
              <Table sx={{minWidth: 650}} aria-labelledby="simple table">
                <TableHead sx={{backgroundColor: "#f1f1f1"}}>
                  <TableRow sx={{
                          fontSize: { xs: "0.8rem", sm: "1rem" },
                          "@media (max-width: 600px)": {
                            padding: "8px",
                          },
                        }}>
                    <TableCell sx={{
                    fontWeight: "bold",
                    textAlign: { xs: "center", sm: "left" },
                  }} >S. No</TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        textAlign: { xs: "center", sm: "left" },
                      }}
                    >Country Name</TableCell>

                    <TableCell sx={{
                    fontWeight: "bold",
                    textAlign: { xs: "center", sm: "left" },
                  }}
                    >Flag</TableCell>

                    <TableCell sx={{
                    fontWeight: "bold",
                    textAlign: { xs: "center", sm: "left" },
                  }}>Time Zone</TableCell>

                    <TableCell sx={{
                    fontWeight: "bold",
                    textAlign: { xs: "center", sm: "left" },
                  }}>Delete</TableCell>

                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCountry
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item, index) => (
                    <TableRow key={index} sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}>
                      <TableCell>{index + 1 + page * rowsPerPage}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>
                        <img
                          src={item.flag}
                          alt={`${item.name} flag`}
                          style={{ width: "40px", height: "auto" }}
                        />
                      </TableCell>
                      <TableCell>{item.timezone}</TableCell>
                      <TableCell>
                        <Button onClick={(e)=>handleDelete(item.name)}><DeleteForeverIcon color="error"/></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
              rowsPerPageOptions={[5,10,25]}
              component="div"
              count={filteredCountry.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableContainer>
          </Box>
      </Box>
      ) : (
        <div>
          <Typography
            variant="h6"
            component="div"
            align="center"
            sx={{ mt: 20 }}
          >
            No countries added yet. Please add a country and its time zone.
          </Typography>
          <Box textAlign={"center"} sx={{ mt: 3 }}>
          <Button sx={{ minWidth: 120, textAlign: { xs: 5}}} 
           size="small" variant="contained" onClick={()=> setIsAdd(true)} style={{ width:"100px"}}>
            Add Country
          </Button>
          </Box>
        </div>
      )}

      <Dialog
        open={isAdd}
        onClose={handleClose}
        sx={{ "& .MuiDialog-paper": {
          width: { xs: "90%", sm: "400px"},
          height: "auto",
          padding: { xs: 2, sm: 3},
        } }}
      >
        <DialogTitle style={{ textAlign: "center" }}>Add Country</DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <TextField
            required
            name="countryName"
            label="Country Name"
            value={countryName}
            error={!!error}
            helperText={error ?"Country Not Found": ""}
            onChange={(e)=>setCountryName(e.target.value)}
            placeholder="Enter Country Name"
            fullWidth
            autoComplete="off"
            sx={{ marginTop: "6px" }}
          />
          <Box>
          <TextField
              required
              name="timezone-sign"
              label="Sign"
              placeholder="+/-"
              value={sign}
              error={!!signError}
              helperText={signError && (
                <Typography variant="body2" color="error" sx={{ whiteSpace: 'nowrap' }}>
                  {signError}
                </Typography>)}
              autoComplete="off"
              onChange={(e) => setSign(e.target.value)}
              onBlur={()=>handleBlur('sign')} 
              inputProps={{ maxLength: 1 }}
              sx={{ width: '60px', marginRight: '10px' }}
            />

            <TextField
              required
              name="timezone-hours"
              label="Hours"
              placeholder="00"
              autoComplete="off"
              value={hours}
              error={!!hoursError}
              helperText={hoursError && (
                <Typography variant="body2" color="error" sx={{ whiteSpace: 'nowrap' }}>
                  {hoursError}
                </Typography>
              )}
              onChange={(e) => setHours(e.target.value)}
              onBlur={()=>handleBlur('hours')} 
              inputProps={{ maxLength: 2 }}
              sx={{ width: '60px', marginRight: '10px' }}
            />

            <TextField
              required
              name="timezone-minutes"
              label="Minutes"
              placeholder="00"
              value={minutes}
              error={!!minutesError}
              helperText={minutesError && (
                <Typography variant="body2" color="error" sx={{ whiteSpace: 'nowrap' }}>
                  {minutesError}
                </Typography>
              )}
              autoComplete="off"
              onChange={(e) => setMinutes(e.target.value)}
              onBlur={()=>handleBlur("minutes")} 
              inputProps={{ maxLength: 2 }}
              sx={{ width: '60px', marginRight: '10px' }}
            />

            {/* {error && (
              <p style={{ color: 'red', marginTop: '10px' }}>
                {error}
              </p>
            )} */}
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", gap:2 }}>
          <Button variant="outlined" onClick={handleClose} key={isAdd? 'open': 'close'}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      </div>
    </>
  );
};


export default AddCountry;

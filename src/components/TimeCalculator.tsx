import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Grid,
  TablePagination,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import moment from "moment";
import { removeCalculatedCountry, setAddedCountries, setCalculatedTimes } from "../store/countrySlice";
import DeleteForeverIcon  from "@mui/icons-material/DeleteForever";

const TimeCalculator: React.FC = () => {
  const dispatch = useDispatch();
  const addedCountries = useSelector((state: RootState) => state.countries.addedCountries);
  const calculatedTimes = useSelector((state: RootState) => state.countries.calculatedTimes);

  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [inputTime, setInputTime] = useState<string>("");

  const [page, setPage] = useState(0);  
  const [rowsPerPage, setRowsPerPage] = useState(5); 

  useEffect(() => {
    const storedCountries = JSON.parse(localStorage.getItem("countries") || "[]");
    if (storedCountries.length > 0) {
      dispatch(setAddedCountries(storedCountries)); 
    }

    const storedTimes = JSON.parse(localStorage.getItem("calculatedTimes") || "[]");
    if (storedTimes.length > 0) {
      dispatch(setCalculatedTimes(storedTimes)); 
    }
  }, []);

  const handleCountryChange = (e: SelectChangeEvent<string>) => {
    setSelectedCountry(e.target.value);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputTime(e.target.value);
  };

  const handleCalculateTime = () => {
    if (!selectedCountry || !inputTime) {
      alert("Please select a country and enter a time.");
      return;
    }

    const selectedCountryData = addedCountries.find(
      (country) => country.name === selectedCountry
    );

    if (!selectedCountryData || !selectedCountryData.timezone) {
      alert("Selected country has an invalid timezone.");
      return;
    }

    try {
      const selectedOffset = selectedCountryData.timezone;
      const inputDateTime = moment
        .utc(`${moment().format("YYYY-MM-DD")}T${inputTime}`, "YYYY-MM-DDTHH:mm:ss")
        .utcOffset(selectedOffset, true);

      if (!inputDateTime.isValid()) {
        alert("Invalid time format. Please use HH:mm:ss.");
        return;
      }

      const updatedTimes = addedCountries.map((country) => {
        const timeInCountry = inputDateTime.clone().utcOffset(country.timezone).format("HH:mm:ss");
        return { country: country.name, time: timeInCountry };
      });

      dispatch(setCalculatedTimes(updatedTimes));
      localStorage.setItem("calculatedTimes", JSON.stringify(updatedTimes)); 
    } catch (error) {
      console.error("Error calculating times:", error);
      alert("An error occurred while calculating times.");
    }
  };

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); 
  };



  const handleDelete = ( country: string)=>{
    const updatedCountry = calculatedTimes.filter(item=> item.country !== country);
    dispatch(removeCalculatedCountry(updatedCountry))
    localStorage.setItem("calculatedTimes", JSON.stringify(updatedCountry));
  }
  
  return (
    <div style={{ width: "100%", maxWidth: "650px", margin: "0 auto", padding: "0 16px" }}>
    <Box sx={{ mt: 10, textAlign: "center" }}>
      <Grid container spacing={2} justifyContent="center" alignItems="center" sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <FormControl style={{ width:"200px"}}>
            <InputLabel>Select Country</InputLabel>
            <Select
              labelId="select-label"
              id="select"
              value={selectedCountry}
              onChange={handleCountryChange}
            >
              {addedCountries.length === 0 ? (
                <MenuItem disabled>No countries available</MenuItem>
              ) : (
                addedCountries.map((country: any) => (
                  <MenuItem key={country.name} value={country.name}>
                    {country.name}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            style={{ width:"200px"}}
            required
            name="time"
            label="Current Time"
            placeholder="HH:MM:SS"
            value={inputTime}
            onChange={handleTimeChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Button size="small" variant="contained" onClick={handleCalculateTime} style={{ width:"100px"}}>
            Calculate
          </Button>
        </Grid>
      </Grid>

      {calculatedTimes.length > 0 && (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 300}} aria-labelledby = "simple table" >
            <TableHead sx={{backgroundColor: "#f1f1f1"}}>
              <TableRow>
                <TableCell sx={{
                    fontWeight: "bold",
                    textAlign: { xs: "center", sm: "left" },
                  }}>ID</TableCell>
                <TableCell sx={{
                    fontWeight: "bold",
                    textAlign: { xs: "center", sm: "left" },
                  }}>Country Name</TableCell>
                <TableCell sx={{
                    fontWeight: "bold",
                    textAlign: { xs: "center", sm: "left" },
                  }}>Current Time</TableCell>
                  <TableCell sx={{
                    fontWeight: "bold",
                    textAlign: { xs: "center", sm: "left" },
                  }}>Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {calculatedTimes
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((countryTime, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1 + page * rowsPerPage}</TableCell>
                  <TableCell>{countryTime.country}</TableCell>
                  <TableCell>{countryTime.time}</TableCell>
                  <TableCell>
                    <Button onClick={(e)=>handleDelete(countryTime.country)}><DeleteForeverIcon color="error"/></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
          rowsPerPageOptions={[5, 10]}
          component="div"
          count={calculatedTimes.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      )}
    </Box>
    </div>
  );
};

export default TimeCalculator;

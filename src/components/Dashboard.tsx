import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { fetchCountries } from "../store/countrySlice";
import TravelExploreIcon from '@mui/icons-material/TravelExplore';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const allCountries = useSelector((state: RootState) => state.countries.allCountries);
  
  const [page, setPage] = useState(0);  
  const [rowsPerPage, setRowsPerPage] = useState(5); 
  const [ searchCountry, setSearchCountry] = useState('');

  useEffect(() => {
    dispatch(fetchCountries());
  }, [dispatch]);

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
    setSearchCountry(e.target.value.toLowerCase());
    setPage(0)
  }

  const filteredCountry = allCountries.filter(country=>
    country.name.toLowerCase().includes(searchCountry.toLowerCase())
  )

  return (
    <div style={{ width: "100%", maxWidth: "650px", margin: "0 auto", padding: "0 16px" }}>
       <TextField
        sx={{
          mt: 10, mb:2,
          width: "300px",
          maxWidth: "300px",
          '& .MuiInputBase-input': {
            height: "15px",
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 0.5,
          // mt: 10,
        }}
      >
        <TableContainer component={Paper}>
          <Table sx={{minWidth: 600}} aria-labelledby="simple table">
            <TableHead sx={{backgroundColor: "#f1f1f1", color: 'white'}}>
              <TableRow>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    textAlign: { xs: "center", sm: "left" },
                  }}
                >
                  S. No
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    textAlign: { xs: "left", sm: "left" },
                  }}
                >
                  Country Name
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    textAlign: { xs: "center", sm: "center" },
                  }}
                >
                  Flag
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCountry
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) 
                .map((item, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell
                      sx={{
                        textAlign: { xs: "center", sm: "left" },
                      }}
                    >
                      {index + 1 + page * rowsPerPage}  
                    </TableCell>
                    <TableCell
                      sx={{
                        textAlign: { xs: "center", sm: "left" },
                      }}
                    >
                      {item.name}
                    </TableCell>
                    <TableCell
                      sx={{
                        textAlign: { xs: "center", sm: "left" },
                      }}
                    >
                      <img
                        src={item.flag}
                        alt={`${item.name} flag`}
                        style={{
                          width: "40px",
                          height: "auto",
                          display: "block",
                          margin: "0 auto",
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredCountry.length}  
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Box>
    </div>
  );
};

export default Dashboard;

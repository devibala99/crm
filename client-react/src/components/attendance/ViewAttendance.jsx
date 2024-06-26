/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAttendance, deleteAttendance } from '../features/attendanceSlice';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tooltip } from '@mui/material';
import SidebarBreadcrumbs from '../../navigationbar/SidebarBreadcrumbs';
import WarningModal from '../master/WarningModal';
import warningSign from "../master/assets/exclamation-mark.png"; import { Link } from 'react-router-dom';
import { Delete as DeleteIcon } from '@mui/icons-material';
import "./viewAttendance.css"
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Pagination from '@mui/material/Pagination'

import { styled } from '@mui/system';

const StyledTableHead = styled(TableHead)({
    backgroundColor: "#D3D3D3",
});

const StyledTableCell = styled(TableCell)({
    color: '#545453',
    fontWeight: 'bold',
    fontSize: "15px",
});
// Custom styled components for Previous and Next buttons
const PrevButton = styled('button')({
    color: '#0090dd',
    backgroundColor: 'transparent',
    boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px',
    borderRadius: '4px',
    padding: '8px 10px',
    fontSize: '13px',
    margin: '0 10px',
    cursor: 'pointer',
    border: 'none',
});

const NextButton = styled('button')({
    color: '#0090dd',
    backgroundColor: 'transparent',
    boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px',
    borderRadius: '4px',
    padding: '8px 10px',
    fontSize: '13px',
    margin: '0 10px',
    cursor: 'pointer',
    border: 'none',
});
const ActivePagination = styled(Pagination)(({ theme }) => ({
    '& .MuiPaginationItem-root': {
        color: '#000',
    },
    '& .MuiPaginationItem-page.Mui-selected': {
        backgroundColor: '#0090dd',
        color: '#fff',
    },
}));
const ViewAttendance = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredAttendance, setFilteredAttendance] = useState([]);
    const [page, setPage] = useState(1);
    const employeesAttendance = useSelector(state => state.attendance.empAttendance);

    const dispatch = useDispatch();
    const handleChangePage = (event, value) => {
        setPage(value);
    };
    const attendancePerPage = 10;
    const indexOfLastAttendance = page * attendancePerPage;
    const indexOfFirstEmployee = indexOfLastAttendance - attendancePerPage;
    const currentAttendance = filteredAttendance.slice(indexOfFirstEmployee, indexOfLastAttendance);
    currentAttendance.reverse();
    useEffect(() => {
        dispatch(fetchAttendance());
    }, [dispatch]);

    useEffect(() => {
        const filtered = employeesAttendance.filter(employee =>
            employee && employee.emp_name && employee.emp_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredAttendance(filtered);
    }, [employeesAttendance, searchTerm]);
    const formatDate = (inputDate) => {
        const parts = inputDate.split('-');
        const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
        return formattedDate;
    }
    // delete warning modal
    const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
    const [fieldToDelete, setFieldToDelete] = useState(null);
    const [studentFirstName, setStudentFirstName] = useState('');

    const handleDeleteClick = (attendance) => {
        setIsWarningModalOpen(true);
        // console.log(attendance._id);
        setFieldToDelete(attendance._id);
        setStudentFirstName(attendance.emp_name);
    };
    const handleCancel = () => {
        setIsWarningModalOpen(false);
    };
    const confirmDelete = (fieldToDelete) => {
        // console.log(`Deleting field with ID: ${fieldToDelete}`);
        dispatch(deleteAttendance(fieldToDelete));
        setIsWarningModalOpen(false);
        window.location.reload();
    };



    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    return (
        <div className='attendance-view-container'>
            <div className="content-wrapper">
                <div className="link-view" style={{ border: "none", backgroundColor: "#0090dd", borderRadius: '25px' }}>
                    <Link to="/home/add-attendance"
                        className="custom-link" style={{ fontSize: "16px", textAlign: "center", color: "white", padding: "0 20px 0 20px" }}>
                        <PersonAddIcon style={{ fontSize: "1rem", color: "white" }} />
                        &nbsp; Add Attendance
                    </Link>
                </div>
                <h2 style={{ color: "#0090dd" }}>Manage Employee Attendance</h2>
                <SidebarBreadcrumbs />
            </div>

            <div className="table-view">
                <input
                    className="input-table-search"
                    placeholder="Search"
                    variant="outlined"
                    value={searchTerm}
                    onChange={handleSearch}
                    style={{ padding: "12px", fontSize: "1rem", border: "1px solid rgba(159, 159, 159, 0.497)" }}
                />
                <div className="table-container" style={{ overflowX: 'auto' }}>
                    <TableContainer component={Paper}>
                        <Table>
                            <StyledTableHead>
                                <TableRow >
                                    <StyledTableCell >Name</StyledTableCell>
                                    <StyledTableCell>Status</StyledTableCell>
                                    <StyledTableCell>Permission</StyledTableCell>
                                    <StyledTableCell>Leave</StyledTableCell>
                                    <StyledTableCell>On-Date</StyledTableCell>
                                    <StyledTableCell>On-Time</StyledTableCell>
                                    <StyledTableCell>Relieve-Date</StyledTableCell>
                                    <StyledTableCell>Relieve-Time</StyledTableCell>
                                    <StyledTableCell>Comments</StyledTableCell>
                                    <StyledTableCell align="center">Actions</StyledTableCell>
                                </TableRow>
                            </StyledTableHead>
                            <TableBody>
                                {currentAttendance.length !== 0 ? (
                                    currentAttendance.map((employee, index) => (
                                        <TableRow key={employee._id} style={{ backgroundColor: index % 2 === 1 ? '#f1f1f1af' : 'transparent', height: "0.5rem" }}>
                                            <TableCell>{employee.emp_name}</TableCell>
                                            <TableCell>{employee.status_work}</TableCell>
                                            <TableCell>{employee.permission}</TableCell>
                                            <TableCell>{employee.leave}</TableCell>
                                            <TableCell>{formatDate(employee.in_date)}</TableCell>
                                            <TableCell>{employee.in_time}</TableCell>
                                            <TableCell>{formatDate(employee.out_date)}</TableCell>
                                            <TableCell>{employee.out_time}</TableCell>
                                            <TableCell>{employee.comments}</TableCell>
                                            <TableCell align='center'>
                                                <Tooltip title="Delete">
                                                    <DeleteIcon className="delete-view-btn" onClick={() => handleDeleteClick(employee)} />
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={9} align="center">
                                            No employees found. Add employees.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px', paddingBottom: "2rem" }}>
                <PrevButton
                    onClick={() => handleChangePage(null, page - 1)}
                    disabled={page === 1}
                >
                    Prev
                </PrevButton>
                <ActivePagination
                    count={Math.ceil(filteredAttendance.length / attendancePerPage)}
                    page={page}
                    onChange={handleChangePage}
                    variant="outlined"
                    shape="rounded"
                    hideNextButton
                    hidePrevButton
                />

                <NextButton
                    onClick={() => handleChangePage(null, page + 1)}
                    disabled={page === Math.ceil(filteredAttendance.length / attendancePerPage)}
                >
                    Next
                </NextButton>
            </div>

            {
                isWarningModalOpen && (
                    <WarningModal isOpen={isWarningModalOpen} onClose={handleCancel} fieldToDelete={fieldToDelete}>
                        <div className="modalContent">
                            <img src={warningSign} alt="Warning" className="warningImage" />
                            <h3>Delete Attendance {studentFirstName} ?</h3>
                            <p className="warningText">You will not be able to recover the employee attendance.</p>
                            <div className="buttonsContainer">
                                <button onClick={() => confirmDelete(fieldToDelete)} className="deleteButton">Delete</button>
                                <button onClick={handleCancel} className="cancelButton">Cancel</button>
                            </div>
                        </div>
                    </WarningModal>
                )
            }

        </div>
    );
}

export default ViewAttendance;


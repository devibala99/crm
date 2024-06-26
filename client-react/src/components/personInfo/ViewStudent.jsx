/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DisplayStudentModal from './DisplayStudentModal';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { showStudents, deleteStudent, updateStudent, convertStudentToEmployeeData } from '../features/studentsSlice';
import { Table, TableBody, TableCell, TableContainer, Menu, MenuItem, TableHead, TableRow, Paper, Button, Tooltip } from '@mui/material';
import SidebarBreadcrumbs from '../../navigationbar/SidebarBreadcrumbs';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import "./viewTable.css"
import { styled } from '@mui/system';
import { Link } from 'react-router-dom';
import EditStudentModal from './EditStudentModal';
import WarningModal from '../master/WarningModal';
import warningSign from "../master/assets/exclamation-mark.png";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { showEmployees } from '../features/employeesSlice';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import Pagination from '@mui/material/Pagination'
const StyledTableHead = styled(TableHead)({
    backgroundColor: "#D3D3D3",
});

const StyledTableCell = styled(TableCell)({
    color: '#545453',
    fontWeight: 'bold',
    fontSize: "15px",
});
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
const ViewStudent = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [displayModalOpen, setDisplayModalOpen] = useState(false);
    const employees = useSelector(state => state.employees.employeeEntries);

    const handleChangePage = (event, value) => {
        setPage(value);
    };
    // delete warning modal
    const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
    const [fieldToDelete, setFieldToDelete] = useState(null);
    const [studentFirstName, setStudentFirstName] = useState('');
    const [studentLastName, setStudentLastName] = useState('');

    const [filterOption, setFilterOption] = useState('All');
    const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);

    const students = useSelector(state => state.students.entries);
    const handleFilterOptionChange = (option) => {
        setFilterOption(option);
        setFilterMenuAnchor(null);
    };
    const handleFilterMenuOpen = (event) => {
        setFilterMenuAnchor(event.currentTarget);
    };

    const handleFilterMenuClose = () => {
        setFilterMenuAnchor(null);
    };
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(showEmployees());
    }, [dispatch]);
    useEffect(() => {
        const filtered = Array.isArray(students) ? students.filter(student => {
            if (filterOption === 'All') {
                return true;
            } else if (filterOption === 'Paid') {
                return student.remainingAmount === 0;
            } else if (filterOption === 'Unpaid') {
                return student.remainingAmount > 0;
            }
        }) : [];
        setFilteredStudents(filtered);
    }, [students, filterOption]);

    const handleDeleteClick = (student) => {
        setIsWarningModalOpen(true);
        setFieldToDelete(student.id);
        setStudentFirstName(student.firstName);
        setStudentLastName(student.lastName);
    };
    const handleCancel = () => {
        setIsWarningModalOpen(false);
    };
    const confirmDelete = (fieldToDelete) => {
        dispatch(deleteStudent(fieldToDelete));
        setIsWarningModalOpen(false);
        window.location.reload();
    };

    // one time clickable button
    const [clickedStudents, setClickedStudents] = useState([]);
    // const [studentData, setStudentData] = useState([]);
    const handleClick = (student) => {
        if (!clickedStudents.includes(student.id)) {
            setClickedStudents([...clickedStudents, student.id]);
            handleConvertToEmployee(student);
            const updatedStudents = students.map(s => {
                if (s.id === student.id) {
                    return { ...s, clicked: true };
                }
                return s;
            });
            dispatch(showStudents(updatedStudents));
        }
    };


    // Pagination
    const studentsPerPage = 10;
    const indexOfLastStudent = page * studentsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
    const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);

    useEffect(() => {
        dispatch(showStudents());
    }, [dispatch]);

    useEffect(() => {
        if (students.length > 0) {
            const filtered = students.filter(student =>
                student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.lastName.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredStudents(filtered);
        } else {
            setFilteredStudents([]);
        }
    }, [students, searchTerm]);

    const dateFormation = (dateString) => {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        return date.toLocaleDateString('en-GB', options);
    }
    const handleDisplayModalOpen = (student) => {
        setSelectedStudent(student);
        setDisplayModalOpen(true);
    };
    const handleDisplayModalClose = () => {
        setDisplayModalOpen(false);
    };
    const handleEdit = (student) => {
        setSelectedStudent(student);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };
    const handleUpdate = (updatedStudentData) => {
        dispatch(updateStudent(updatedStudentData));
    };
    const convertToDays = (stringDate) => {
        const startDate = new Date(stringDate);
        const currentDate = new Date();

        const differenceInTime = currentDate.getTime() - startDate.getTime();
        const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
        // console.log(differenceInDays);

        return differenceInDays;
    }

    useEffect(() => {
        const intervalId = setInterval(() => {
            setFilteredStudents(prevStudents => {
                const updatedStudents = prevStudents.map(student => {
                    if (student.studentStatus === "Completed") {
                        return student;
                    } else {
                        return {
                            ...student,
                            daysCount: convertToDays(student.doj)
                        };
                    }
                });
                return updatedStudents;
            });
        }, 86400000);
        return () => clearInterval(intervalId);
    }, [filteredStudents]);
    const handleConvertToEmployee = async (student) => {
        // console.log(student, "convert");
        try {
            const response = await dispatch(convertStudentToEmployeeData(student));
            if (response.payload.message === "Employee data received successfully") {
                const employeeId = localStorage.getItem("currentEmployeeId");
                const employeeIdText = employeeId ? employeeId.split("-")[0] : "EMP";
                const employeeIdNumber = parseInt(employeeId ? employeeId.split("-")[1] : 1001);
                const incrementedIdNumber = employeeIdNumber + 1;
                const nextEmployeeId = `${employeeIdText}-${incrementedIdNumber}`;
                localStorage.setItem("currentEmployeeId", nextEmployeeId);
                alert("Added to Employee");
            }
        }
        catch (error) {
            // console.error("Error:", error);
            alert("Employee Id must be registered in MASTER")
        }
    }


    return (
        <div className='student-view-container'>

            <div className="bread-crumb">
                <div className="content-wrapper">
                    <div className="link-view" style={{ border: "none", backgroundColor: "#0090dd", borderRadius: '25px' }}>
                        <Link to={`/home/new-student/:studentId`}
                            className="custom-link" style={{ fontSize: "16px", textAlign: "center", color: "white", padding: "0 20px 0 20px" }}>
                            <PersonAddIcon style={{ fontSize: "1rem", color: "white" }} />
                            &nbsp; Add Student
                        </Link>
                    </div>
                    <h2 style={{ color: "#0090dd" }}> Manage Students</h2>
                    <SidebarBreadcrumbs />
                </div>

            </div>
            {
                modalOpen && selectedStudent &&
                <EditStudentModal
                    selectedStudent={selectedStudent}
                    modalOpen={modalOpen}
                    onClose={handleCloseModal}
                />

            }

            <div className="table-view">
                <input
                    className="input-table-search"
                    placeholder="Search"
                    variant="outlined"
                    value={searchTerm}
                    onChange={handleSearch}
                    style={{ padding: "12px", fontSize: "1rem", border: "1px solid rgba(159, 159, 159, 0.497)" }}
                />
                <div className="table-container">
                    <TableContainer component={Paper}>
                        <Table>
                            <StyledTableHead>
                                <TableRow>
                                    <StyledTableCell>#</StyledTableCell>
                                    <StyledTableCell>Id</StyledTableCell>
                                    <StyledTableCell>Name</StyledTableCell>
                                    {/* <StyledTableCell>DOB</StyledTableCell> */}
                                    <StyledTableCell>Email</StyledTableCell>
                                    <StyledTableCell>Contact</StyledTableCell>
                                    <StyledTableCell>Mentor</StyledTableCell>
                                    <StyledTableCell>DOJ</StyledTableCell>
                                    <StyledTableCell>Days</StyledTableCell>
                                    <StyledTableCell>
                                        <Button
                                            aria-controls="filter-menu"
                                            aria-haspopup="true"
                                            onClick={handleFilterMenuOpen}
                                            style={{ color: "#545453", fontWeight: "bold", textTransform: "capitalize", fontSize: ".9rem" }}
                                        >
                                            Due
                                        </Button>
                                        <Menu
                                            id="filter-menu"
                                            anchorEl={filterMenuAnchor}
                                            keepMounted
                                            open={Boolean(filterMenuAnchor)}
                                            onClose={handleFilterMenuClose}
                                        >
                                            <MenuItem onClick={() => handleFilterOptionChange('All')}>All</MenuItem>
                                            <MenuItem onClick={() => handleFilterOptionChange('Paid')}>Paid</MenuItem>
                                            <MenuItem onClick={() => handleFilterOptionChange('Unpaid')}>Unpaid</MenuItem>
                                        </Menu>
                                    </StyledTableCell>
                                    <StyledTableCell>Actions</StyledTableCell>
                                </TableRow>
                            </StyledTableHead>

                            {currentStudents.length === 0 ? (
                                <TableBody>
                                    <TableRow>
                                        <TableCell colSpan={9} align="center">
                                            No Students found. Add Students.
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            ) : (
                                <TableBody>
                                    {currentStudents.map((student, index) => (
                                        <TableRow key={student.studentId} style={{ backgroundColor: index % 2 === 1 ? '#f1f1f1af' : 'transparent', height: "0.5rem" }}>
                                            <TableCell style={{ fontSize: "13px" }}>{index + 1}</TableCell>
                                            <TableCell style={{ fontSize: "13px" }}>{student.studentId}</TableCell>
                                            <TableCell style={{ fontSize: "13px" }}>{student.firstName} {student.lastName}</TableCell>
                                            {/*  <TableCell style={{ fontSize: "13px" }}>{dateFormation(student.dateOfBirth)}</TableCell> */}
                                            <TableCell style={{ fontSize: "13px" }}>{student.emailId}</TableCell>
                                            <TableCell style={{ fontSize: "13px" }}>{student.contactNumber1}</TableCell>
                                            <TableCell style={{ fontSize: "13px" }}>{student.mentor !== "" ? student.mentor : "-"}</TableCell>
                                            <TableCell style={{ fontSize: "13px" }}>{dateFormation(student.doj)}</TableCell>
                                            {
                                                student.studentStatus === 'Completed' ? (
                                                    <TableCell style={{ color: "#32CD32", fontWeight: "bold" }}>{"Ended"}</TableCell>
                                                ) : (
                                                    <TableCell style={{ fontSize: "13px", color: "red", fontWeight: "bold" }}>{convertToDays(student.doj)}</TableCell>

                                                )
                                            }
                                            {student.remainingAmount > 0 ? (
                                                <TableCell style={{ color: "red", fontWeight: "bold" }}>{student.remainingAmount}</TableCell>
                                            ) : (
                                                <TableCell style={{ color: "#32CD32", fontWeight: "bold" }}>{"No-Due"}</TableCell>
                                            )}
                                            <TableCell className="btn-grp-table" style={{ display: "flex" }}>
                                                <Tooltip title="Edit">
                                                    <EditIcon className="edit-view-btn" onClick={() => handleEdit(student)} />
                                                </Tooltip>
                                                <Tooltip title="Delete">
                                                    <DeleteIcon className="delete-view-btn" onClick={() => handleDeleteClick(student)} />
                                                </Tooltip>
                                                <Tooltip title="Display Student">
                                                    <VisibilityIcon className="display-view-btn" onClick={() => handleDisplayModalOpen(student)} />
                                                </Tooltip>
                                                <Tooltip title="Convert To Employee">
                                                    <AddCircleIcon className={student.clicked ? 'disabled-button' : 'add-view-btn'}
                                                        onClick={() => handleClick(student)} />
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            )}
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
                    count={Math.ceil(currentStudents.length / studentsPerPage)}
                    page={page}
                    onChange={handleChangePage}
                    variant="outlined"
                    shape="rounded"
                    hideNextButton
                    hidePrevButton
                />

                <NextButton
                    onClick={() => handleChangePage(null, page + 1)}
                    disabled={page === Math.ceil(currentStudents.length / studentsPerPage)}
                >
                    Next
                </NextButton>
            </div>

            {
                selectedStudent && (
                    <DisplayStudentModal
                        displayModalOpen={displayModalOpen}
                        selectedStudent={selectedStudent}
                        onClose={handleDisplayModalClose}
                        onUpdate={handleUpdate}
                        id={selectedStudent._id}
                    />
                )
            }
            {
                isWarningModalOpen && (
                    <WarningModal isOpen={isWarningModalOpen} onClose={handleCancel} fieldToDelete={fieldToDelete}>
                        <div className="modalContent">
                            <img src={warningSign} alt="Warning" className="warningImage" />
                            <h3>Delete Student {studentFirstName} {studentLastName} ?</h3>
                            <p className="warningText">You will not be able to recover the student details.</p>
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
};

export default ViewStudent;

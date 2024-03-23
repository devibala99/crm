
import React, { useState, useEffect } from 'react';
import SidebarBreadcrumbs from '../../navigationbar/SidebarBreadcrumbs';
import { Link } from 'react-router-dom';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import WarningModal from './WarningModal';
import warningSign from "./assets/exclamation-mark.png";
import "./masterStyle.css"
import { useDispatch, useSelector } from 'react-redux';
import { createCourse, deleteCourse, fetchCourse, updateCourse } from "../features/courseSlice";
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { Edit } from '@mui/icons-material';
const CourseFees = () => {
    const dispatch = useDispatch();
    const courseFields = useSelector(state => state.courses.courseEntries || []);
    const [dynamicFields, setDynamicFields] = useState([]);

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const { payload } = await dispatch(fetchCourse());
                setDynamicFields(payload);
            } catch (error) {
                console.error('Error fetching course data:', error);
            }
        };
        fetchCourseData();
    }, [dispatch]);

    const [editModal, setEditModal] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [fieldToEdit, setFieldToEdit] = useState(null);
    const [fieldToDelete, setFieldToDelete] = useState(null);
    const [newFieldCount, setNewFieldCount] = useState(0);
    useEffect(() => {
        dispatch(fetchCourse());
    }, [dispatch]);
    useEffect(() => {
        localStorage.setItem('courseFields', JSON.stringify(dynamicFields));
    }, [dynamicFields]);

    const addDynamicField = () => {
        const newField = { course: '', courseFees: '' };
        setDynamicFields(prevFields => [...prevFields, newField]);
        setNewFieldCount(newFieldCount + 1);
        handleSaveToRedux([...dynamicFields, newField]);
    };

    const handleFieldChange = (index, key, value) => {
        const updatedFields = [...dynamicFields];
        updatedFields[index] = { ...updatedFields[index], [key]: value };
        setDynamicFields(updatedFields);
    };

    const handleDeleteField = (index) => {
        console.log("Deleting field at index:", index);
        setFieldToDelete(index);
        setShowModal(true);
    };
    const handleEditField = (index) => {
        const updatedField = dynamicFields[index];
        setEditModal(true);
        setFieldToEdit(updatedField);
    }

    const confirmEdit = async () => {
        console.log(fieldToEdit);
        try {
            if (fieldToEdit && fieldToEdit.courseId) {
                await dispatch(updateCourse({ courseId: fieldToEdit.courseId, courseData: fieldToEdit }));
                setEditModal(false);
                window.location.reload();
            }
        } catch (error) {
            console.error("Error updating course:", error);
        }
    };

    const confirmDelete = async (courseToDelete) => {
        try {
            if (courseToDelete && courseToDelete.courseId) {
                console.log("Course ID to delete:", courseToDelete.courseId);
                const updatedFields = dynamicFields.filter(field => field.course !== courseToDelete.course);
                localStorage.setItem('courseFields', JSON.stringify(updatedFields));

                await dispatch(deleteCourse(courseToDelete.courseId));

                setShowModal(false);
                window.location.reload();
            }
        } catch (error) {
            console.error("Error deleting course:", error);
        }
    };

    const handleCancel = () => {
        setShowModal(false);
        setEditModal(false);
    };

    const handleSaveToRedux = () => {
        if (newFieldCount > 0) {
            const newFields = dynamicFields.slice(-newFieldCount);
            newFields.forEach(field => {
                dispatch(createCourse({ course: field.course, courseFees: field.courseFees, duration: field.duration }));
            });
            setNewFieldCount(0);
        }
    };

    return (
        <div className="student-container">
            <div className="bread-crumb">
                <div className="content-wrapper">
                    <div className="link-view" style={{ border: "none", backgroundColor: "#0090dd", borderRadius: '25px' }}>
                        <Link to={`/home/new-student/${localStorage.getItem("currentStudentId")}`}
                            className="custom-link" style={{ fontSize: "16px", textAlign: "center", color: "white", padding: "0 20px 0 20px" }}>
                            <PersonAddIcon style={{ fontSize: "1rem", color: "white" }} />
                            &nbsp; Add Student
                        </Link>
                    </div>
                    <h2 style={{ color: "#0090dd" }}>Plan Course Offering</h2>
                    <SidebarBreadcrumbs />
                </div>
            </div>
            <div className="master-field">
                {!dynamicFields || dynamicFields.length === 0 ? (
                    <p style={{ width: "100%", textAlign: "center" }}>Plan your courses and their prices</p>
                ) : (
                    dynamicFields.map((field, index) => (
                        <div className="form-group-master" key={index}>
                            <div className="first-input">
                                <label htmlFor={`course_${index}`}>Course:</label>
                                <input
                                    type="text"
                                    id={`course_${index}`}
                                    value={field.course}
                                    onChange={e => handleFieldChange(index, 'course', e.target.value)}
                                />
                            </div>
                            <div className="second-input">
                                <label htmlFor={`courseFees_${index}`}>Fees:</label>
                                <input
                                    type="text"
                                    id={`courseFees_${index}`}
                                    value={field.courseFees}
                                    onChange={e => handleFieldChange(index, 'courseFees', e.target.value)}
                                />
                            </div>
                            <div className="third-input">
                                <label htmlFor={`duration_${index}`}>Duration:</label>
                                <input
                                    type="text"
                                    id={`duration_${index}`}
                                    value={field.duration}
                                    onChange={e => handleFieldChange(index, 'duration', e.target.value)}
                                />
                            </div>
                            <div className="fourth-input">
                                <button onClick={() => handleEditField(index)} className="editButton-master"><Edit /></button>
                                <button onClick={handleSaveToRedux} className="saveButton-master"><SaveOutlinedIcon /></button>
                                <button onClick={() => handleDeleteField(courseFields[index])} className='deleteButton-master'>
                                    <DeleteOutlineOutlinedIcon />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <div className="btn-class-master">
                <button
                    onClick={addDynamicField}
                    className="btns-group"
                    disabled={newFieldCount > 0}
                    title={newFieldCount > 0 ? "Save before adding a new field" : "Add new field"}
                    style={{ cursor: newFieldCount > 0 ? "not-allowed" : "pointer" }}
                >Add Field
                </button>
            </div>
            {editModal && (
                <WarningModal isOpen={editModal} onClose={handleCancel} fieldToEdit={fieldToEdit}>
                    <div className="modalContent">
                        <h3>Edit the Course</h3>
                        <div className="input-container">
                            <label htmlFor="editCourse">Course:</label>
                            <input
                                type="text"
                                id="editCourse"
                                value={fieldToEdit.course}
                                onChange={(e) => setFieldToEdit({ ...fieldToEdit, course: e.target.value })}
                            />
                        </div>
                        <div className="input-container">
                            <label htmlFor="editCourseFees">Fees:</label>
                            <input
                                type="text"
                                id="editCourseFees"
                                value={fieldToEdit.courseFees}
                                onChange={(e) => setFieldToEdit({ ...fieldToEdit, courseFees: e.target.value })}
                            />
                        </div>
                        <div className="input-container">
                            <label htmlFor="editDuration">Duration:</label>
                            <input
                                type="text"
                                id="editDuration"
                                value={fieldToEdit.duration}
                                onChange={(e) => setFieldToEdit({ ...fieldToEdit, duration: e.target.value })}
                            />
                        </div>
                        <div className="buttonsContainer">
                            <button onClick={() => confirmEdit(fieldToEdit)} className="editButton-blue">Edit</button>
                            <button onClick={handleCancel} className="cancelButton-blue">Cancel</button>
                        </div>
                    </div>
                </WarningModal>
            )}

            {showModal && (
                <WarningModal isOpen={showModal} onClose={handleCancel} fieldToDelete={fieldToDelete}>
                    <div className="modalContent">
                        <img src={warningSign} alt="Warning" className="warningImage" />
                        <h3>Delete the Course?</h3>
                        <p className="warningText">You will not be able to recover the course {fieldToDelete.course}</p>
                        <div className="buttonsContainer">
                            <button onClick={() => confirmDelete(fieldToDelete)} className="deleteButton">Delete</button>
                            <button onClick={handleCancel} className="cancelButton">Cancel</button>
                        </div>
                    </div>
                </WarningModal>
            )}
        </div>
    );
};

export default CourseFees;
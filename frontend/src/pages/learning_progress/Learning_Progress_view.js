import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Title,
    Tooltip,
} from "chart.js";
import { Button, Table } from "react-bootstrap";
import React, { useEffect, useState } from "react";

import { Bar } from "react-chartjs-2";
import LearningProgressTableCreate from "./Learning_progress_table_create";
import LearningProgressUpdate from "./Learning_progress_update";
import axios from "axios";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const LearningProgressView = () => {
    const [courses, setCourses] = useState([]);
    const [paintingStats, setPaintingStats] = useState([]);
    const [totalPaintings, setTotalPaintings] = useState(0);
    const [totalCertificates, setTotalCertificates] = useState(0);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false); // NEW
    const [selectedCourseId, setSelectedCourseId] = useState(null);

    useEffect(() => {
        fetchCourses();
        fetchPaintingStats();
        fetchTotalPaintings();
        fetchCompletedCourses();
    }, []);

    const fetchCourses = async () => {
        const res = await axios.get("/api/courses");
        setCourses(res.data);
    };

    const fetchCompletedCourses = async () => {
        const res = await axios.get("/api/courses/completed-count");
        setTotalCertificates(res.data);
    };

    const deleteCourse = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this course?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`/api/courses/${id}`);
            fetchCourses();
        } catch (error) {
            console.error("Failed to delete course:", error);
            alert("Error deleting course. Please try again.");
        }
    };


    const fetchPaintingStats = async () => {
        const res = await axios.get("/api/painting-stats");
        setPaintingStats(res.data);
    };

    const fetchTotalPaintings = async () => {
        const res = await axios.get("/api/painting-stats/total");
        setTotalPaintings(res.data);
    };

    const deletePaintingStat = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this painting stat?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`/api/painting-stats/${id}`);
            fetchPaintingStats();
        } catch (error) {
            console.error("Failed to delete painting stat:", error);
            alert("Error deleting painting stat. Please try again.");
        }
    };


    const handleEditClick = (id) => {
        setSelectedCourseId(id);
        setShowEditModal(true);
    };

    const handleAddClick = () => {
        setShowAddModal(true);
    };

    const chartData = {
        labels: paintingStats.map((stat) => stat.paintingType),
        datasets: [
            {
                label: "Painting Count",
                data: paintingStats.map((stat) => stat.paintingCount),
                backgroundColor: "green",
            },
        ],
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">My Learning Journey</h2>

            <div className="row mb-4">
                <div className="col-md-6">
                    <div className="border rounded p-3 bg-light text-center">
                        <h3>{totalCertificates}</h3>
                        <p>Total number of Courses</p>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="border rounded p-3 bg-light text-center">
                        <h3>{totalPaintings}</h3>
                        <p>Total number of Paintings</p>
                    </div>
                </div>
            </div>



            <div className="row mb-4">
                {/* Chart with title */}
                <div className="col-md-6 mb-3">
                    <h4 className="mb-2">My Paintings Summary</h4>
                    <Bar data={chartData} />
                </div>


                {/* Painting Table */}
                <div className="col-md-6">
                    <div className="d-flex justify-content-end mb-2">
                        <Button
                            variant="primary"
                            href="/pages/learning_progress/Learning_progress_create"
                        >
                            + Add New Paintings
                        </Button>
                    </div>


                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Painting Type</th>
                                <th>Count</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paintingStats.map((stat) => (
                                <tr key={stat.id}>
                                    <td>{stat.paintingType}</td>
                                    <td>{stat.paintingCount}</td>
                                    <td>
                                        <Button
                                            size="sm"
                                            variant="danger"
                                            onClick={() => deletePaintingStat(stat.id)}
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div>


            <div className="d-flex justify-content-between align-items-center">
                <h4>My Course Completion Progress</h4>
                <Button variant="primary" onClick={handleAddClick}>
                    + Add New Courses
                </Button>{" "}
                {/* New Modal Trigger */}
            </div>

            <Table striped bordered hover className="mt-3">
                <thead>
                    <tr>
                        <th>Course</th>
                        <th>Description</th>
                        <th>Progress</th>
                        <th>Deadline</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map((course) => (
                        <tr key={course.id}>
                            <td>{course.title}</td>
                            <td>{course.description}</td>
                            <td style={{ width: "120px" }}>
                                <Bar
                                    data={{
                                        labels: ["Completed", "Remaining"],
                                        datasets: [
                                            {
                                                data: [course.progress, 100 - course.progress],
                                                backgroundColor: ["#28a745", "#e0e0e0"],
                                            },
                                        ],
                                    }}
                                    options={{
                                        responsive: true,
                                        plugins: { legend: { display: false } },
                                        indexAxis: "y",
                                        scales: { x: { display: false }, y: { display: false } },
                                    }}
                                    height={40}
                                    width={120}
                                />
                                <small>{course.progress}%</small>
                            </td>

                            <td>{course.deadline}</td>
                            <td>
                                <Button
                                    size="sm"
                                    variant="success"
                                    onClick={() => handleEditClick(course.id)}
                                >
                                    Edit
                                </Button>{" "}
                                <Button
                                    size="sm"
                                    variant="danger"
                                    onClick={() => deleteCourse(course.id)}
                                >
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Modals */}
            <LearningProgressUpdate
                show={showEditModal}
                handleClose={() => setShowEditModal(false)}
                courseId={selectedCourseId}
                refreshData={fetchCourses}
            />

            <LearningProgressTableCreate
                show={showAddModal}
                handleClose={() => setShowAddModal(false)}
                refreshData={fetchCourses}
            />
        </div>
    );
};

export default LearningProgressView;

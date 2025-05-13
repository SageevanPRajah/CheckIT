"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { authFetch, clearTokens } from "@/lib/api"
import Image from "next/image"
import { PlusCircle, LogOut, Edit, Trash2 } from "lucide-react"
import UserProfile from "./components/user-profile"

interface Course {
    id: number
    title: string
    description: string
    instructorId: number
    instructorUsername: string
}

export default function CoursesPage() {
    const router = useRouter()
    const [courses, setCourses] = useState<Course[]>([])
    const [error, setError] = useState("")
    const [username, setUsername] = useState("RoboticsTeacher")

    const fetchCourses = async () => {
        try {
            const data = await authFetch("/courses", { method: "GET" })
            setCourses(data)
        } catch (err: any) {
            setError(err.message || "Failed to fetch courses")
        }
    }

    useEffect(() => {
        fetchCourses()
    }, [])

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const user = await authFetch('/auth/me', { method: 'GET' }) // Fetch user data using authFetch
                setUsername(user.username) // Assuming the response includes the 'username' field
            } catch (err: any) {
                setError('Failed to fetch user profile')
                console.error(err)
            }
        }

        fetchUserProfile()
    }, [])
    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this course?")) return
        try {
            await authFetch(`/courses/${id}`, { method: "DELETE" })
            setCourses((prev) => prev.filter((course) => course.id !== id))
        } catch (err: any) {
            alert("Failed to delete course")
        }
    }

    const handleLogout = () => {
        clearTokens()
        router.push("/login")
    }

    return (
        <div className="min-h-screen bg-gray-50">
            
            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">My course</h1>
                    <button
                        onClick={() => router.push("/courses/create")}
                        className="flex items-center gap-2 bg-cyan-500 text-white px-4 py-2 rounded-md hover:bg-cyan-600 transition-colors"
                    >
                        <PlusCircle size={18} />
                        <span>Create New course</span>
                    </button>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
                        <p>{error}</p>
                    </div>
                )}

                {courses.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-8 text-center">
                        <p className="text-gray-500">No course found. Create your first course to get started!</p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                        {courses.map((course) => (
                            <div
                                key={course.id}
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                            >
                                <div className="h-3 bg-gradient-to-r from-cyan-500 to-blue-600"></div>
                                <div className="p-8">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-3">{course.title}</h2>
                                    <p className="text-gray-600 mb-6">{course.description}</p>
                                    <div className="flex justify-end space-x-2 pt-3 border-t">
                                        <button
                                            onClick={() => router.push(`/courses/${course.id}/edit`)}
                                            className="flex items-center gap-1 text-cyan-600 hover:text-cyan-800 px-3 py-1 rounded"
                                        >
                                            <Edit size={16} />
                                            <span>Edit</span>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(course.id)}
                                            className="flex items-center gap-1 text-red-500 hover:text-red-700 px-3 py-1 rounded"
                                        >
                                            <Trash2 size={16} />
                                            <span>Delete</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}



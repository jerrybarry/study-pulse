"use client"

import { useState, useEffect } from 'react'
import { Home, Calendar, BookOpen, CheckSquare, TrendingUp, Clock, Book, Plus, MoreHorizontal, Bell, Settings } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export default function StudyPulse() {
  const [activeTab, setActiveTab] = useState("home")
  const [studyGoal, setStudyGoal] = useState("")
  const [studyDays, setStudyDays] = useState(['Mon', 'Wed', 'Fri'])
  const [assignments, setAssignments] = useState([
    { id: 1, course: "Mathematics", task: "Complete exercises 1-5", completed: false },
    { id: 2, course: "History", task: "Read chapter 3", completed: false },
    { id: 3, course: "Physics", task: "Prepare lab report", completed: true }
  ])
  const [courses, setCourses] = useState(['Mathematics', 'History', 'Physics'])
  const [studyStreak, setStudyStreak] = useState(5)
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Don't forget to study Mathematics today!" },
    { id: 2, message: "History assignment due tomorrow" }
  ])

  useEffect(() => {
    // Simulating a study streak update
    const timer = setInterval(() => {
      setStudyStreak(prev => (prev < 7 ? prev + 1 : 1))
    }, 60000) // Update every minute for demo purposes
    return () => clearInterval(timer)
  }, [])

  const handleAddAssignment = (newAssignment) => {
    setAssignments([...assignments, { id: assignments.length + 1, ...newAssignment, completed: false }])
  }

  const handleToggleAssignment = (id) => {
    setAssignments(assignments.map(assignment => 
      assignment.id === id ? { ...assignment, completed: !assignment.completed } : assignment
    ))
  }

  const handleAddCourse = (course) => {
    if (course && !courses.includes(course)) {
      setCourses([...courses, course])
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <HomeScreen courses={courses} studyDays={studyDays} assignments={assignments} studyStreak={studyStreak} />
      case "study":
        return <StudyScreen studyDays={studyDays} setStudyDays={setStudyDays} courses={courses} onAddCourse={handleAddCourse} />
      case "tasks":
        return <TasksScreen assignments={assignments} onAddAssignment={handleAddAssignment} onToggleAssignment={handleToggleAssignment} courses={courses} />
      case "progress":
        return <ProgressScreen studyDays={studyDays} assignments={assignments} studyStreak={studyStreak} />
      default:
        return <HomeScreen courses={courses} studyDays={studyDays} assignments={assignments} studyStreak={studyStreak} />
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-white shadow-sm py-4 px-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-purple-800">StudyPulse</h1>
        <div className="flex items-center space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                {notifications.map(notification => (
                  <div key={notification.id} className="p-2 bg-gray-100 rounded">
                    {notification.message}
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </header>
      <main className="flex-1 overflow-hidden">
        <ScrollArea className="h-full p-4 md:p-6">
          {renderContent()}
        </ScrollArea>
      </main>
      <nav className="bg-white border-t border-gray-200">
        <div className="flex justify-around">
          {[
            { icon: Home, label: "Home", value: "home" },
            { icon: Calendar, label: "Study", value: "study" },
            { icon: CheckSquare, label: "Tasks", value: "tasks" },
            { icon: TrendingUp, label: "Progress", value: "progress" },
          ].map((item) => (
            <button
              key={item.value}
              className={`flex flex-col items-center justify-center w-full py-2 ${
                activeTab === item.value ? "text-purple-600" : "text-gray-500"
              }`}
              onClick={() => setActiveTab(item.value)}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}

function HomeScreen({ courses, studyDays, assignments, studyStreak }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-purple-800">Welcome back!</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Your study streak</p>
              <p className="text-3xl font-bold text-purple-600">{studyStreak} days</p>
            </div>
            <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-purple-800">Today's Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {assignments.filter(a => !a.completed).slice(0, 3).map((assignment) => (
              <div key={assignment.id} className="flex items-center space-x-2">
                <CheckSquare className="w-4 h-4 text-purple-600" />
                <span className="text-sm">{assignment.course}: {assignment.task}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-purple-800">Your Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {courses.map((course, index) => (
              <Badge key={index} variant="secondary" className="bg-sky-100 text-sky-800">
                {course}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-purple-800">Weekly Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <div
                key={day}
                className={`text-center p-2 rounded-full ${
                  studyDays.includes(day) ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {day[0]}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function StudyScreen({ studyDays, setStudyDays, courses, onAddCourse }) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const [newCourse, setNewCourse] = useState("")
  
  const toggleStudyDay = (day) => {
    if (studyDays.includes(day)) {
      setStudyDays(studyDays.filter(d => d !== day))
    } else {
      setStudyDays([...studyDays, day])
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-purple-800">Weekly Study Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {days.map((day) => (
              <Button
                key={day}
                variant={studyDays.includes(day) ? "default" : "outline"}
                className="w-full py-2"
                onClick={() => toggleStudyDay(day)}
              >
                {day}
              </Button>
            ))}
          </div>
          <div className="flex items-center space-x-2 mt-4">
            <Clock className="w-5 h-5 text-purple-600" />
            <Input type="time" placeholder="Study time" className="flex-grow" />
            <Button size="sm">Set</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-purple-800">Your Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Input
              type="text"
              placeholder="Add new course"
              value={newCourse}
              onChange={(e) => setNewCourse(e.target.value)}
              className="flex-grow"
            />
            <Button size="sm" onClick={() => {
              onAddCourse(newCourse)
              setNewCourse("")
            }}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {courses.map((course, index) => (
              <Badge key={index} variant="secondary" className="bg-sky-100 text-sky-800">
                {course}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-purple-800">Study Reminders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span>Enable daily reminders</span>
            <Switch />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function TasksScreen({ assignments, onAddAssignment, onToggleAssignment, courses }) {
  const [newAssignment, setNewAssignment] = useState({ course: "", task: "" })

  const handleAddAssignment = () => {
    if (newAssignment.course && newAssignment.task) {
      onAddAssignment(newAssignment)
      setNewAssignment({ course: "", task: "" })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-purple-800">Tasks</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Select value={newAssignment.course} onValueChange={(value) => setNewAssignment({...newAssignment, course: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select course" />
            </SelectTrigger>
            <SelectContent>
              {courses.map((course, index) => (
                <SelectItem key={index} value={course}>{course}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Textarea
            placeholder="Enter task details"
            value={newAssignment.task}
            onChange={(e) => setNewAssignment({...newAssignment, task: e.target.value})}
            className="flex-grow"
          />
          <Button onClick={handleAddAssignment}>Add Task</Button>
        </div>
        <div className="space-y-2">
          {assignments.map((assignment) => (
            <div key={assignment.id} className="flex items-center justify-between bg-white p-2 rounded-lg shadow">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={assignment.completed}
                  onChange={() => onToggleAssignment(assignment.id)}
                  className="rounded text-purple-600 focus:ring-purple-500"
                />
                <span className={`text-sm ${assignment.completed ? 'line-through text-gray-500' : ''}`}>
                  {assignment.course}: {assignment.task}
                </span>
              </div>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function ProgressScreen({ studyDays, assignments, studyStreak }) {
  const totalStudyDays = studyDays.length
  const completedAssignments = assignments.filter(a => a.completed).length
  const totalAssignments = assignments.length

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-purple-800">Weekly Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{totalStudyDays}/7</div>
              <p className="text-sm text-gray-500">Study Days</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-sky-600">{completedAssignments}/{totalAssignments}</div>
              <p className="text-sm text-gray-500">Tasks Completed</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-purple-800">Study Streak</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center space-x-2">
            <div className="text-4xl font-bold text-purple-600">{studyStreak}</div>
            <div className="text-sm text-gray-500">days in a row</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-purple-800">Monthly Goal Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">Study Hours</span>
                <span className="text-sm text-gray-500">24/30 hours</span>
              </div>
              <Progress value={80} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">Assignments Completed</span>
                <span className="text-sm text-gray-500">18/20 tasks</span>
              </div>
              <Progress value={90} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
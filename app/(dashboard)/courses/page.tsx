"use client"

import { useState, useEffect } from "react"
import { BookOpen, Search, Star, Clock, DollarSign } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/shared/page-header"
import { useDebounce } from "@/hooks/use-debounce"
import { LoadingSpinner } from "@/components/shared/loading-spinner"
import { toast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CoursesPage() {
    const [courses, setCourses] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [levelFilter, setLevelFilter] = useState<string>("all")
    const debouncedSearch = useDebounce(searchQuery, 500)

    useEffect(() => {
        fetchCourses()
    }, [debouncedSearch, levelFilter])

    const fetchCourses = async () => {
        try {
            setLoading(true)
            let url = "/api/courses?"
            if (debouncedSearch) {
                url += `search=${encodeURIComponent(debouncedSearch)}&`
            }
            if (levelFilter !== "all") {
                url += `level=${levelFilter}&`
            }
            const response = await fetch(url)
            if (!response.ok) throw new Error("Failed to fetch courses")
            const data = await response.json()
            setCourses(data.courses || [])
        } catch (error) {
            console.error("Error fetching courses:", error)
            toast({
                title: "Error",
                description: "Failed to load courses",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    if (loading && courses.length === 0) {
        return (
            <div className="space-y-8">
                <PageHeader title="Courses" description="Discover learning resources to advance your skills" />
                <div className="flex items-center justify-center min-h-[400px]">
                    <LoadingSpinner />
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <PageHeader title="Courses" description="Discover learning resources to advance your skills" />

            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search courses..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>
            </div>

            <Tabs value={levelFilter} onValueChange={setLevelFilter} className="w-full">
                <TabsList>
                    <TabsTrigger value="all">All Levels</TabsTrigger>
                    <TabsTrigger value="beginner">Beginner</TabsTrigger>
                    <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced</TabsTrigger>
                    <TabsTrigger value="expert">Expert</TabsTrigger>
                </TabsList>

                <TabsContent value={levelFilter} className="mt-6">
                    {loading && courses.length > 0 ? (
                        <div className="flex items-center justify-center py-12">
                            <LoadingSpinner />
                        </div>
                    ) : courses.length === 0 ? (
                        <Card className="p-12 text-center">
                            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No courses found</h3>
                            <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
                        </Card>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {courses.map((course) => (
                                <Card key={course.id} className="transition-all hover:shadow-md">
                                    <CardContent className="p-6">
                                        <div className="space-y-4">
                                            {course.thumbnail && (
                                                <img src={course.thumbnail} alt={course.title} className="w-full h-32 object-cover rounded-lg" />
                                            )}
                                            <div>
                                                <h3 className="font-semibold mb-1">{course.title}</h3>
                                                <p className="text-sm text-muted-foreground mb-2">{course.provider}</p>
                                                <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                    <span>{course.rating.toFixed(1)}</span>
                                                    <span className="text-xs">({course.reviewCount})</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-4 w-4" />
                                                    <span>{course.duration}h</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <Badge variant="secondary" className="capitalize">
                                                    {course.level}
                                                </Badge>
                                                <div className="flex items-center gap-1 font-semibold">
                                                    <DollarSign className="h-4 w-4" />
                                                    <span>Le {course.price.toLocaleString()}</span>
                                                </div>
                                            </div>
                                            {course.skills && course.skills.length > 0 && (
                                                <div className="flex flex-wrap gap-1">
                                                    {course.skills.slice(0, 3).map((skill: any) => (
                                                        <Badge key={skill.id} variant="outline" className="text-xs">
                                                            {skill.name}
                                                        </Badge>
                                                    ))}
                                                    {course.skills.length > 3 && (
                                                        <Badge variant="outline" className="text-xs">
                                                            +{course.skills.length - 3} more
                                                        </Badge>
                                                    )}
                                                </div>
                                            )}
                                            <Button className="w-full" onClick={() => window.open(course.url, "_blank")}>
                                                View Course
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    )
}


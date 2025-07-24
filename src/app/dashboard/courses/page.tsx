"use client";
import { Courses } from "@/data/data";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { CourseModal } from "@/components/modal-course";

export default function CoursesPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Available Courses</h1>
      
      {Courses.length === 0 ? (
        <p className="text-gray-500">No courses available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Courses.map((course, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{course.name}</CardTitle>
                <CardDescription>{course.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <CourseModal 
                  name={course.name}
                  description={course.description}/>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
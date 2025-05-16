import React from "react";
import Image from "next/image";
import VideoBox from "../components/VideoBox";

export default function Home() {
  const DemoData = [
    {
      title: "DSA A to Z",
      description: "Learn Data Structures and Algorithms from scratch",
      image: "/api/placeholder/400/320",
      rating: 4.5,
      creator: "Striver",
    },
    {
      title: "JavaScript Mastery",
      description: "Master JavaScript fundamentals through advanced concepts",
      image: "/api/placeholder/400/320",
      rating: 4.8,
      creator: "Jonas Schmedtmann",
    },
    {
      title: "React & Redux Complete Guide",
      description: "Build powerful modern web applications with React and Redux",
      image: "/api/placeholder/400/320",
      rating: 4.7,
      creator: "Maximilian Schwarzmüller",
    },
    {
      title: "Python Bootcamp",
      description: "From beginner to professional Python developer",
      image: "/api/placeholder/400/320",
      rating: 4.9,
      creator: "Angela Yu",
    },
    {
      title: "Machine Learning A-Z",
      description: "Comprehensive guide to ML algorithms and techniques",
      image: "/api/placeholder/400/320",
      rating: 4.6,
      creator: "Andrew Ng",
    },
    {
      title: "Full Stack Web Development",
      description: "Learn MERN stack and build real-world projects",
      image: "/api/placeholder/400/320",
      rating: 4.4,
      creator: "Colt Steele",
    },
    {
      title: "AWS Certified Solutions Architect",
      description: "Prepare for AWS certification with hands-on labs",
      image: "/api/placeholder/400/320",
      rating: 4.7,
      creator: "Stephane Maarek",
    },
    {
      title: "Flutter & Dart Complete Course",
      description: "Build iOS and Android apps with a single codebase",
      image: "/api/placeholder/400/320",
      rating: 4.5,
      creator: "Angela Yu",
    },
    {
      title: "DevOps Engineering Masterclass",
      description: "Learn Docker, Kubernetes, CI/CD, and more",
      image: "/api/placeholder/400/320",
      rating: 4.6,
      creator: "David Clinton",
    },
    {
      title: "GraphQL with Node.js",
      description: "Build efficient APIs with GraphQL and Node.js",
      image: "/api/placeholder/400/320",
      rating: 4.3,
      creator: "Max Schwarzmüller",
    }
  ];

  return (
   <div>
    hi we are cooking 
   </div>
  );
}   
"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    githubUrl: '',
    liveUrl: '',
    techStack: [],
    acceptingCollabs: false,
    collabDescription: '',
    ownerId: '' // You'll need to set this based on your auth system
  });
  
  const [screenshots, setScreenshots] = useState([]);
  const [demoVideo, setDemoVideo] = useState(null);
  const [techInput, setTechInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleScreenshotsChange = (e) => {
    setScreenshots(Array.from(e.target.files));
  };

  const handleDemoVideoChange = (e) => {
    setDemoVideo(e.target.files[0]);
  };

  const addTechStack = () => {
    if (techInput.trim() && !formData.techStack.includes(techInput.trim())) {
      setFormData(prev => ({
        ...prev,
        techStack: [...prev.techStack, techInput.trim()]
      }));
      setTechInput('');
    }
  };

  const removeTechStack = (tech) => {
    setFormData(prev => ({
      ...prev,
      techStack: prev.techStack.filter(item => item !== tech)
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTechStack();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    // Validation
    if (!formData.title || !formData.description || formData.techStack.length === 0 || !formData.ownerId) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' });
      setIsSubmitting(false);
      return;
    }

    try {
      const submitFormData = new FormData();
      
      // Add text fields
      submitFormData.append('title', formData.title);
      submitFormData.append('description', formData.description);
      submitFormData.append('githubUrl', formData.githubUrl);
      submitFormData.append('liveUrl', formData.liveUrl);
      submitFormData.append('techStack', JSON.stringify(formData.techStack));
      submitFormData.append('acceptingCollabs', formData.acceptingCollabs);
      submitFormData.append('collabDescription', formData.collabDescription);
      submitFormData.append('ownerId', formData.ownerId);
      
      // Add screenshots
      screenshots.forEach(file => {
        submitFormData.append('screenshots', file);
      });
      
      // Add demo video
      if (demoVideo) {
        submitFormData.append('demoVideo', demoVideo);
      }

      const response = await fetch('/api/project/upload', {
        method: 'POST',
        body: submitFormData,
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: 'success', text: 'Project uploaded successfully!' });

        console.log('Project created:', result.project);
        console.log('Project id:', result.project.id);
        router.push(`/user/projects/${result.project.id}`);
        // Reset form
        setFormData({
          title: '',
          description: '',
          githubUrl: '',
          liveUrl: '',
          techStack: [],
          acceptingCollabs: false,
          collabDescription: '',
          ownerId: ''
        });
        setScreenshots([]);
        setDemoVideo(null);
      } else {
        setMessage({ type: 'error', text: result.message || 'Upload failed' });
      }
    } catch (error) {
      console.error('Upload error:', error);
      setMessage({ type: 'error', text: 'An error occurred while uploading' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-24">
      <h1 className="text-3xl font-bold mb-8">Upload Your Project</h1>
      
      {message.text && (
        <div className={`p-4 rounded mb-6 ${
          message.type === 'success' 
            ? 'bg-green-100 text-green-700 border border-green-300' 
            : 'bg-red-100 text-red-700 border border-red-300'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-2xl">
        {/* Project Title */}
        <div>
          <label className="text-lg font-medium block mb-2">
            Project Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your project title"
            required
          />
        </div>

        {/* Project Description */}
        <div>
          <label className="text-lg font-medium block mb-2">
            Project Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="4"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe your project..."
            required
          />
        </div>

        {/* GitHub URL */}
        <div>
          <label className="text-lg font-medium block mb-2">GitHub URL</label>
          <input
            type="url"
            name="githubUrl"
            value={formData.githubUrl}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://github.com/username/repository"
          />
        </div>

        {/* Live URL */}
        <div>
          <label className="text-lg font-medium block mb-2">Live Demo URL</label>
          <input
            type="url"
            name="liveUrl"
            value={formData.liveUrl}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://your-project-demo.com"
          />
        </div>

        {/* Tech Stack */}
        <div>
          <label className="text-lg font-medium block mb-2">
            Tech Stack <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter technology (e.g., React, Node.js)"
            />
            <button
              type="button"
              onClick={addTechStack}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.techStack.map((tech, index) => (
              <span
                key={index}
                className="bg-gray-200 px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                {tech}
                <button
                  type="button"
                  onClick={() => removeTechStack(tech)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Owner ID */}
        <div>
          <label className="text-lg font-medium block mb-2">
            Owner ID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="ownerId"
            value={formData.ownerId}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter owner ID"
            required
          />
        </div>

        {/* Screenshots */}
        <div>
          <label className="text-lg font-medium block mb-2">Project Screenshots</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleScreenshotsChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-sm text-gray-600 mt-1">
            Select multiple images to showcase your project
          </p>
          {screenshots.length > 0 && (
            <p className="text-sm text-green-600 mt-1">
              {screenshots.length} screenshot(s) selected
            </p>
          )}
        </div>

        {/* Demo Video */}
        <div>
          <label className="text-lg font-medium block mb-2">Demo Video (Optional)</label>
          <input
            type="file"
            accept="video/*"
            onChange={handleDemoVideoChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-sm text-gray-600 mt-1">
            Upload a video demonstration of your project
          </p>
          {demoVideo && (
            <p className="text-sm text-green-600 mt-1">
              Video selected: {demoVideo.name}
            </p>
          )}
        </div>

        {/* Collaboration */}
        <div>
          <label className="flex items-center gap-2 text-lg font-medium">
            <input
              type="checkbox"
              name="acceptingCollabs"
              checked={formData.acceptingCollabs}
              onChange={handleInputChange}
              className="w-4 h-4"
            />
            Accepting Collaborations
          </label>
        </div>

        {/* Collaboration Description */}
        {formData.acceptingCollabs && (
          <div>
            <label className="text-lg font-medium block mb-2">
              Collaboration Description
            </label>
            <textarea
              name="collabDescription"
              value={formData.collabDescription}
              onChange={handleInputChange}
              rows="3"
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe what kind of collaboration you're looking for..."
            />
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`text-white p-4 rounded-lg mt-6 font-medium text-lg ${
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isSubmitting ? 'Uploading...' : 'Upload Project'}
        </button>
      </form>
    </div>
  );
}

import React, { useState } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Building2, MapPin, Banknote } from 'lucide-react';

interface JobCardProps {
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    salary: string;
    description: string;
    skills: string[];
  };
  onSwipe: (direction: 'left' | 'right') => void;
}

const JobCard = ({ job, onSwipe }: JobCardProps) => {
  const [dragging, setDragging] = useState(false);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      onSwipe('right');
    } else if (info.offset.x < -threshold) {
      onSwipe('left');
    }
  };

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragStart={() => setDragging(true)}
      onDragEnd={handleDragEnd}
      onDragTransitionEnd={() => setDragging(false)}
      whileDrag={{ scale: 1.05 }}
      animate={{ scale: dragging ? 1.05 : 1 }}
      className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden"
      style={{ touchAction: 'none' }}
    >
      <div className="p-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">{job.title}</h2>
            <div className="flex items-center mt-2 text-gray-600 space-x-4">
              <div className="flex items-center">
                <Building2 className="w-4 h-4 mr-1" />
                <span>{job.company}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{job.location}</span>
              </div>
            </div>
            <div className="flex items-center mt-2 text-gray-600">
              <Banknote className="w-4 h-4 mr-1" />
              <span>{job.salary}</span>
            </div>
          </div>
          
          <p className="text-gray-600">{job.description}</p>
          
          <div className="flex flex-wrap gap-2">
            {job.skills.map((skill) => (
              <Badge key={skill} variant="secondary">{skill}</Badge>
            ))}
          </div>

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              className="flex-1 mr-2 border-danger text-danger hover:bg-danger hover:text-white"
              onClick={() => onSwipe('left')}
            >
              Passer
            </Button>
            <Button
              variant="outline"
              className="flex-1 ml-2 border-success text-success hover:bg-success hover:text-white"
              onClick={() => onSwipe('right')}
            >
              Postuler
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default JobCard;

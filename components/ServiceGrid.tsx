import React from 'react';
import { Service } from '../types';

interface ServiceGridProps {
  services: Service[];
  onServiceClick: (service: Service) => void;
}

const ServiceGrid: React.FC<ServiceGridProps> = ({ services, onServiceClick }) => {
  return (
    <div className="bg-white dark:bg-green-900 rounded-2xl p-4 shadow-sm dark:shadow-none">
      <div className="grid grid-cols-4 gap-4">
        {services.map(service => (
          <button
            key={service.id}
            onClick={() => onServiceClick(service)}
            className="flex flex-col items-center justify-center space-y-2 text-center group"
          >
            <div className="w-14 h-14 bg-gray-100 dark:bg-green-800 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 group-hover:bg-green-500 group-hover:text-white transition-all duration-200">
              {service.icon}
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-white">{service.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ServiceGrid;
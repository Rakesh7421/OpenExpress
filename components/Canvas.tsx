
import React, { useState } from 'react';
import { Icon } from './common/Icon';

const Canvas: React.FC = () => {
    const [zoom, setZoom] = useState(100);

    const handleZoomIn = () => setZoom(z => Math.min(z + 10, 200));
    const handleZoomOut = () => setZoom(z => Math.max(z - 10, 20));

  return (
    <div className="relative w-full h-full flex items-center justify-center">
        {/* The Artboard */}
        <div 
            className="bg-white shadow-2xl rounded-lg overflow-hidden transition-transform duration-300"
            style={{ 
                width: '800px', 
                height: '600px', 
                transform: `scale(${zoom / 100})` 
            }}
        >
            <div className="w-full h-full p-8 flex flex-col justify-center items-center bg-gradient-to-br from-indigo-100 to-purple-100">
                <h1 className="text-6xl font-extrabold text-gray-800">Your Design Title</h1>
                <p className="mt-4 text-xl text-gray-600">Start creating something amazing!</p>
                <div className="mt-8 w-3/4 h-48 bg-gray-300 rounded-md flex items-center justify-center">
                     <Icon name="image" className="w-16 h-16 text-gray-400" />
                </div>
            </div>
        </div>

        {/* Zoom Controls */}
        <div className="absolute bottom-4 right-4 flex items-center bg-gray-900/80 backdrop-blur-sm p-1 rounded-lg shadow-lg border border-gray-700/50">
            <button onClick={handleZoomOut} className="p-2 text-gray-400 hover:text-white rounded-md transition-colors">
                <Icon name="minus" className="w-5 h-5"/>
            </button>
            <span className="px-3 text-sm font-semibold w-16 text-center">{zoom}%</span>
            <button onClick={handleZoomIn} className="p-2 text-gray-400 hover:text-white rounded-md transition-colors">
                <Icon name="plus" className="w-5 h-5"/>
            </button>
        </div>
    </div>
  );
};

export default Canvas;

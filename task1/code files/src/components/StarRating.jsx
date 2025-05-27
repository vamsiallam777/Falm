import React from 'react';

const StarRating = ({ rating, maxRating = 5, size = 'md', interactive = false, onChange }) => {
  const sizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const handleStarClick = (starValue) => {
    if (interactive && onChange) {
      onChange(starValue);
    }
  };

  return (
    <div className={`star-rating ${sizes[size]}`}>
      {[...Array(maxRating)].map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= rating;
        
        return (
          <span
            key={index}
            className={`star ${isFilled ? '' : 'empty'} ${interactive ? 'cursor-pointer hover:scale-110' : ''}`}
            onClick={() => handleStarClick(starValue)}
          >
            ★
          </span>
        );
      })}
      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
        {rating.toFixed(1)}
      </span>
    </div>
  );
};

export default StarRating;
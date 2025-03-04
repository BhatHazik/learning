import { useState } from 'react';
import './RatingPopUp.css'; // You'll need this to style the popup

const RatingPopUp = ({ onClose, onSubmit, courseId }) => {
  const [rating, setRating] = useState(0);

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleSubmit = () => {
    onSubmit(rating, courseId); // Trigger submission with selected rating
    onClose(); // Close the popup
  };

  return (
    <div className="rating-popup">
      <div className="rating-popup-content">
        <h3>Rate this Course</h3>
        <div className="stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={rating >= star ? "filled-star" : "empty-star"}
              onClick={() => handleRatingChange(star)}
            >
              ⭐
            </span>
          ))}
        </div>
        <div className="rating-popup-actions">
          <button onClick={handleSubmit}>Submit</button>
          <button onClick={onClose}>Discard</button>
        </div>
      </div>
    </div>
  );
};

export default RatingPopUp;

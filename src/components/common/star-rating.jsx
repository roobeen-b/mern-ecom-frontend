import { StarIcon } from "lucide-react";

// eslint-disable-next-line react/prop-types
const StarRatings = ({ ratingValue, setRatingValue }) => {
  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon
          key={star}
          className={`w-6 h-6 cursor-pointer hover:fill-yellow-500 ${
            star <= ratingValue ? "fill-yellow-500" : ""
          }`}
          onClick={setRatingValue ? () => setRatingValue(star) : null}
        />
      ))}
    </div>
  );
};

export default StarRatings;

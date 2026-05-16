import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import newRequest from "../../utils/newRequest";
import "./review.scss";

const Review = ({ review }) => {
  const [like, setLike] = useState(false);
  const [dislike, setDislike] = useState(false);

  // Fetch user data
  const { isLoading, error, data } = useQuery({
    queryKey: ["user", review.userId],
    queryFn: () =>
      review.userId
        ? newRequest.get(`/users/${review.userId}`).then((res) => res.data)
        : null,
    enabled: !!review.userId, // only run if userId exists
  });

  const handleLike = () => setLike(true);
  const handleDislike = () => setDislike(true);

  return (
    <div className="review">
      {isLoading ? (
        "loading"
      ) : error ? (
        "error"
      ) : (
        <div className="user">
          <img
            className="pp"
            src={data?.img || "/images/noavtar.jpeg"}
            alt={data?.username || "User"}
          />
          <div className="info">
            <span>{data?.username || "Unknown User"}</span>
            <div className="country">
              <span>{data?.country || "Unknown Country"}</span>
            </div>
          </div>
        </div>
      )}

      <div className="stars">
        {Array(review.star)
          .fill()
          .map((_, i) => (
            <img src="/images/star.png" alt="star" key={i} />
          ))}
        <span>{review.star}</span>
      </div>

      <p>{review.desc}</p>

      <div className="helpful">
        <span>Helpful?</span>
        <img
          src={like ? "/images/like.png" : "/images/likeColor.png"}
          alt="like"
          onClick={handleLike}
        />
        <span>Yes</span>
        <img
          src={dislike ? "/images/dislike.png" : "/images/dislike_color.png"}
          alt="dislike"
          onClick={handleDislike}
        />
        <span>No</span>
      </div>
    </div>
  );
};

export default Review;

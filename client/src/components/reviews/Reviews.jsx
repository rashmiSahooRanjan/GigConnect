import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import newRequest from "../../utils/newRequest";
import Review from "../review/Review";
import "./reviews.scss";

const Reviews = ({ gigId }) => {
  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery({
    queryKey: ["reviews", gigId],
    queryFn: () =>
      newRequest.get(`/reviews/${gigId}`).then((res) => res.data),
  });

  const mutation = useMutation({
    mutationFn: (review) => {
      return newRequest.post("/reviews", review, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["reviews", gigId]);
    },
  });

  // Controlled form inputs
  const [desc, setDesc] = useState("");
  const [star, setStar] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ gigId, desc, star });
    setDesc("");
    setStar(1);
  };

  return (
    <div className="reviews">
      <h2>Reviews</h2>
      {isLoading ? (
        "Loading..."
      ) : error ? (
        "Something went wrong!"
      ) : (
        data?.map((review) => <Review key={review._id || Math.random()} review={review} />)
      )}

      <div className="add">
        <h3>Add a review</h3>
        <form className="addForm" onSubmit={handleSubmit}>
          <input
            type="text"
            name="desc"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Write your opinion"
            required
          />
          <select
            name="star"
            value={star}
            onChange={(e) => setStar(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default Reviews;

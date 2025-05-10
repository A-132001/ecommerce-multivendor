import React from 'react';

export default function ReviewSection({ productId }) {
  const dummyReviews = [
    { user: "Ali", comment: "Great product!" },
    { user: "Sara", comment: "Loved it!" }
  ];

  return (
    <div style={{ marginTop: '30px' }}>
      <h3>Reviews</h3>
      <ul>
        {dummyReviews.map((review, idx) => (
          <li key={idx}>
            <strong>{review.user}:</strong> {review.comment}
          </li>
        ))}
      </ul>
    </div>
  );
}

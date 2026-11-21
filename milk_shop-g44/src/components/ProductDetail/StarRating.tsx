interface StarRatingProps {
  value: number;
  className?: string;
}
export default function StarRating({ value, className = "" }: StarRatingProps) {
  const stars: string[] = [];
  for (let i = 1; i <= 5; i++) {
    if (value >= i - 0.25) {
      stars.push("bi-star-fill");
    } else if (value >= i - 0.75) {
      stars.push("bi-star-half");
    } else {
      stars.push("bi-star");
    }
  }
  return (
    <span className={"star-rating " + className} role="img" aria-label={value + " trên 5 sao"}>
      {stars.map((icon, index) => (
        <i key={index} className={"bi " + icon}></i>
      ))}
    </span>
  );
}



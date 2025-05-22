export const returnCategoryIcon = (category: string) => {
  console.log("category", category);
  switch (category) {
    case "Other":
      return <i className="fa-solid fa-file" />;
    case "Game":
      return <i className="fa-solid fa-gamepad" />;
    case "Movie":
      return <i className="fa-solid fa-film" />;
    case "Music":
      return <i className="fa-solid fa-music" />;
    case "Book":
      return <i className="fa-solid fa-book" />;
    case "Food":
      return <i className="fa-solid fa-utensils" />;
    case "Travel":
      return <i className="fa-solid fa-plane" />;
    case "Hobby":
      return <i className="fa-solid fa-futbol" />;
    case "Health":
      return <i className="fa-solid fa-heart" />;
    case "Event":
      return <i className="fa-solid fa-paintbrush" />;
    default:
      return <i className="fa-solid fa-file" />;
  }
};

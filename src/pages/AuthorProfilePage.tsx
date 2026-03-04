import { useNavigate, useParams } from "react-router-dom";
import { useGetAuthorByIdQuery } from "../store/Api/AuthorApi";
import defaultAvatar from "../images/icons8-user-default-64.png"

export const ProfileAuthorPage = () => {
  const { id } = useParams();
  const authorId = Number(id);
  const navigate = useNavigate()

  const { data: author, isLoading, error } = useGetAuthorByIdQuery(authorId, {
    skip: !id || Number.isNaN(authorId),
  });

  const bookPageClick = (id: number) => {
    navigate(`/book-profile-page/${id}`)
  }

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;
  if (!author) return <div>Author not found</div>;

  return (
    <div className="w-full my-auto py-6 flex flex-col justify-center gap-2">
      <img src={author.author_photo ? `http://localhost:5000${author.author_photo}` : defaultAvatar}
        alt="Аватар"
        className="rounded-md lg:w-[12rem] lg:h-[12rem] md:w-[10rem] md:h-[10rem] sm:w-[8rem] sm:h-[8rem] w-[7rem] h-[7rem]  bottom-[3rem]" />
      <h1 className="text-lg font-semibold">{author.name}</h1>
      <h2 className="text-lg font-semibold">{author.full_name}</h2>
      <p className="text-lg font-semibold">{author.country}</p>
      <p className="text-lg font-semibold">{author.description}</p>

      <h2 className="text-xl sm:text-xl md:text-xl chelsea-market-regular font-bold text-[#117278] mt-5">Books</h2>
      {author.book.length === 0 ? (
        <div>No books yet</div>
      ) : (
        author.book.map((b) => <div key={b.id} onClick={() => bookPageClick(b.id)}>{b.name}</div>)
      )}
    </div>
  );
};

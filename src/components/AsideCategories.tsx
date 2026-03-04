// import { useState } from "react"
// import { useGetCategoryQuery } from "../store/Api/CategoryApi";

// export const  AsideCategory = () => {
//     const [query, setQuery] = useState("");
//     const{data: categories}= useGetCategoryQuery(id)
//     return (
//         <aside >
//             <input type="text" value={query} onChange={(e)=> {setQuery(e.target.value)}}/>
//             {categories?.map (c => (
//                 <div key={c.id}>{c.name}</div>
//             ))}
//         </aside>
//     )
// }
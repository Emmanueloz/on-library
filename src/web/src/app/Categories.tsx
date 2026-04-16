import { useCategories } from "../hooks/useCategories";

function Categories() {
     const { categories, errorCategories, isLoading } = useCategories();

     if (isLoading) {
       return (
         <>
           <p>loading</p>
         </>
       );
     }

     return (
       <>
         {errorCategories ?? <p>{errorCategories}</p>}

         <main className="p-2">
           <section>
             {categories.map((c) => (
               <div key={c.id}>
                 <span>{c.name}</span>
               </div>
             ))}
           </section>
         </main>
       </>
     );

}

export {Categories}
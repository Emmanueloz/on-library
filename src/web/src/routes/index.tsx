import { BrowserRouter, Route, Routes } from "react-router";
import { Home } from "../app/Home";
import { Serie } from "../app/Serie";
import { Chapter } from "../app/Chapter";
import { Layout } from "../app/__Layout";
import { Library } from "../app/Library";
import { Titles } from "../app/Titles";
import { Tags } from "../app/Tags";
import { Categories } from "../app/Categories";
import { Series } from "../app/series/Series";

function AppRouter() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="library" element={<Library />} />
            <Route path="titles" element={<Titles />} />
            <Route path="serie">
              <Route path=":id" element={<Serie />} />
            </Route>
            <Route path="chapter">
              <Route path=":id" element={<Chapter />} />
            </Route>
            <Route path="dashboard">
              <Route path="series" element={<Series />} />
              <Route path="tags" element={<Tags />} />
              <Route path="categories" element={<Categories />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
export { AppRouter };

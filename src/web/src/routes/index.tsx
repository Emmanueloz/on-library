import { BrowserRouter, Route, Routes } from "react-router";
import { Home } from "../app/Home";
import { Serie } from "../app/Serie";
import { Chapter } from "../app/Chapter";
import { Layout } from "../app/__Layout";
import { Library } from "../app/Library";
import { Titles } from "../app/Titles";
import { Tags } from "../app/dashboard/Tags";
import { Categories } from "../app/dashboard/Categories";
import { SignIn } from "../app/auth/SignIn";
import { SignUp } from "../app/auth/SignUp";
import { ContentIndex } from "../app/dashboard/content";
import { CreateSerie } from "../app/dashboard/content/create";
import { EditSerie } from "../app/dashboard/content/serie";
import { EditChapter } from "../app/dashboard/content/chapter";
import { DashboardLayout } from "../app/dashboard/__DashboardLayout";
import { Dashboard } from "../app/dashboard";
import { Profile } from "../app/auth/Profile";

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
            <Route path="dashboard" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="content" element={<ContentIndex />} />
              <Route path="content/create" element={<CreateSerie />} />
              <Route path="content/serie/:id" element={<EditSerie />} />
              <Route path="content/chapter/:id" element={<EditChapter />} />
              <Route path="tags" element={<Tags />} />
              <Route path="categories" element={<Categories />} />
            </Route>
          </Route>
          <Route path="auth">
            <Route path="login" element={<SignIn />} />
            <Route path="register" element={<SignUp />} />
            <Route path="profile" element={<Layout />}>
              <Route index element={<Profile />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
export { AppRouter };

import { BrowserRouter, Route, Routes } from "react-router";
import { Home } from "../app/Home";
import { Serie } from "../app/Serie";
import { Chapter } from "../app/Chapter";
import { Layout } from "../app/__Layout";
import { Library } from "../app/library/Library";
import { Titles } from "../app/Titles";
import { Tags } from "../app/dashboard/Tags";
import { Categories } from "../app/dashboard/Categories";
import { Login } from "../app/auth/Login";
import { Register } from "../app/auth/Register";
import { ContentIndex } from "../app/dashboard/content";
import { CreateSerie } from "../app/dashboard/content/create";
import { DashboardLayout } from "../app/dashboard/__DashboardLayout";
import { Dashboard } from "../app/dashboard";
import { Profile } from "../app/auth/Profile";
import { AuthProvider } from "../context/AuthContex";
import { AuthLayout } from "../app/auth/__AuthLayout";
import { Libraries } from "../app/library/Libraries";
import { EditSerie } from "../app/dashboard/content/serie";
import { EditChapter } from "../app/dashboard/content/chapter";
import { Users } from "../app/dashboard/Users";

function AppRouter() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="libraries">
              <Route index element={<Libraries />} />
              <Route path=":id" element={<Library />} />
            </Route>
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
              <Route path="users" element={<Users />} />
            </Route>
            <Route path="auth" element={<AuthLayout />}>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="profile">
                <Route index element={<Profile />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
export { AppRouter };

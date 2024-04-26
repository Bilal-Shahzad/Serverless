import { Route, Routes } from "react-router-dom";
import Home from "./containers/Home.tsx";
import NotFound from "./containers/NotFound.tsx";
import Login from "./containers/Login.tsx";
import Signup from "./containers/Signup.tsx";
import NewNote from "./containers/NewNote.tsx";
import Notes from "./containers/Notes.tsx";
import Settings from "./containers/Settings.tsx";

export default function Links() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<NotFound />} />;
      <Route
  path="/login"
  element={
    <UnauthenticatedRoute>
      <Login />
    </UnauthenticatedRoute>
  }
/>
<Route
  path="/signup"
  element={
    <UnauthenticatedRoute>
      <Signup />
    </UnauthenticatedRoute>
  }
/>
<Route
  path="/settings"
  element={
    <AuthenticatedRoute>
      <Settings />
    </AuthenticatedRoute>
  }
/>
<Route
  path="/notes/new"
  element={
    <AuthenticatedRoute>
      <NewNote />
    </AuthenticatedRoute>
  }
/>

<Route
  path="/notes/:id"
  element={
    <AuthenticatedRoute>
      <Notes />
    </AuthenticatedRoute>
  }
/>
    </Routes>
  );
}